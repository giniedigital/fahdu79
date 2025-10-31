//todo:This modal will popup when user click on clip in chatWindow Text Input

import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import Modal from 'react-native-modal';
import {
  toggleChatWindowClipModal,
  toggleChatWindowAttachmentPreviewModal,
  toggleAttachmentMediaLoading,
  toggleChatWindowPreviewSheet,
} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {chatWindowAttachmentList} from '../../../DesiginData/Data';
import DIcon from '../../../DesiginData/DIcons';

import {pick, types, isCancel} from '@react-native-documents/picker';

import {setMediaData} from '../../../Redux/Slices/NormalSlices/MessageSlices/ChatWindowPreviewDataSlice';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {generateBase64Image} from '../../../FFMPeg/FFMPegModule';
import {ChatWindowError} from '../ErrorSnacks';
import ImageCropPicker from 'react-native-image-crop-picker';
import {makeid, WIDTH_SIZES} from '../../../DesiginData/Utility';
import {Image} from 'expo-image';

const selectDocument = async () => {
  try {
    const docInfo = await pick({
      type: [types.pdf],
      multiple: false,
      copyTo: 'cachesDirectory',
    });

    if (docInfo?.size > 60000000) {
      ChatWindowError('PDF Size must be lower than 60 MB');
      return 0;
    }
    return docInfo;
  } catch (e) {
    if (isCancel(e)) {
      console.log('User cancelled document selection.');
      return undefined;
    }
    console.log('CWClip SelectDocument Error', e.message);
    return undefined;
  }
};

const selectMediaImage = async type => {
  try {
    if (type === 'photo') {
      const mediaImageInfo = await launchImageLibrary({mediaType: 'photo'});

      if (mediaImageInfo?.assets[0]?.fileSize > 20000000) {
        //20 MB
        ChatWindowError('Image Size must be lower than 20 MB');
        return {didCancel: true};
      } else {
        if (mediaImageInfo?.didCancel !== true) {
          let dePixeldPreviewBase64MediaInfo = await generateBase64Image(
            mediaImageInfo?.assets[0]?.uri,
          );

          return {
            mediaImageInfo: {
              uri: mediaImageInfo?.assets[0].uri,
              name: mediaImageInfo?.assets[0].fileName,
              type: mediaImageInfo?.assets[0].type,
            },
            dePixeldPreviewBase64MediaInfo,
          };
        } else {
          return {didCancel: true};
        }
      }
    } else {
      const mediaImageInfo = await ImageCropPicker.openCamera({
        mediaType: 'photo',
      });

      let dePixeldPreviewBase64MediaInfo = await generateBase64Image(
        mediaImageInfo?.path,
      );

      return {
        mediaImageInfo: {
          uri: mediaImageInfo?.path,
          name: makeid(6) + 'frommsgcam',
          type: mediaImageInfo?.mime,
        },
        dePixeldPreviewBase64MediaInfo,
      };
    }
  } catch (e) {
    console.log('CWClip SelectMediaImage Error', e.message);
    return {didCancel: true};
  }
};

const selectMediaVideo = async () => {
  try {
    const mediaVideoInfo = await launchImageLibrary({
      mediaType: Platform.OS === 'ios' ? 'video' : 'mixed',
      selectionLimit: 1,
      assetRepresentationMode: 'current',
    }); //!odo : FilesSize lagana hai

    if (
      mediaVideoInfo?.assets[0]?.type?.search('mp4') >= 0 ||
      mediaVideoInfo?.assets[0]?.type?.search('mov') >= 0 ||
      mediaVideoInfo?.assets[0]?.type?.search('quicktime') >= 0
    ) {
      if (mediaVideoInfo.assets[0].fileSize <= 60000000) {
        return mediaVideoInfo;
      } else {
        ChatWindowError('Video size must be lower than 60 MB');
        return undefined;
      }
    } else {
      ChatWindowError('Only mp4 or mov video format allowed');
      return undefined;
    }
  } catch (e) {
    console.log('CWClip SelectMediaVideo Error', e.message);
    return undefined;
  }
};

