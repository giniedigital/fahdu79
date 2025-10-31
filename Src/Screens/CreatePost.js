import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Switch,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Platform,
  InputAccessoryView,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import DateTimePickerSheet from '../Components/CreatePostComponents/DateTimePickerSheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {toggleDateTimePicker} from '../../Redux/Slices/NormalSlices/HideShowSlice';
import {
  useCreatePostMutation,
  useCreatePostUploadAttachmentMutation,
  useLazyMyPostListQuery,
} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {
  generateBase64Image,
  generateVideoThumbnail,
  getImageSize,
  getVideoMetadata,
  videoReducer,
} from '../../FFMPeg/FFMPegModule';
import {LoginPageErrors, successSnacks} from '../Components/ErrorSnacks';
import DIcon from '../../DesiginData/DIcons';
import {
  dismissProgressNotification,
  displayNotificationProgressIndicator,
} from '../../Notificaton';
import {autoLogout} from '../../AutoLogout';
import {FONT_SIZES, padios, WIDTH_SIZES} from '../../DesiginData/Utility';
import {
  PERMISSIONS,
  RESULTS,
  checkMultiple,
  request,
} from 'react-native-permissions';
import ImageCropPicker from 'react-native-image-crop-picker';
import {
  addNewPostToMyProfileCache,
  setFeedCacheMyPost,
} from '../../Redux/Slices/NormalSlices/Posts/MyProfileFeedCacheSlice';
import Upload from '../../Assets/svg/uploadP.svg';
import {check} from 'react-native-permissions';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import AnimatedButton from '../Components/AnimatedButton';
import RNFS from 'react-native-fs';

import {pick, types, isCancel} from '@react-native-documents/picker';

import {
  resetUploadProgress,
  setPostIndex,
  setUploadProgress,
  startProcessing,
  startUpload,
} from '../../Redux/Slices/NormalSlices/UploadSlice';
import {navigate} from '../../Navigation/RootNavigation';

