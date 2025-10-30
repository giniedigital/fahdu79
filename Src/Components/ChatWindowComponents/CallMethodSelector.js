//todo:This modal will popup when user click on clip in chatWindow Text Input

import {StyleSheet, Text, View, Animated, TouchableOpacity, FlatList, PermissionsAndroid, ToastAndroid, Platform} from 'react-native';
import React from 'react';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import Modal from 'react-native-modal';
import {toggleCallMethodSelector, toggleCallPriceModal, toggleCallRequestModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {callMethodSelectorList} from '../../../DesiginData/Data';

import {makeid, WIDTH_SIZES} from '../../../DesiginData/Utility';
import {Image} from 'expo-image';

const CallMethodSelector = () => {
  const modalVisibility = useSelector(state => state.hideShow.visibility.callMethodSelector);

  const dispatcher = useDispatch();

  const handleClipSelectedMedia = ({id}) => {
    if (id === 1) {
      console.log('Video call');
      dispatcher(toggleCallPriceModal({show: true, type: 'video'}));
    }

    if (id === 2) {
      console.log('Audio call');
      dispatcher(toggleCallPriceModal({show: true, type: 'audio'}));
    }

    // onPress={() => }
    // dispatcher(toggleCallRequestModal({show : true}))
  };

  return (
    modalVisibility && (
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        animationInTiming={250}
        animationOutTiming={50}
        onRequestClose={() => dispatcher(toggleCallMethodSelector({show: false}))}
        transparent={true}
        isVisible={modalVisibility}
        backdropColor="transparent"
        onBackButtonPress={() => dispatcher(toggleCallMethodSelector({show: false}))}
        onBackdropPress={() => dispatcher(toggleCallMethodSelector({show: false}))}
        useNativeDriver={true}
        style={{
          width: '100%',
          alignSelf: 'center',
          height: '100%',
          justifyContent: 'flex-start',
        }}>
        <View style={styles.modalInnerWrapper}>
          <FlatList
            data={callMethodSelectorList}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={handleClipSelectedMedia.bind(null, {id: item.id})}>
                <View style={styles.eachSortModalList}>
                  <View style={styles.verifyContainer}>
                    <Image cachePolicy="memory-disk" source={item.url} contentFit="contain" style={{flex: 1}} />
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

export default CallMethodSelector;

const styles = StyleSheet.create({
  modalInnerWrapper: {
    height: responsiveWidth(29),
    width: responsiveWidth(16),
    backgroundColor: '#FFF9F5',
    alignSelf: 'flex-center',
    marginLeft: responsiveWidth(77),
    marginTop: responsiveHeight(75),
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
    marginVertical: responsiveWidth(2),
  },
  verifyContainer: {
    height: WIDTH_SIZES[24] + WIDTH_SIZES[2],
    width: WIDTH_SIZES[24] + WIDTH_SIZES[2],
    // backgroundColor : 'red'
  },
});