export const afterImageClipSelected = (dispatcher, type = 'photo') => {
  console.log('Selected One 🖼️');

  selectMediaImage(type).then(e => {
    if (e?.didCancel !== true) {
      console.log('🖼️ File selected');
      dispatcher(setMediaData({type: 1, mediaImageInfoSet: e}));
      type === 'photo'
        ? dispatcher(toggleChatWindowClipModal())
        : console.log('Was Camera 🎃');
      dispatcher(toggleChatWindowPreviewSheet({show: 1}));
      dispatcher(toggleAttachmentMediaLoading({show: false}));
    } else {
      console.log('🖼️  No media selected', e.message);
      dispatcher(toggleAttachmentMediaLoading({show: false}));
    }
  });
};

const ChatWindowClipModal = () => {
  const modalVisibility = useSelector(
    state => state.hideShow.visibility.chatWindowClipModal,
  );

  const dispatcher = useDispatch();

  const handleClipSelectedMedia = ({id}) => {
    dispatcher(toggleAttachmentMediaLoading({show: true}));

    if (id === 1) {
      afterImageClipSelected(dispatcher);
    } else if (id === 2) {
      console.log('Selected Two 🎥');
      selectMediaVideo().then(e => {
        dispatcher(toggleAttachmentMediaLoading({show: false}));

        if (e) {
          dispatcher(setMediaData({type: 2, fileData: e?.assets[0]}));
          dispatcher(toggleChatWindowClipModal());
          dispatcher(toggleChatWindowPreviewSheet({show: 1}));
        } else {
          console.log('📁 No Video file selected');
          dispatcher(toggleAttachmentMediaLoading({show: false}));
        }
      });
    } else {
      console.log('Selected Three 📝');
      selectDocument().then(e => {
        if (e) {
          console.log('📁 Selected file ', e);
          dispatcher(setMediaData({type: 3, fileData: e}));
          dispatcher(toggleChatWindowClipModal());
          dispatcher(toggleChatWindowPreviewSheet({show: 1}));
          dispatcher(toggleAttachmentMediaLoading({show: false}));
        } else {
          console.log('📁 No file selected');
          dispatcher(toggleAttachmentMediaLoading({show: false}));
        }
      });
    }
  };

  return (
    modalVisibility && (
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        animationInTiming={250}
        animationOutTiming={50}
        onRequestClose={() => dispatcher(toggleChatWindowClipModal())}
        transparent={true}
        isVisible={modalVisibility}
        backdropColor="transparent"
        onBackButtonPress={() => dispatcher(toggleChatWindowClipModal())}
        onBackdropPress={() => dispatcher(toggleChatWindowClipModal())}
        useNativeDriver={true}
        style={{
          width: '100%',
          alignSelf: 'center',
          height: '100%',
          justifyContent: 'flex-start',
        }}>
        <View style={styles.modalInnerWrapper}>
          <FlatList
            data={chatWindowAttachmentList}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={handleClipSelectedMedia.bind(null, {id: item.id})}>
                <View style={styles.eachSortModalList}>
                  <View style={styles.verifyContainer}>
                    <Image
                      cachePolicy="memory-disk"
                      source={item.url}
                      contentFit="contain"
                      style={{flex: 1}}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            style={{marginTop: responsiveWidth(3)}}
          />
        </View>
      </Modal>
    )
  );
};

export default ChatWindowClipModal;

const styles = StyleSheet.create({
  modalInnerWrapper: {
    height: responsiveWidth(47.2),
    width: responsiveWidth(16),
    backgroundColor: '#FFF9F5',
    alignSelf: 'flex-center',
    marginLeft: responsiveWidth(6.5),
    marginTop: responsiveHeight(65),
    borderRadius: WIDTH_SIZES[14],
    paddingHorizontal: responsiveWidth(4),
    borderWidth: WIDTH_SIZES[1.5],
    borderColor: '#1e1e1e',
    elevation: 1,
  },
  eachSortByModalListText: {
    fontSize: responsiveFontSize(2.5),
    color: '#353535',
    letterSpacing: 1,
  },
  eachSortModalList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: responsiveWidth(3.4),
  },
  verifyContainer: {
    height: WIDTH_SIZES[24] + WIDTH_SIZES[2],
    width: WIDTH_SIZES[24] + WIDTH_SIZES[2],
    // backgroundColor : 'red'
  },
});
