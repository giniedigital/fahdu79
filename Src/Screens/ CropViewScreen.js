import {Button, StyleSheet, Text, View, TouchableOpacity, Pressable, ActivityIndicator, FlatList, Vibration, Platform} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {CropView} from 'react-native-image-crop-tools';
import {useNavigation} from '@react-navigation/native';
import {responsiveHeight, responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import {useUpdatePicturesMutation, useUploadAttachmentMutation} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {useDispatch, useSelector} from 'react-redux';
import {token as memoizedToken, updateCoverProfilePicture, updatePicture} from '../../Redux/Slices/NormalSlices/AuthSlice';
import {autoLogout} from '../../AutoLogout';
import {LoginPageErrors, chatRoomSuccess} from '../Components/ErrorSnacks';
import {padios} from '../../DesiginData/Utility';
import AnimatedButton from '../Components/AnimatedButton';
import RNFS from 'react-native-fs';

import {Image} from 'expo-image';
import {convertPngToJpeg, resizeImage} from '../../FFMPeg/FFMPegModule';
import {ScrollView} from 'react-native-gesture-handler';

// const aspectRatiosObject = [
//   {
//     id : 1,
//     title : "4:5",
//     h : 4,
//     w : 5
//   },
//   {
//     id : 2,
//     title : "1:1",
//     h : 1,
//     w : 1
//   },
//   {
//     id : 3,
//     title : "16:9",
//     h : ,
//     w : 16
//   },

// ]

const aspectImages = [
  {
    id: 1,
    uri: require('../../Assets/Images/CreatePost/1.png'),
    height: 40,
    width: 32,
  },
  {
    id: 2,
    uri: require('../../Assets/Images/CreatePost/2.png'),
    height: 32,
    width: 32,
  },
  {
    id: 3,
    uri: require('../../Assets/Images/CreatePost/3.png'),
    height: 32,
    width: 57,
  },
];

const CropViewScreen = ({route}) => {
  console.log(route?.params, 'PPP');

  RNFS.stat(route?.params?.uri)
    .then(stat => {
      console.log(`File size: ${stat.size} bytes`);
      console.log(`File size: ${(stat.size / 1024).toFixed(2)} KB`);
      console.log(`File size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
    })
    .catch(error => {
      console.error('Error getting file size:', error);
    });

  const cropViewRef = useRef();

  const navigation = useNavigation();

  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(5);

  const {uri} = route.params;

  const token = useSelector(state => state.auth.user.token);

  const handleSaveImage = () => {
    let x = cropViewRef.current.saveImage(true, 90);
    console.log(x);
  };

  const [uploadAttachment, {error}] = useUploadAttachmentMutation();
  const [updatePicture] = useUpdatePicturesMutation();

  const userInfo = useSelector(state => state.auth.user);

  const [uploading, setUploading] = useState(false);

  const [selected, setSelected] = useState(0);

  const dispatch = useDispatch();

  const handleSelectImage = async x => {
    if (route?.params?.type === undefined) {
      // navigation.navigate('createpostpage', x);

      setUploading(true);

      let convertedImage = await convertPngToJpeg(x?.uri, `${RNFS.TemporaryDirectoryPath}${Date.now()}.jpg`);

      setUploading(false);

      navigation.navigate('createpostpage', {
        height: x?.height,
        width: x?.width,
        uri: convertedImage,
      });
    } else if (route?.params?.type === 'massMessage') {
      setUploading(true);

      let convertedImage = await convertPngToJpeg(x?.uri, `${RNFS.TemporaryDirectoryPath}${Date.now()}.jpg`);

      setUploading(false);

      navigation.navigate('massMessageMedia', {
        height: x?.height,
        width: x?.width,
        uri: convertedImage,
      });
    } else {
      let formData = new FormData();

      const inputPath = Platform.select({
        ios: x?.uri,
        android: x?.uri,
      });

      const outputPath = Platform.select({
        ios: `${RNFS.TemporaryDirectoryPath}output_resized.jpg`,
        android: `${RNFS.CachesDirectoryPath}/output_resized.jpg`,
      });

      resizeImage(inputPath, outputPath)
        .then(resizedPath => {
          console.log('Image resized successfully at:', resizedPath);
          formData.append('keyName', 'profile');

          formData.append('file', {
            name: 'editProfile',
            type: 'image/jpeg',
            uri: `file://${resizedPath}`,
          });

          setUploading(true);

          uploadAttachment({token, formData}).then(e => {
            // if (e?.error?.data?.status_code === 401) {
            //   autoLogout();
            // }

            console.log(e?.error, 'LLLLLL');

            if (e?.data?.statusCode === 200) {
              let x = {
                profile_image: {
                  url: route?.params?.type === 'Profile' ? e?.data?.data?.url : userInfo?.currentUserProfilePicture,
                  type: 'profile',
                },
                cover_photo: {
                  url: route?.params?.type === 'Cover' ? e?.data?.data?.url : userInfo?.currentUserCoverPicture,
                  type: 'coverImage',
                },
              };

              updatePicture({token, data: x}).then(e => {
                if (e?.data?.statusCode === 200) {
                  setUploading(false);

                  dispatch(updateCoverProfilePicture({coverUrl: e?.data?.data?.cover_photo?.url, profileUrl: e?.data?.data?.profile_image?.url}));

                  chatRoomSuccess(`Successfully updated your ${route?.params?.type} picture`);

                  navigation.goBack();
                } else {
                  console.log('After Upload Change Picture', e);

                  setUploading(false);
                }
              });
            } else {
              console.log(e, 'OOOOOO');
              if (e?.error?.status === 'FETCH_ERROR') {
                LoginPageErrors('Please check your network');
                setUploading(false);
              }
            }
          });
        })
        .catch(error => {
          console.error('Resize failed:', error);
        });
    }
  };

  const handleSetAspectRatio = (h, w, index) => {
    if (Platform.OS === 'android') {
      Vibration.vibrate(10);
    }

    setSelected(index);
    setWidth(w);
    setHeight(h);
  };

  useEffect(() => {
    if (route?.params?.type) {
      if (route?.params?.type === 'Profile') {
        setWidth(1);
        setHeight(1);
      } else {
        setWidth(16);
        setHeight(9);
      }
    }
  }, [route?.params?.type]);

  /*
  

  
  */

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {uri ? (
        <>
          <CropView
            iosDimensionSwapEnabled
            sourceUrl={uri}
            style={[styles.cropView, route?.params?.type === undefined ? {height: 425} : {height: responsiveWidth(130)}]}
            ref={cropViewRef}
            onImageCrop={res => handleSelectImage({...res, height, width})}
            aspectRatio={{width, height}}
          />
          {/* <Button title='Save' onPress={() => handleSaveImage()} /> */}

          {route?.params?.type === undefined && <Text style={{textAlign: 'left', fontFamily: 'Rubik-Medium', color: '#282828', marginTop: 24, fontSize: responsiveFontSize(2.3), marginLeft: 26}}>Choose Aspect Ratio</Text>}

          {route?.params?.type === undefined || route?.params?.type === 'massMessage' ? (
            <FlatList
              data={[
                {h: 4, w: 5},
                {h: 1, w: 1},
                {h: 16, w: 9},
              ]}
              showsHorizontalScrollIndicator={false}
              horizontal
              renderItem={({item, index}) => (
                <TouchableOpacity key={`AspectResizer${index}`} style={[styles.eachRatioBox, index === selected ? styles.selectedBox : {}]} onPress={() => handleSetAspectRatio(item.w, item.h, index)}>
                  <View style={{height: aspectImages[index].height, width: aspectImages[index].width}}>
                    <Image source={aspectImages[index]?.uri} contentFit="contain" style={{flex: 1}} />
                  </View>
                  <Text style={styles.aspectRatioNumber}>{`${item.h}:${item.w}`}</Text>
                </TouchableOpacity>
              )}
              style={{alignSelf: 'center', marginHorizontal: 18, marginTop: 12, maxHeight: 119}}
              keyExtractor={(item, index) => index.toString()}
              // contentContainerStyle={{alignItems: 'center', alignSelf: 'center', justifyContent: 'center', }}
              ItemSeparatorComponent={() => <View style={{marginHorizontal: 9}} />}
            />
          ) : null}

          <View style={{position: 'relative', alignSelf: 'center', width: responsiveWidth(90), marginBottom: responsiveWidth(8)}}>
            <AnimatedButton title={route?.params?.type === undefined ? 'Next' : 'Update'} loading={uploading} onPress={() => cropViewRef.current.saveImage()} buttonMargin={route?.params?.type === undefined || route?.params?.type === 'massMessage' ? 6 : 30} />
          </View>
        </>
      ) : (
        <Text>Uri Not Present</Text>
      )}
    </ScrollView>
  );
};