const CreatePost = ({route}) => {
  console.log(route?.params?.uri, '{}{}{})__+_+_+_+_+');

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

  // const [uploadAttachment, {error}] = useUploadAttachmentMutation();

  const [createPostUploadAttachment, {isLoading}] =
    useCreatePostUploadAttachmentMutation();

  const {postIndex, isUploading, processing, progress} = useSelector(
    state => state.upload,
  );

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [createPost] = useCreatePostMutation();

  const [date, setDate] = useState(new Date());

  const [caption, setCaption] = useState('');

  const token = useSelector(state => state.auth.user.token);

  const [base64Image, setBase64Image] = useState(undefined);

  const [loading, setLoading] = useState(false);

  const [mediaUri, setMediaUri] = useState(undefined);

  const [videoUrl, setVideoUrl] = useState(undefined);

  const [isMediaVideo, setIsMediaVideo] = useState(false); //Generate thumbnail and have to add play button I'll utilize prebuild image componenet

  const [mediaSelected, setMediaSelected] = useState(false);

  const [bitRate, setBitRate] = useState(null);

  const [postList] = useLazyMyPostListQuery();

  const getPostContent = useSelector(
    state => state.myProfileFeedCache.data.content,
  );

  console.log({getPostContent});

  useEffect(() => {
    console.log({progress});
    console.log('🐞');
  }, [progress]);

  const handleTextInput = x => {
    setCount(x?.length);
    setCaption(x);
  };

  const [forSubscribers, setForSubscribers] = useState(false);

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    if (!loading) {
      setIsEnabled(previousState => !previousState);
    } else {
      return;
    }
  };

  const resetMediaState = () => {
    console.log('Resetting all media states...');

    setBase64Image(undefined);
    setLoading(false);
    setMediaUri(undefined);
    setVideoUrl(undefined);
    setIsMediaVideo(false);
    setMediaSelected(false);
    setLoading(false);
  };

  const selectMedia = async () => {
    console.log('Selecting media');
    if (loading) return;
    resetMediaState();

    try {
      let mediaInfo; // Type definition removed for plain JS

      if (Platform.OS === 'ios') {
        // --- Use Image Picker for iOS ---
        const result = await launchImageLibrary({
          mediaType: 'mixed', // Allows both images and videos
        });

        if (result.didCancel || !result.assets?.[0]) {
          console.log('User cancelled selection or no assets found.');
          return;
        }

        const asset = result.assets[0];
        // Normalize the response to match DocumentPicker's structure
        mediaInfo = {
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName,
          size: asset.fileSize,
        };
      } else {
        // --- Use Document Picker for Android ---
        // mediaInfo = await DocumentPicker.pickSingle({
        //   type: [types.images, types.video],
        // });

        mediaInfo = await pick({
          type: [types.images, types.video],
          multiple: false,
        });
      }

      if (!mediaInfo) return;
      setLoading(true);

      // --- Process selected media ---
      if (mediaInfo.type?.startsWith('image/')) {
        console.log('Image size', mediaInfo.size);
        if (mediaInfo.size >= 20000000) {
          // 20 MB limit
          LoginPageErrors('Image size must be lower than 20 MB');
          setLoading(false);
          return;
        }

        setMediaSelected(true);
        setIsMediaVideo(false);
        setVideoUrl(undefined);
        setLoading(false);
        navigation.navigate('cropViewScreen', {uri: mediaInfo.uri});
      } else if (mediaInfo.type?.startsWith('video/')) {
        console.log('Video selected:', mediaInfo.uri);
        const destinationPath = `${RNFS.CachesDirectoryPath}/${Date.now()}_${
          mediaInfo.name
        }`;

        // Copy file to a stable cache location
        await RNFS.copyFile(
          mediaInfo.uri.replace('file://', ''),
          destinationPath,
        );
        console.log('Video copied to:', destinationPath);

        const meta = await getVideoMetadata(destinationPath);
        if (!meta?.isValid) {
          setLoading(false);
          LoginPageErrors(meta.validationReason);
          return;
        }

        setBitRate(meta.bitrate);
        setMediaSelected(true);
        setIsMediaVideo(true);
        setVideoUrl(destinationPath);

        generateVideoThumbnail(destinationPath).then(thumbnailUri => {
          console.log('Thumbnail generated at:', thumbnailUri);
          setMediaUri(thumbnailUri);
        });
        setLoading(false);
      }
    } catch (err) {
      // if (DocumentPicker.isCancel(err)) {
      //   console.log('User cancelled the document picker.');
      // } else {
      //   console.error('Error selecting media:', err);
      //   LoginPageErrors('An unexpected error occurred.');
      // }

      if (isCancel(err)) {
        console.log('User cancelled the document picker.');
      } else {
        console.error('Error selecting media:', err);
        LoginPageErrors('An unexpected error occurred.');
      }

      setLoading(false);
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

  const getFirstNonPinnedIndex = posts => {
    if (!posts || posts.length === 0) return -1;
    return posts.findIndex(post => !post.pinned);
  };

  // const getPostList = async () => {
  //   let {data: postData} = await postList({token}, false);

  //   if (postData) {
  //     let pinnedPost = postData?.data?.pinnedPosts.map(x => ({
  //       ...x,
  //       pinned: true,
  //     }));

  //     let combinedPinnedUnPinnedPosts = [...pinnedPost, ...postData?.data?.posts];

  //     dispatch(setFeedCacheMyPost({data: combinedPinnedUnPinnedPosts}));
  //   }
  // };

  const getPostList = async () => {
    let {data: postData} = await postList({token}, false);

    if (postData) {
      let pinnedPost = postData?.data?.pinnedPosts.map(x => ({
        ...x,
        pinned: true,
      }));

      let combinedPinnedUnPinnedPosts = [
        ...pinnedPost,
        ...postData?.data?.posts,
      ];

      dispatch(setFeedCacheMyPost({data: combinedPinnedUnPinnedPosts}));

      // just get the index
      const firstNonPinnedIndex = getFirstNonPinnedIndex(
        combinedPinnedUnPinnedPosts,
      );
      console.log('First non-pinned index:', firstNonPinnedIndex);
      dispatch(setPostIndex(firstNonPinnedIndex));
    }
  };

  useEffect(() => {
    if (getPostContent?.length <= 0) {
      console.log(getPostContent.length, 'IOIOIOIOIO');

      getPostList();
    }
  }, [getPostContent]);

  const handleSendPost = async () => {
    if (isUploading || processing) {
      LoginPageErrors('Please wait, posting your last post...');
      return;
    }

    // Alert.alert('working');

    dispatch(resetUploadProgress());

    dispatch(startProcessing());
    navigate('home');

    // setLoading(true);
    if (mediaUri) {
      if (isMediaVideo) {
        console.log('Meida is video');

        await displayNotificationProgressIndicator();

        async function videoFormatter(uri) {
          const result = await videoReducer(uri, bitRate);
          return result;
        }

        videoFormatter(videoUrl).then(async compressedVideoUrl => {
          if (compressedVideoUrl) {
            let compressedVideoThumbnail = await generateVideoThumbnail(
              compressedVideoUrl,
            );

            const formData = new FormData();

            formData.append('keyName', 'video_thumbnail');

            formData.append('file', {
              uri: compressedVideoThumbnail,
              type: 'image/jpg',
              name: 'image.jpg',
            });

            createPostUploadAttachment({token, formData})
              .unwrap()
              .then(e => {
                console.log(e?.data, '999999999');
                if (e?.error?.data?.status_code) {
                  autoLogout();
                }

                if (e?.error?.status === 'FETCH_ERROR') {
                  LoginPageErrors('Please check your network');
                  setLoading(false);
                  dismissProgressNotification();
                }

                if (e?.data?.statusCode === 200) {
                  dispatch(resetUploadProgress());
                  // startUpload()

                  let preview = e?.data?.data?.url;

                  const formData = new FormData();

                  formData.append('keyName', 'message_attachment');

                  formData.append('file', {
                    uri: compressedVideoUrl,
                    type: 'video/mp4',
                    name: 'attachmentVideo.mp4',
                  });

                  dispatch(startUpload({previewUrl: e?.data?.data?.url}));

                  createPostUploadAttachment({token, formData})
                    .unwrap()
                    .then(async e => {
                      // Alert.alert('uploading');

                      if (e?.data?.statusCode === 200) {
                        const videoUrlFromServer = e?.data?.data?.url;

                        let mediaObject = {
                          postContent: caption.trim(), //Caption data

                          post_content_files: {
                            url: videoUrlFromServer, //video url in case;
                            type: 'post',
                            format: 'video', //Must be changed further
                          },

                          for_subscribers: forSubscribers, //Change

                          image_preview: {
                            url: forSubscribers ? base64Image : '', //Base 64
                            type: 'image',
                            format: 'png',
                          },

                          video: {
                            thumbnail: {
                              url: preview,
                              type: 'video_thumbnail',
                              format: 'image',
                            },
                            hasPreview: forSubscribers,
                            hasThumbnail: true,
                            hasVideo: true,
                          },

                          activate_on: isEnabled === true ? date : '', //Schedule timing

                          forcreator: true,
                          foruser: true,
                        };

                        if (forSubscribers) {
                          generateBase64Image(mediaUri).then(e => {
                            mediaObject.image_preview.url = e;

                            createPost({token, data: mediaObject})
                              .then(e => {
                                setLoading(false);
                                dispatch(resetUploadProgress());

                                if (e?.data?.statusCode) {
                                  successSnacks(
                                    'Created your post successfully.',
                                  );

                                  // console.log(":::::::::::SUBSSTHECREATEDPOST:::::::::::::::", e?.data, "::::::::::::::::::::::::THECREATEDPOST::::::::::::::::::::::");

                                  setCaption('');
                                  setIsEnabled(false);
                                  setMediaUri(undefined);
                                  setLoading(false);
                                  dismissProgressNotification();

                                  getPostList();
                                } else {
                                  console.log('Something went wrong.');
                                }
                              })
                              .catch(e => {
                                console.log('There was some error.');
                              });
                          });
                        } else {
                          createPost({token, data: mediaObject})
                            .then(e => {
                              setLoading(false);
                              dispatch(resetUploadProgress());

                              if (e?.data?.statusCode) {
                                successSnacks(
                                  'Created your post successfully.',
                                );

                                // console.log(":::::::::::SUBSSTHECREATEDPOST:::::::::::::::", e?.data, "::::::::::::::::::::::::THECREATEDPOST::::::::::::::::::::::");

                                setCaption('');
                                setIsEnabled(false);
                                setMediaUri(undefined);
                                setLoading(false);
                                dismissProgressNotification();
                                // navigation.navigate('home');

                                getPostList();
                              } else {
                                console.log('Something went wrong.', e);
                              }
                            })
                            .catch(e => {
                              console.log('There was some error.');
                            });
                        }

                        dispatch(resetUploadProgress());
                      }
                    });
                }
              })
              .catch(e => console.log('88888', e));
          }
        });
      } else {
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
            console.log(
              `File size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
            );
          })
          .catch(error => {
            console.error('Error getting file size:', error);
          });

        dispatch(startUpload({previewUrl: `file://${mediaUri}`}));
        createPostUploadAttachment({token, formData})
          .unwrap()
          .then(e => {
            setLoading(true);

            // Alert.alert('uploaing')

            if (e?.error?.data?.status_code === 401) {
              autoLogout();
            }

            if (e?.error?.status === 'FETCH_ERROR') {
              LoginPageErrors('Please check your network');
              setLoading(false);
              dismissProgressNotification();
            }

            let mediaObject = {
              postContent: caption.trim(), //Caption data

              base64Image,

              post_content_files: {
                //
                url: e?.data?.data?.url, //video url in case;
                type: 'post',
                format: 'image', //Must be changed further
              },

              for_subscribers: forSubscribers, //Change

              image_preview: {
                url: base64Image,

                type: 'image',
                format: 'png',
                mobilePreview: '',
              },

              image: {
                thumbnail: {
                  url: forSubscribers ? base64Image : e?.data?.data?.url, //For subs base 64 Details else normal url
                  type: 'image_thumbnail',
                  format: 'image',
                },

                hasThumbnail: true,

                hasPreview: forSubscribers,

                hasImage: true,

                hasAspectRatio: true,
                // hasResolution: "",
                // hasOrientation: "",

                // orientation: "",

                aspectRatio: {
                  height: route?.params?.height,
                  width: route?.params?.width,
                },

                // resolution: {
                //   height: "",
                //   width: "",
                // },
              },

              activate_on: isEnabled ? date : '',
              forcreator: true,
              foruser: true,
            };

            if (e?.data?.statusCode) {
              generateBase64Image(`file://${mediaUri}`).then(e => {
                setBase64Image(e);

                if (e) {
                  if (forSubscribers) {
                    mediaObject.image_preview.url = e;
                  }

                  createPost({token, data: mediaObject})
                    .then(e => {
                      dispatch(resetUploadProgress());

                      setLoading(false);

                      if (e?.error?.data?.status_code === 400) {
                        dismissProgressNotification();
                        LoginPageErrors(e?.error?.data?.message);
                      }

                      if (e?.data?.statusCode === 200) {
                        successSnacks('Created your post successfully.');
                        dispatch(
                          addNewPostToMyProfileCache({newPost: e?.data?.data}),
                        );

                        // console.log(":::::::::::IMAGECREATEPOST:::::::::::::::", e?.data?.data, "::::::::::::::::::::::::THECREATEDPOST::::::::::::::::::::::");

                        setCaption('');
                        setIsEnabled(false);
                        setMediaUri(undefined);
                        dismissProgressNotification();
                        // navigation.navigate('home');
                        getPostList();
                      } else {
                        console.log('Something went wrong.');
                      }
                    })
                    .catch(e => console.log('There was error', e));
                }
              });
            } else {
              console.log('error');
              setLoading(false);
            }
          });
      }
    } else {
      LoginPageErrors('Please select any media');
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}>
        <View
          style={{
            borderWidth: responsiveWidth(0.5),
            borderRadius: responsiveWidth(3.73),
            width: responsiveWidth(92),
          }}>
          <View style={styles.FollowersSubScribersToggle}>
            <TouchableOpacity
              onPress={() => setForSubscribers(!forSubscribers)}
              style={[
                styles.Followers,
                forSubscribers === false
                  ? {
                      backgroundColor: '#FFA86B',
                      borderWidth: responsiveWidth(0.3),
                      borderRadius: responsiveWidth(2.5),
                    }
                  : null,
              ]}>
              <Text
                style={{
                  fontFamily: 'Rubik-SemiBold',
                  fontSize: FONT_SIZES[14],
                  color: '#282828',
                }}
                key={'1Followers'}>
                Followers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setForSubscribers(!forSubscribers)}
              style={[
                styles.SubScribers,
                forSubscribers === true
                  ? {
                      backgroundColor: '#FFA86B',
                      borderWidth: responsiveWidth(0.3),
                      borderRadius: responsiveWidth(2.5),
                    }
                  : null,
              ]}>
              <Text
                key={'2SubScribers'}
                style={{
                  fontFamily: 'Rubik-SemiBold',
                  fontSize: FONT_SIZES[14],
                  color: '#282828',
                }}>
                Subscribers
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.textInputContainer}>
          {mediaUri ? (
            <View
              style={[
                styles.selectImageBox,
                route?.params && {flexDirection: 'row', alignItems: 'center'},
                !isMediaVideo
                  ? {
                      aspectRatio: `${route?.params?.width}/${route?.params?.height}`,
                    }
                  : {aspectRatio: '16/9'},
              ]}>
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: `file://${mediaUri}`}}
                  resizeMethod="resize"
                  resizeMode="contain"
                  style={{height: '100%', width: '100%', resizeMode: 'cover'}}
                />
                <TouchableOpacity
                  onPress={selectMedia}
                  style={styles.selectMedia}>
                  <Image
                    source={require('../../Assets/Images/ChangeProfile.png')}
                    style={{
                      height: responsiveWidth(8),
                      width: responsiveWidth(8),
                      resizeMode: 'contain',
                      zIndex: 8,
                      alignSelf: 'center',
                      marginRight: responsiveWidth(1),
                    }}
                  />
                </TouchableOpacity>
              </View>

              {isMediaVideo && (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: responsiveWidth(1),
                    marginTop: responsiveWidth(2),
                    position: 'absolute',
                    alignSelf: 'center',
                  }}
                  onPress={() => openVideoPreview()}>
                  <DIcon
                    name={'play-circle'}
                    provider={'FontAwesome5'}
                    color="#fff"
                    size={WIDTH_SIZES['36']}
                  />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.selectImageBox}
              onPress={selectMedia}>
              <View
                style={[
                  styles.imageContainer,
                  {
                    marginVertical: WIDTH_SIZES['10'],
                    marginTop: WIDTH_SIZES['84'],
                  },
                ]}>
                {/* <Image source={require("../../Assets/Images/selectMedia.png")} resizeMethod="resize" resizeMode="contain" style={{ width: "100%" }} /> */}
                <Upload />
              </View>
              <Text
                style={{
                  fontFamily: 'Rubik-Medium',
                  textAlign: 'center',
                  color: '#282828',
                  fontSize: 14,
                  marginBottom: 80,
                }}>
                Click to upload your files{' '}
              </Text>
            </TouchableOpacity>
          )}

          <TextInput
            selectionColor={'#1e1e1e'}
            cursorColor={'#1e1e1e'}
            placeholderTextColor={'#7e7e7e'}
            inputAccessoryViewID={inputAccessoryViewID}
            value={caption}
            style={styles.textInputStyle}
            maxLength={120}
            placeholder="Write caption here..."
            multiline
            onChangeText={x => handleTextInput(x)}
          />
          <Text style={styles.charCount}>{`${count}/120`}</Text>

          {Platform.OS === 'ios' && (
            <InputAccessoryView nativeID={inputAccessoryViewID}>
              <Pressable
                onPress={() => Keyboard.dismiss()}
                style={{alignSelf: 'center', borderRadius: responsiveWidth(2)}}>
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

        {isEnabled && (
          <View
            style={[
              styles.errorContainer,
              isEnabled
                ? {marginVertical: WIDTH_SIZES['24'] + WIDTH_SIZES['2']}
                : null,
            ]}>
            <Ionicons
              name="time-outline"
              size={20}
              color="green"
              style={styles.errorIconOld}
            />

            <Text style={styles.errorText}>
              Scheduled for{' '}
              {date.toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              at{' '}
              {date.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>

            <DIcon
              onPress={toggleSwitch}
              provider={'MaterialIcons'}
              name={'delete-outline'}
              size={20}
              color="#1e1e1e"
              style={styles.errorIcon}
            />
          </View>
        )}

        {!isEnabled && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              marginTop: WIDTH_SIZES['24'],
            }}>
            <Text
              style={{
                fontFamily: 'Rubik-SemiBold',
                color: '#282828',
                fontSize: 16,
                left: responsiveWidth(1.5),
              }}>
              Schedule this Post
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#1e1e1e'}}
              thumbColor={isEnabled ? '#ffa86b' : '#1e1e1e'}
              ios_backgroundColor="white"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={{borderWidth: 1.5, borderColor: '#1e1e1e'}}
            />
          </View>
        )}

        <View style={{width: '99%', justifyContent: 'center'}}>
          <AnimatedButton
            title={'Post'}
            buttonMargin={0}
            loading={loading}
            onPress={() => handleSendPost()}
            disabled={!mediaSelected}
          />
        </View>

        {isEnabled && <DateTimePickerSheet date={date} setDate={setDate} />}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default CreatePost;

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
    width: '100%',
    paddingLeft: responsiveWidth(2),
    fontFamily: 'Rubik-Regular',
    borderColor: 'red',
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
    marginTop: WIDTH_SIZES['24'],
  },
  errorIconOld: {
    marginRight: responsiveWidth(2),
  },
  errorIcon: {
    marginRight: responsiveWidth(2),
    position: 'absolute',
    right: 0,
  },
  errorText: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.8),
    color: 'green',
    flexShrink: 1,
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
});
