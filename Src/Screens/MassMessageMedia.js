import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Switch, Pressable, ActivityIndicator, ToastAndroid, Platform, InputAccessoryView, Keyboard, ScrollView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import DateTimePickerSheet from '../Components/CreatePostComponents/DateTimePickerSheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {toggleDateTimePicker, toggleFloatingViews, toggleShowChatRoomSelector} from '../../Redux/Slices/NormalSlices/HideShowSlice';
import {useCreatePostMutation, useSendMassMessageMutation, useUploadAttachmentMutation} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {generateBase64Image, generateVideoThumbnail, getImageSize, videoReducer} from '../../FFMPeg/FFMPegModule';
import {chatRoomSuccess, ChatWindowError, LoginPageErrors, successSnacks} from '../Components/ErrorSnacks';
import DIcon from '../../DesiginData/DIcons';
import {dismissProgressNotification, displayNotificationProgressIndicator} from '../../Notificaton';
import {autoLogout} from '../../AutoLogout';
import {FONT_SIZES, padios, selectionTwin, WIDTH_SIZES} from '../../DesiginData/Utility';
import {PERMISSIONS, RESULTS, checkMultiple, request} from 'react-native-permissions';
import ImageCropPicker from 'react-native-image-crop-picker';
import {addNewPostToMyProfileCache} from '../../Redux/Slices/NormalSlices/Posts/MyProfileFeedCacheSlice';
import Upload from '../../Assets/svg/uploadP.svg';
import {check} from 'react-native-permissions';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import AnimatedButton from '../Components/AnimatedButton';
import RNFS from 'react-native-fs';
import Paisa from '../../Assets/svg/paisa.svg';
import {resetMassMessage, setMassMessageLabel, setMassMessageTargetOnlinleOffline} from '../../Redux/Slices/NormalSlices/MessageSlices/MassMessage';
import {navigate} from '../../Navigation/RootNavigation';
import {removeRoomList} from '../../Redux/Slices/NormalSlices/RoomListSlice';
import {deleteCachedMessages} from '../../Redux/Slices/NormalSlices/MessageSlices/ThreadSlices';