export default CropViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cropView: {
    height: responsiveHeight(50),
    backgroundColor: '#f3f3f3',
  },
  aspectRatioContainer: {
    // padding: responsiveWidth(1),
    flexDirection: 'row',
    justifyContent: 'center',

    // backgroundColor : 'green',
    // gap: responsiveWidth(12),
    // marginTop: responsiveWidth(10),
  },

  eachRatioBox: {
    padding: responsiveWidth(2),
    // borderWidth: 2,
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(2),
    borderColor: '#282828',
    backgroundColor: '#f3f3f3',
  },

  loginButton: {
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#ffa07a',
    borderRadius: responsiveWidth(2),
    color: '#282828',
    textAlign: 'center',
    fontFamily: 'Rubik-Bold',
    elevation: 1,
    fontWeight: '600',
    width: responsiveWidth(32),
    height: responsiveWidth(10),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderTopColor: '#282828',
    borderLeftColor: '#282828',
    elevation: 1,
    fontSize: responsiveFontSize(2.4),
    padding: padios(responsiveWidth(2.6)),
    overflow: 'hidden',
    marginTop: responsiveWidth(6),
  },
  eachRatioBox: {
    width: 102,
    height: 119,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  selectedBox: {
    borderColor: '#FF7043',
    backgroundColor: '#fff3eb',
    // backgroundColor: 'red',
    borderWidth: 1.5,
  },
  innerBox: {
    width: 30,
    height: 20,
    backgroundColor: '#000',
    opacity: 0.2,
    marginBottom: 5,
  },
  aspectRatioNumber: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    marginTop: responsiveWidth(2),
    color: '#1e1e1e',
  },
  iconContainer: {
    height: 40,
    width: 32,
    // backgroundColor : 'green'
  },
});