const MassMessageMedia = ({route}) => {
  const height = route?.params?.height ?? 9;
  const width = route?.params?.width ?? 16;

  if (route?.params?.uri) {
    RNFS.stat(route?.params?.uri)
      .then(stat => {
        console.log(`File size: ${stat.size} bytes`);
        console.log(`File size: ${(stat.size / 1024).toFixed(2)} KB`);
        console.log(`File size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
      })
      .catch(error => {
        console.error('Error getting file size:', error);
      });
  }

  console.log(route?.params, '::::::');

  const [count, setCount] = React.useState(0);

  const inputAccessoryViewID = 'createPost';

  const [uploadAttachment, {error}] = useUploadAttachmentMutation();

  const [createPost] = useCreatePostMutation();

  const [date, setDate] = useState(new Date());

  const [caption, setCaption] = useState('');

  const token = useSelector(state => state.auth.user.token);

  const [base64Image, setBase64Image] = useState('');

  const [loading, setLoading] = useState(false);

  const [mediaUri, setMediaUri] = useState(undefined);

  const [videoUrl, setVideoUrl] = useState(undefined);

  const [isMediaVideo, setIsMediaVideo] = useState(false);

  const [mediaSelected, setMediaSelected] = useState(false);

  const [amount, setAmount] = useState(0);

  const [amountSub, setAmountSub] = useState(0);

  const [selectedItems, setSelectedItems] = useState([]);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const {target, status} = useSelector(state => state.massMessage.data);

  useEffect(() => {
    const itemsToPush = [...target.label];

    if (status.online) {
      itemsToPush.push('online');
    }

    if (status.offline) {
      itemsToPush.push('offline');
    }

    if (target.selectedUsers.length > 0) {
      itemsToPush.push('Random users');
    }

    setSelectedItems(itemsToPush);
  }, [target, status]);

  const handleTextInput = x => {
    setCount(x?.length);
    setCaption(x);
  };

  const [forSubscribers, setForSubscribers] = useState(false);

  const [isEnabled, setIsEnabled] = useState(false);

  const handleDeleteChip = name => {
    // setSelectedItems(prev => prev.filter(i => i !== item))

    console.log(name);

    if (['LABEL1', 'LABEL2', 'LABEL3']?.includes(name)) {
      dispatch(setMassMessageLabel({label: name}));
      setSelectedItems(prev => prev.filter(i => i !== name));
    }

    if (name === 'offline') {
      dispatch(setMassMessageTargetOnlinleOffline({status: {online: true, offline: false}}));
    }

    if (name === 'online') {
      dispatch(setMassMessageTargetOnlinleOffline({status: {online: false, offline: false}}));
    }
  };

  const BubbleView = ({selectedItems, setSelectedItems}) => {
    return (
      <View style={styles.bubbleContainer}>
        {selectedItems.map(item => (
          <View key={item} style={styles.bubble}>
            <Text style={styles.bubbleText}>{item}</Text>
            <Pressable onPress={() => handleDeleteChip(item)}>
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>
        ))}
      </View>
    );
  };

  const selectMedia = async () => {
    console.log('Selecting media');

    try {
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.MEDIA_LIBRARY).then(result => {
          if (result === RESULTS.BLOCKED) {
            Linking.openSettings();
          }
        });
      }

      // const mediaInfo = await launchImageLibrary({ mediaType: "mixed", selectionLimit : 1, assetRepresentationMode : 'auto' });

      const mediaInfo = await ImageCropPicker.openPicker({mediaType: 'any'});

      console.log(mediaInfo?.path, 'PATH');

      if (mediaInfo?.mime?.search('image') >= 0) {
        console.log('Image size', mediaInfo?.size);

        //Image size max 20
        if (mediaInfo?.size >= 20000000) {
          LoginPageErrors('Image size must be lower than 20 MB');

          return 0;
        } else {
          setMediaSelected(true);
          setIsMediaVideo(false);
          setVideoUrl(undefined);
          if (mediaInfo?.didCancel !== true) {
            navigation.navigate('cropViewScreen', {uri: Platform.OS === 'ios' ? 'file://' + mediaInfo?.path : mediaInfo?.path, type: 'massMessage'});
          }
        }
      } else {
        console.log(mediaInfo.size, mediaInfo?.size >= 60000000, '{{{}{}{}{}{}{}');

        if (mediaInfo?.size >= 60000000) {
          //Video size max 60

          LoginPageErrors('Video size must be lower than 60 MB');
          return 0;
        } else {
          setMediaSelected(true);
          setIsMediaVideo(true);
          generateVideoThumbnail(mediaInfo?.path).then(e => {
            console.log(e);
            setMediaUri(e);
            setVideoUrl(mediaInfo?.path);
          });
        }
      }
    } catch (e) {
      console.log('Selecitng media error', e.message);
    }
  };

  const openVideoPreview = () => {
    navigation.navigate('CreatePostVideoPreview', {videoUri: videoUrl});
  };

  useEffect(() => {
    if (isEnabled) {
      dispatch(toggleDateTimePicker({show: 1}));
    }
  }, [isEnabled]);

  useEffect(() => {
    console.log('Uri Changed');

    setMediaUri(route?.params?.uri);
  }, [route?.params?.uri]);

  const [sendMassMessage] = useSendMassMessageMutation();

  const handleSendPost = async () => {
    setLoading(true);

    if (mediaUri) {
      if (isMediaVideo) {
        console.log('Meida is video');

        if (caption === '') {
          LoginPageErrors('Please write message!');
          setLoading(false);
          return;
        }

        if (forSubscribers && amountSub <= 0) {
          LoginPageErrors('Please add amount!');
          setLoading(false);
          return;
        }

        await displayNotificationProgressIndicator();

        async function videoFormatter(uri) {
          const result = await videoReducer(uri);
          return result;
        }

        videoFormatter(videoUrl).then(async compressedVideoUrl => {
          if (compressedVideoUrl) {
            let compressedVideoThumbnail = await generateVideoThumbnail(compressedVideoUrl);

            const formData = new FormData();

            formData.append('keyName', 'mass_msg_vido_thmbnl');

            formData.append('file', {
              uri: compressedVideoThumbnail,
              type: 'image/jpg',
              name: 'image.jpg',
            });

            uploadAttachment({token, formData}).then(async e_thmb => {
              if (e_thmb?.error?.data?.status_code) {
                autoLogout();
              }

              if (e_thmb?.error?.status === 'FETCH_ERROR') {
                LoginPageErrors('Please check your network');
                setLoading(false);
                dismissProgressNotification();
              }

              if (e_thmb?.data?.statusCode === 200) {
                console.log(e_thmb?.data?.data?.url, 'Thumbnail');

                const formData = new FormData();

                formData.append('keyName', 'message_attachment');

                formData.append('file', {
                  uri: compressedVideoUrl,
                  type: 'video/mp4',
                  name: 'attachmentVideo.mp4',
                });

                uploadAttachment({token, formData}).then(async e => {
                  console.log(e, 'UPLOADIN_VIDEO');

                  if (e?.data?.statusCode === 200) {
                    // const videoUrlFromServer = e?.data?.data?.url;

                    let mediaObject = {
                      _body: {
                        message: caption || '',
                        attachment: {
                          url: e?.data?.data?.url,
                          format: 'video',
                          is_charagble: forSubscribers ? true : false,
                          charge_amount: forSubscribers ? amountSub : 0,
                          preview: e_thmb?.data?.data?.url,
                        },
                      },
                      target,
                      status,
                    };

                    const {data, error} = await sendMassMessage({token, data: mediaObject});

                    console.log(data, 'ERROR_VIDEO', error);

                    if (data) {
                      dispatch(removeRoomList());
                      dispatch(deleteCachedMessages());
                      dispatch(toggleShowChatRoomSelector({show: false}));
                      dispatch(toggleFloatingViews({show: 'showMessageFloat'}));
                      dispatch(resetMassMessage());
                      setLoading(false);
                      navigate('chatRoomTab');
                      chatRoomSuccess('Mass message sent successfully!');
                    }

                    if (error) {
                      LoginPageErrors('There was some error');
                      console.log('error video mass message', error);
                      setLoading(false);
                    }
                  }
                });
              }
            });
          }
        });
      } else {
        if (caption === '') {
          LoginPageErrors('Please write message!');
          setLoading(false);
          return;
        }

        if (forSubscribers && amountSub <= 0) {
          LoginPageErrors('Please add amount!');
          setLoading(false);
          return;
        }

        let formData = new FormData();

        await displayNotificationProgressIndicator();

        formData.append('keyName', 'create_post');

        formData.append('file', {
          name: 'ddfhlf.jpeg',
          type: 'image/jpeg',
          uri: `file://${mediaUri}`,
        });

        RNFS.stat(mediaUri)
          .then(stat => {
            console.log(`File size: ${stat.size} bytes`);
            console.log(`File size: ${(stat.size / 1024).toFixed(2)} KB`);
            console.log(`File size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
          })
          .catch(error => {
            console.error('Error getting file size:', error);
          });

        uploadAttachment({token, formData}).then(async e => {
          if (e?.error?.data?.status_code === 401) {
            autoLogout();
          }

          if (e?.error?.status === 'FETCH_ERROR') {
            LoginPageErrors('Please check your network');
            setLoading(false);
            dismissProgressNotification();
          }

          let tty = {
            _body: {
              attachment: {
                url: e?.data?.data?.url,
                format: 'image',
                is_charagble: forSubscribers ? true : false,
                charge_amount: forSubscribers ? amountSub : 0,
                preview: '',
              },
              message: caption || '',
            },
            target,
            status,
          };

          if (forSubscribers) {
            let url = `file://${mediaUri}`;
            let previewImage = await generateBase64Image(url);
            tty._body.attachment.preview = previewImage;
          }

          const {data, error} = await sendMassMessage({token, data: tty});

          if (error) {
            setLoading(false);
            ChatWindowError('Something went wrong!!@');
            console.log(error?.data);
          }

          if (data) {
            dispatch(removeRoomList());
            dispatch(deleteCachedMessages());
            dispatch(toggleShowChatRoomSelector({show: false}));
            dispatch(toggleFloatingViews({show: 'showMessageFloat'}));
            dispatch(resetMassMessage());
            setLoading(false);
            console.log(data?.statusCode);
            navigate('chatRoomTab');
            chatRoomSuccess('Mass message sent successfully!');
          }
        });
      }
    } else {
      LoginPageErrors('Please select media');
      setLoading(false);
    }
  };

  const handleAmount = (amount, type) => {
    console.log(amount, type, 'AMOUNT');

    setAmountSub(amount);
  };

  console.log('WIDO', width);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 50}}>
        <View style={{borderWidth: responsiveWidth(0.5), borderRadius: responsiveWidth(3.73), width: responsiveWidth(92)}}>
          <View style={styles.FollowersSubScribersToggle}>
            <TouchableOpacity onPress={() => setForSubscribers(!forSubscribers)} style={[styles.Followers, forSubscribers === false ? {backgroundColor: '#FFA86B', borderWidth: responsiveWidth(0.3), borderRadius: responsiveWidth(2.5)} : null]}>
              <Text style={{fontFamily: 'Rubik-SemiBold', fontSize: FONT_SIZES[14], color: '#282828'}} key={'1Followers'}>
                Free
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setForSubscribers(!forSubscribers)} style={[styles.SubScribers, forSubscribers === true ? {backgroundColor: '#FFA86B', borderWidth: responsiveWidth(0.3), borderRadius: responsiveWidth(2.5)} : null]}>
              <Text key={'2SubScribers'} style={{fontFamily: 'Rubik-SemiBold', fontSize: FONT_SIZES[14], color: '#282828'}}>
                Paid
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.textInputContainer}>
          {mediaUri ? (
            <View style={[styles.selectImageBox, route?.params && {flexDirection: 'row', alignItems: 'center'}, !isMediaVideo ? {aspectRatio: `${width}/${height}`} : {aspectRatio: '16/9'}]}>
              <View style={styles.imageContainer}>
                <Image source={{uri: `file://${mediaUri}`}} resizeMethod="resize" resizeMode="contain" style={{height: '100%', width: '100%', resizeMode: 'cover'}} />
                <TouchableOpacity onPress={selectMedia} style={styles.selectMedia}>
                  <Image source={require('../../Assets/Images/ChangeProfile.png')} style={{height: responsiveWidth(8), width: responsiveWidth(8), resizeMode: 'contain', zIndex: 8, alignSelf: 'center', marginRight: responsiveWidth(1)}} />
                </TouchableOpacity>
              </View>

              {isMediaVideo && (
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: responsiveWidth(1), marginTop: responsiveWidth(2), position: 'absolute', alignSelf: 'center'}} onPress={() => openVideoPreview()}>
                  <DIcon name={'play-circle'} provider={'FontAwesome5'} color="#fff" size={WIDTH_SIZES['36']} />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity style={styles.selectImageBox} onPress={selectMedia}>
              <View style={[styles.imageContainer, {marginVertical: WIDTH_SIZES['10'], marginTop: WIDTH_SIZES['84']}]}>
                {/* <Image source={require("../../Assets/Images/selectMedia.png")} resizeMethod="resize" resizeMode="contain" style={{ width: "100%" }} /> */}
                <Upload />
              </View>
              <Text style={{fontFamily: 'Rubik-Medium', textAlign: 'center', color: '#282828', fontSize: 14, marginBottom: 80}}>Click to upload your files </Text>
            </TouchableOpacity>
          )}

          <TextInput
            inputAccessoryViewID={inputAccessoryViewID}
            value={caption}
            style={styles.textInputStyle}
            maxLength={120}
            placeholder="Write caption here..."
            multiline
            onChangeText={x => handleTextInput(x)}
            autoCorrect={false}
            placeholderTextColor="#B2B2B2"
            selectionColor={selectionTwin()}
            cursorColor={'#1e1e1e'}
          />
          <Text style={styles.charCount}>{`${count}/120`}</Text>

          {Platform.OS === 'ios' && (
            <InputAccessoryView nativeID={inputAccessoryViewID}>
              <Pressable onPress={() => Keyboard.dismiss()} style={{alignSelf: 'center', borderRadius: responsiveWidth(2)}}>
                <Text
                  style={{
                    textAlign: 'center',
                    backgroundColor: '#f2f2f2',
                    alignSelf: 'flex-end',
                    padding: responsiveWidth(2),
                    overflow: 'hidden',
                  }}>
                  Done
                </Text>
              </Pressable>
            </InputAccessoryView>
          )}
        </View>
        {forSubscribers && (
          <View style={styles.box}>
            <Text style={styles.heading}>Set Price</Text>

            <Text style={styles.insideBoxTitle}>Set fee for the attachment</Text>

            <View style={[styles.amountInput, {alignSelf: 'center', width: '100%'}]}>
              <View style={{flexDirection: 'row'}}>
                <View style={[styles.titleback]}>
                  <Text style={[styles.titleSetPrice]}>Set Price</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
                <TextInput
                  maxLength={6}
                  keyboardType="number-pad"
                  autoCorrect={false}
                  placeholderTextColor="#B2B2B2"
                  selectionColor={selectionTwin()}
                  cursorColor={'#1e1e1e'}
                  style={[styles.amountStyle]}
                  textAlign="right"
                  value={amountSub}
                  onChangeText={t => handleAmount(t.replace(/[^0-9]/g, ''), true)}
                />
                <Paisa />
              </View>
            </View>
          </View>
        )}
        <View style={styles.box}>
          <Text style={styles.heading}>Audience</Text>
          <Text style={styles.insideBoxTitle}>Whom you want to send it to</Text>

          <BubbleView selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        </View>
        <View style={{width: '99%', justifyContent: 'center'}}>
          <AnimatedButton title={'Send'} buttonMargin={0} loading={loading} onPress={() => handleSendPost()} disabled={!mediaSelected} />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default MassMessageMedia;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: responsiveWidth(4),
    backgroundColor: '#ffffff',
    flex: 1,
    paddingTop: responsiveWidth(4),
    flexDirection: 'column',
  },

  selectImageBox: {
    borderWidth: responsiveWidth(0.5),
    borderRadius: 10,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    position: 'relative',
  },

  imageContainer: {
    alignSelf: 'center',
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(2),
    width: '100%',
    overflow: 'hidden',
    objectFit: 'cover',
    // backgroundColor : 'red',
  },
  textInputContainer: {
    borderWidth: responsiveWidth(0.5),
    marginTop: responsiveWidth(4),
    padding: 13,
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(4),
    // height: 275,
  },
  textInputStyle: {
    // backgroundColor: 'green',
    width: '100%',
    paddingLeft: responsiveWidth(2),
    fontFamily: 'Rubik-Regular',
    textAlignVertical: 'top',
    marginTop: 8,
    fontSize: 14,
    color: '#1e1e1e',
  },

  charCount: {
    fontFamily: 'Rubik-Medium',
    fontSize: responsiveFontSize(1.5),
    textAlign: 'right',
    marginRight: responsiveWidth(0.9),
    // backgroundColor : 'red',
    paddingBottom: responsiveWidth(1),
    // marginBottom : responsiveWidth(7)
  },

  Followers: {
    flexBasis: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SubScribers: {
    flexBasis: '58%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FollowersSubScribersToggle: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: responsiveWidth(2.8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(2),
    // backgroundColor: "#f3f3f3",
    height: 54,
    padding: responsiveWidth(1),
    width: '90%',
  },
  schedulePost: {
    marginVertical: 20,
    // padding: responsiveWidth(2),
    // gap: responsiveWidth(4),
    alignSelf: 'center',
    // flexDirection: 'column',
    // borderWidth : 1,
    height: 53,
    // height : "100%"
  },

  loginButton: {
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#FFA86B',
    borderTopRightRadius: responsiveWidth(5),
    color: '#282828',
    textAlign: 'center',
    fontFamily: 'Rubik-Medium',
    elevation: 1,
    fontWeight: '600',
    width: responsiveWidth(90),
    height: responsiveWidth(13),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderTopColor: '#282828',
    borderLeftColor: '#282828',
    elevation: 1,

    fontSize: responsiveFontSize(2.4),
    padding: padios(responsiveWidth(2.6)),
    overflow: 'hidden',
    marginTop: responsiveWidth(4),
    borderBottomWidth: responsiveWidth(1.5),
  },

  loginButtonSelect: {
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#FFA86B',
    borderRadius: 10,
    color: '#282828',
    textAlign: 'center',
    fontFamily: 'Rubik-Medium',
    elevation: 1,
    fontWeight: '600',
    width: responsiveWidth(90),
    height: responsiveWidth(13),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderTopColor: '#282828',
    borderLeftColor: '#282828',
    elevation: 1,
    fontSize: responsiveFontSize(2.4),
    padding: padios(responsiveWidth(2.6)),
    overflow: 'hidden',
    marginTop: responsiveWidth(4),
    borderBottomWidth: responsiveWidth(1.2),
    borderRightWidth: responsiveWidth(1.2),
    borderLeftWidth: responsiveWidth(0.3),
    borderTopWidth: responsiveWidth(0.3),
  },

  fahduTripodContainer: {
    // borderWidth : 1,
    width: '100%',
    height: responsiveWidth(50),
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveWidth(15),
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7E6',
    // borderWidth: 1,
    borderColor: 'green',
    borderRadius: responsiveWidth(3.73),
    padding: responsiveWidth(2),
    width: responsiveWidth(92),
    height: responsiveWidth(13),
    paddingLeft: responsiveWidth(3),
  },
  errorIcon: {
    marginRight: responsiveWidth(2),
  },
  errorText: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.8),
    color: 'green',
    flexShrink: 1,
  },

  //Else style

  amountInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeftWidth: 1,
    borderColor: '#1e1e1e',
    height: responsiveWidth(12),
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: responsiveWidth(4.3),
    borderRadius: responsiveWidth(3.14),
    width: '100%',
    fontFamily: 'MabryPro-Regular',
    overflow: 'hidden',
  },

  titleback: {
    backgroundColor: '#FFE1CC', // Just for visibility
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%', // Ensures full height
    alignSelf: 'stretch', // Makes it stretch fully,
    borderRightWidth: 2,
  },
  titleSetPrice: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
  },
  heading: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: FONT_SIZES[20],
    color: '#1e1e1e',
  },
  box: {
    borderColor: '#1e1e1e',
    borderRadius: responsiveWidth(2),
    marginVertical: 24,
  },
  insideBoxTitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: FONT_SIZES[12],
    color: '#1e1e1e',
    marginTop: 8,

    // left: responsiveWidth(10),
  },

  //

  bubbleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows wrapping when width exceeds container
    padding: 8,
    paddingLeft: 0,
    // backgroundColor: 'red',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA86B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 30,
    marginRight: 8,
    marginVertical: 4,
    borderWidth: 1.5,
    borderColor: '#1e1e1e',
  },
  bubbleText: {
    color: 'black',
    fontSize: 14,
    marginRight: 6,
    fontFamily: 'Rubik-Medium',
  },
  close: {
    color: '#1e1e1e',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  selectMedia: {
    alignSelf: 'flex-end',
    position: 'absolute',
    height: 36,
    width: 36,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: WIDTH_SIZES['2'],
  },
  amountStyle: {
    fontFamily: 'MabryPro-Bold',
    color: '#282828',
    marginRight: responsiveWidth(1),
    height: '100%',
    fontSize: FONT_SIZES['16'],
    // backgroundColor : 'red'
  },
});
