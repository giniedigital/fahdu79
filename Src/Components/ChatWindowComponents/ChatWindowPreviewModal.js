import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ToastAndroid,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  responsiveFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import DIcon from '../../../DesiginData/DIcons';

import {useSelector, useDispatch} from 'react-redux';
import {toggleChatWindowAttachmentPreviewModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {
  setMediaData,
  setAsPremium,
} from '../../../Redux/Slices/NormalSlices/MessageSlices/ChatWindowPreviewDataSlice';
import {
  useFollowUserMutation,
  useUploadAttachmentMutation,
} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {useSendMessageMutation} from '../../../Redux/Slices/QuerySlices/roomListSliceApi';
import {token as memoizedToken} from '../../../Redux/Slices/NormalSlices/AuthSlice';

import {VideoView, useVideoPlayer} from 'expo-video';

import {
  generateVideoThumbnail,
  videoReducer,
} from '../../../FFMPeg/FFMPegModule';
import {pushSentMessageResponse} from '../../../Redux/Slices/NormalSlices/MessageSlices/ThreadSlices';
import {
  dismissProgressNotification,
  displayNotificationProgressIndicator,
} from '../../../Notificaton';
import {updateCacheRoomList} from '../../../Redux/Slices/NormalSlices/RoomListSlice';
import {
  ChatWindowError,
  ChatWindowFollowError,
  LoginPageErrors,
  OfflineSnack,
} from '../ErrorSnacks';
import {useFocusEffect} from '@react-navigation/native';

async function generateThumbnail(docPath) {
  //REmoved react native pdf thumnail
  return '';
}

const ChatWindowPreviewModal = ({chatRoomId, name}) => {
  //!<---------------------Refs--------->

  const attachmentInputRef = useRef();

  //!<---------------------States--------->

  const dispatcher = useDispatch();

  const [uploadAttachment] = useUploadAttachmentMutation();

  const [sendMessage] = useSendMessageMutation();

  const [mediaPath, setMediaPath] = useState(undefined);

  const [attachmentType, setAttachmentType] = useState(undefined);

  const [amount, setAmount] = useState(undefined);

  const [disableSendBtton, setDisableSendButton] = useState(false);

  const [next, setNext] = useState(false);

  //!<---------------------Selectors--------->

  const token = useSelector(state => state.auth.user.token);

  const previewModalShow = useSelector(
    state => state.hideShow.visibility.chatWindowAttachmentPreviewModal,
  );

  const selectedMedia = useSelector(state => state.chatWindowPreviewData.media);

  const isAttachmentPremium = useSelector(
    state => state.chatWindowPreviewData.premium,
  );
  const [followUser, {isError: followError, data: followData}] =
    useFollowUserMutation();

  // Video player for expo-video
  const player = useVideoPlayer(mediaPath || '', player => {
    player.loop = false;
  });

  useFocusEffect(
    useCallback(() => {
      setDisableSendButton(false);
    }, []),
  );

  //!<---------------------Handlers--------->

  const handleAttachmentAsPremium = useCallback(
    isFree => {
      if (!next) {
        if (isFree !== isAttachmentPremium) {
          dispatcher(setAsPremium());
        }
      } else {
        console.log('Next is true');
      }
    },
    [isAttachmentPremium, next],
  );

  const handlePreviewModalClose = () => {
    try {
      if (player && attachmentType === 'video') {
        player.pause();
      }
      dispatcher(toggleChatWindowAttachmentPreviewModal());
      dispatcher(setMediaData({type: 'removeData'}));
      attachmentInputRef.current.value = '';
      setAttachmentType(undefined);

      if (isAttachmentPremium) {
        dispatcher(setAsPremium());
      }
    } catch (e) {
      console.log('handlePreviewModalClose', e.message);
    }
  };

  const handleUploadAttachment = useCallback(() => {
    console.log('🚀 Handle upload');

    if (isAttachmentPremium === true && (amount < 1 || amount === undefined)) {
      ChatWindowError('You must add atleast 1 coin');
      return 0;
    }

    if (isAttachmentPremium === true && amount > 10000) {
      ChatWindowError('Set Fee Amount Under 10,000');
      return 0;
    }

    displayNotificationProgressIndicator();

    if (attachmentType !== undefined) {
      setDisableSendButton(true);

      if (attachmentType === 'image') {
        const attachment = Object.assign({});
        const formData = new FormData();
        formData.append('keyName', 'message_attachment');
        formData.append('file', selectedMedia?.image?.fileData);

        uploadAttachment({token, formData}).then(e => {
          if (e?.data?.statusCode === 200) {
            attachment.charge_amount =
              isAttachmentPremium && amount >= 1 ? amount : 0;
            attachment.format = 'image';
            attachment.is_charagble =
              isAttachmentPremium && amount >= 1 ? 'true' : 'false';
            attachment.paid_by_reciever = false;
            attachment.preview = selectedMedia?.image?.preview;
            attachment.type = e?.data?.data?.key;
            attachment.url = e?.data?.data?.url;
            attachment.room_id = chatRoomId;

            sendMessage({
              token,
              message: attachmentInputRef.current.value ?? '',
              roomId: chatRoomId,
              attachment,
            })
              .then(e => {
                setDisableSendButton(false);

                if (e?.error?.data?.message?.search('Follow') >= 0) {
                  ChatWindowFollowError(
                    e?.error?.data?.message,
                    followUser,
                    token,
                    name,
                  );
                }

                if (e?.error?.data?.message?.search('insufficient') >= 0) {
                  LoginPageErrors('Insufficient Balance');
                }

                console.log(
                  'Attachemet Image Sent with after message***********',
                  e,
                );
                dismissProgressNotification();
                dispatcher(
                  updateCacheRoomList({
                    chatRoomId,
                    createdAt: e?.data?.data?.createdAt,
                    message: '',
                    hasAttachment: true,
                    senderId: e?.data?.data?.sender?._id,
                  }),
                );
                setAmount(undefined);
                setDisableSendButton(false);
                dispatcher(
                  pushSentMessageResponse({
                    chatRoomId,
                    sentMessageResponse: e.data.data,
                  }),
                );
                handlePreviewModalClose();
              })
              .catch(e =>
                console.log('Uploaded Image attachment After Error', e),
              );
          } else {
            ChatWindowError('There was error while sending image');
            setDisableSendButton(false);
            return 0;
          }
        });
      }

      if (attachmentType === 'pdf') {
        const attachment = Object.assign({});
        const formData = new FormData();

        formData.append('keyName', 'message_attachment');
        formData.append('file', selectedMedia?.pdf?.fileData);

        uploadAttachment({token, formData})
          .then(e => {
            if (e?.data?.statusCode === 200) {
              attachment.charge_amount =
                isAttachmentPremium && amount >= 1 ? amount : 0;
              attachment.format = 'document';
              attachment.is_charagble =
                isAttachmentPremium && amount >= 1 ? 'true' : 'false';
              attachment.paid_by_reciever = false;
              attachment.preview = 'assets/icons/pdf.png';
              attachment.type = e?.data?.data?.key;
              attachment.url = e?.data?.data?.url;
              attachment.room_id = chatRoomId;

              sendMessage({
                token,
                message: attachmentInputRef.current.value ?? '',
                roomId: chatRoomId,
                attachment,
              })
                .then(e => {
                  if (e?.error?.data?.message?.search('Follow') >= 0) {
                    ChatWindowFollowError(
                      e?.error?.data?.message,
                      followUser,
                      token,
                      name,
                    );
                  }

                  if (e?.error?.data?.message?.search('insufficient') >= 0) {
                    LoginPageErrors('Insufficient Balance');
                    setDisableSendButton(false);
                  } else {
                    LoginPageErrors("Can't reach server");
                    setDisableSendButton(false);
                  }

                  setDisableSendButton(false);

                  console.log('Attachemet Sent with After message', e);
                  dismissProgressNotification();
                  dispatcher(
                    updateCacheRoomList({
                      chatRoomId,
                      createdAt: e?.data?.data?.createdAt,
                      message: '',
                      hasAttachment: true,
                      senderId: e?.data?.data?.sender?._id,
                    }),
                  );
                  setAmount(undefined);
                  setDisableSendButton(false);
                  dispatcher(
                    pushSentMessageResponse({
                      chatRoomId,
                      sentMessageResponse: e.data.data,
                    }),
                  );
                  handlePreviewModalClose();
                })

                .catch(e => console.log('upload attachment After Error', e));
            } else {
              console.log('upload Attachment PDF Error', e?.data?.statusCode);
            }
          })
          .catch(e => console.log('Upload attachment Error', e));
      }

      if (attachmentType === 'video') {
        const attachment = Object.assign({});

        try {
          async function videoFormatter(uri) {
            const result = await videoReducer(uri);
            return result;
          }

          videoFormatter(mediaPath).then(async compressedVideoUrl => {
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

              uploadAttachment({token, formData}).then(e => {
                if (e?.data?.statusCode === 200) {
                  let preview = e?.data?.data?.url;

                  const formData = new FormData();

                  formData.append('keyName', 'message_attachment');

                  formData.append('file', {
                    uri: compressedVideoUrl,
                    type: 'video/mp4',
                    name: 'attachmentVideo.mp4',
                  });

                  uploadAttachment({token, formData}).then(e => {
                    console.log('Uploading');
                    if (e?.data?.statusCode === 200) {
                      attachment.charge_amount =
                        isAttachmentPremium && amount >= 1 ? amount : 0;
                      attachment.format = 'video';
                      attachment.is_charagble =
                        isAttachmentPremium && amount >= 1 ? 'true' : 'false';
                      attachment.paid_by_reciever = false;
                      attachment.preview = preview;
                      attachment.type = e?.data?.data?.key;
                      attachment.url = e?.data?.data?.url;
                      attachment.room_id = chatRoomId;

                      sendMessage({
                        token,
                        message: attachmentInputRef.current.value ?? '',
                        roomId: chatRoomId,
                        attachment,
                      })
                        .then(e => {
                          console.log(
                            'Video Attachemet Sent with After message',
                          );
                          dismissProgressNotification();
                          dispatcher(
                            updateCacheRoomList({
                              chatRoomId,
                              createdAt: e?.data?.data?.createdAt,
                              message: '',
                              hasAttachment: true,
                              senderId: e?.data?.data?.sender?._id,
                            }),
                          );
                          setAmount(undefined);
                          setDisableSendButton(false);
                          dispatcher(
                            pushSentMessageResponse({
                              chatRoomId,
                              sentMessageResponse: e.data.data,
                            }),
                          );
                          handlePreviewModalClose();
                        })

                        .catch(e =>
                          console.log('Video upload attachment After Error', e),
                        );
                    } else {
                      console.log('Error while sending video', e);
                      setDisableSendButton(false);
                    }
                  });
                } else {
                  console.log('Video thumbnail upload error', e);
                  setDisableSendButton(false);
                }
              });
            }
          });
        } catch (e) {
          console.log('Vide Upload CWPM Error', e);
          setDisableSendButton(false);
        }
      }
    } else {
      console.log('No attachment selected to send');
      setDisableSendButton(false);
    }
  }, [selectedMedia, attachmentType, amount, isAttachmentPremium]);

  React.useEffect(() => {
    if (selectedMedia?.image?.fileData) {
      console.log('Preview of image');
      setAttachmentType('image');

      setMediaPath(selectedMedia?.image?.fileData?.uri);
    } else if (selectedMedia?.video?.fileData) {
      console.log('Preview of video');

      setAttachmentType('video');

      setMediaPath(selectedMedia?.video?.fileData?.uri);
    } else if (selectedMedia?.pdf?.fileData) {
      console.log('Preview of pdf');
      setAttachmentType('pdf');

      let pdfUri = selectedMedia?.pdf?.fileData?.uri;

      if (pdfUri) {
        generateThumbnail(pdfUri).then(e => {
          setMediaPath(e);
        });
      }
    } else {
      console.log('No preview to show');
    }
  }, [selectedMedia]);

  // Pause video when modal closes
  React.useEffect(() => {
    if (!previewModalShow && player && attachmentType === 'video') {
      player.pause();
    }
  }, [previewModalShow]);

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={150}
      animationOutTiming={150}
      onRequestClose={() =>
        disableSendBtton
          ? console.log('Still uploading')
          : handlePreviewModalClose()
      }
      transparent={true}
      isVisible={previewModalShow}
      backdropColor="black"
      onBackButtonPress={() =>
        disableSendBtton
          ? console.log('Still uploading')
          : handlePreviewModalClose()
      }
      onBackdropPress={() =>
        disableSendBtton
          ? console.log('Still uploading')
          : handlePreviewModalClose()
      }
      useNativeDriver
      style={{
        flex: 1,
      }}>
      <View style={styles.modalInnerWrapper}>
        <DIcon
          provider={'Entypo'}
          name={'circle-with-cross'}
          size={responsiveWidth(6)}
          color={'#ffa07a'}
          style={{alignSelf: 'flex-end'}}
          onPress={() => handlePreviewModalClose()}
        />
        <Text style={styles.attachFileText}>Attach File</Text>
        <View style={styles.previewModalImageWrapper}>
          {attachmentType !== 'video' ? (
            <Image
              source={
                !mediaPath
                  ? require('../../../Assets/Images/Profile.jpg')
                  : {uri: mediaPath}
              }
              style={{
                flex: 1,
                width: '100%',
                resizeMode: 'cover',
                borderRadius: responsiveWidth(4),
              }}
              resizeMethod="resize"
              resizeMode="cover"
            />
          ) : (
            <VideoView
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: '#f3f3f3',
                borderRadius: responsiveWidth(4),
              }}
              player={player}
              allowsFullscreen={false}
              allowsPictureInPicture={false}
              nativeControls
              contentFit="contain"
            />
          )}
        </View>
        <View style={[styles.previewModalInputWrapper]}>
          <TextInput
            editable={!next}
            multiline
            style={[
              styles.previewModalInput,
              next
                ? {borderColor: '#FFA07A', borderWidth: 2}
                : {borderColor: '#282828'},
            ]}
            textAlignVertical="top"
            placeholder="Attachment text"
            placeholderTextColor={'gray'}
            ref={attachmentInputRef}
            onChangeText={t => (attachmentInputRef.current.value = t)}
          />
        </View>
        <View style={styles.modalSendContainer}>
          <View style={styles.freePaidToggle}>
            <TouchableOpacity
              style={[
                styles.free,
                isAttachmentPremium === false
                  ? {backgroundColor: '#a7dbd8'}
                  : null,
              ]}
              onPress={() => handleAttachmentAsPremium(false)}>
              <Text
                style={{
                  fontFamily: 'MabryPro-Regular',
                  fontSize: responsiveFontSize(2.3),
                  color: '#282828',
                }}
                key={'1Free'}>
                Free
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paid,
                isAttachmentPremium === true
                  ? {backgroundColor: '#a7dbd8'}
                  : null,
              ]}
              onPress={() => handleAttachmentAsPremium(true)}>
              <Text
                key={'2Paid'}
                style={{
                  fontFamily: 'MabryPro-Regular',
                  fontSize: responsiveFontSize(2.3),
                  color: '#282828',
                }}>
                Paid
              </Text>
            </TouchableOpacity>
          </View>

          {isAttachmentPremium ? (
            <View style={styles.amountInput}>
              <Text style={styles.titleSetPrice}>Set Price</Text>
              <TextInput
                maxLength={5}
                editable={!next}
                placeholder="Coins 0"
                keyboardType="number-pad"
                style={{borderBottomWidth: 1, padding: 0, paddingLeft: 2}}
                value={amount}
                onChangeText={t => setAmount(t.replace(/[^0-9]/g, ''))}
              />
              <Image
                source={require('../../../Assets/Images/Coin.png')}
                style={{
                  height: responsiveWidth(5),
                  width: responsiveWidth(5),
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  marginRight: responsiveWidth(1),
                }}
              />
            </View>
          ) : null}

          {!next ? (
            <View style={{position: 'relative', alignSelf: 'center'}}>
              <Text
                style={[
                  styles.loginButton,
                  {
                    backgroundColor: '#282828',
                    position: 'absolute',
                    alignSelf: 'center',
                    transform: [{translateX: 2}, {translateY: 2}],
                  },
                ]}
              />
              <Pressable onPress={() => setNext(true)}>
                <Text style={[styles.loginButton]}>
                  NEXT <DIcon provider={'FontAwesome6'} name={'caret-right'} />
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.confirmationView}>
              <Text style={styles.confirmationViewTextTitle}>
                You are about to send attachment ?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  width: responsiveWidth(40),
                  justifyContent: 'space-around',
                }}>
                <View
                  style={[
                    {position: 'relative', alignSelf: 'center'},
                    disableSendBtton ? {display: 'none'} : {display: 'flex'},
                  ]}>
                  <Text
                    style={[
                      styles.loginButton,
                      {
                        backgroundColor: '#282828',
                        position: 'absolute',
                        alignSelf: 'center',
                        transform: [{translateX: 2}, {translateY: 2}],
                        width: responsiveWidth(15),
                      },
                    ]}
                  />
                  <Pressable onPress={() => setNext(false)}>
                    <Text
                      style={[
                        styles.loginButton,
                        {width: responsiveWidth(15)},
                      ]}>
                      <DIcon provider={'FontAwesome6'} name={'xmark'} />
                    </Text>
                  </Pressable>
                </View>
                <View style={{position: 'relative', alignSelf: 'center'}}>
                  <Text
                    style={[
                      styles.loginButton,
                      {
                        backgroundColor: '#282828',
                        position: 'absolute',
                        alignSelf: 'center',
                        transform: [{translateX: 2}, {translateY: 2}],
                        width: responsiveWidth(15),
                      },
                    ]}
                  />
                  <Pressable
                    disabled={disableSendBtton}
                    onPress={handleUploadAttachment}>
                    {disableSendBtton ? (
                      <ActivityIndicator
                        size={'small'}
                        color="#282828"
                        style={[
                          styles.loginButton,
                          {width: responsiveScreenWidth(15)},
                        ]}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.loginButton,
                          {width: responsiveWidth(15)},
                        ]}>
                        <DIcon provider={'FontAwesome6'} name={'check'} />
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalInnerWrapper: {
    height: responsiveWidth(260),
    width: responsiveWidth(99),
    backgroundColor: '#fffdf6',
    alignSelf: 'center',
    borderTopLeftRadius: responsiveWidth(3),
    borderTopRightRadius: responsiveWidth(3),
    padding: responsiveWidth(4),
    paddingTop: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(4),
    alignItems: 'center',
    marginLeft: responsiveWidth(1),
    marginTop: responsiveWidth(75),
  },

  previewModalImageWrapper: {
    flexBasis: '35%',
    width: '100%',
  },

  previewModalInputWrapper: {
    flexBasis: '9%',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: responsiveWidth(2),
    marginVertical: responsiveWidth(2),
  },

  previewModalInput: {
    paddingHorizontal: responsiveWidth(4),
    borderColor: '#282828',
    color: '#353535',
    borderRadius: responsiveWidth(2),
    backgroundColor: '#fffdf6',
    height: responsiveWidth(20),
    borderWidth: 1,
    fontFamily: 'MabryPro-Regular',
  },

  previewModalSendButton: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '400',
    color: '#205cd4',
    textAlign: 'right',
    marginLeft: responsiveWidth(10),
  },

  modalSendContainer: {
    flexDirection: 'column',
    alignItems: 'space-around',
    gap: 5,
  },

  freePaidToggleText: {
    fontSize: responsiveFontSize(2.2),
    textAlignVertical: 'center',
  },

  freePaidToggle: {
    width: responsiveWidth(70),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(2),
    backgroundColor: '#f3f3f3',
    height: responsiveWidth(12),
    borderColor: '#282828',
  },

  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 1,
    padding: responsiveWidth(1),
    borderColor: '#282828',
    height: responsiveWidth(14),
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    width: responsiveWidth(62),
    fontFamily: 'MabryPro-Regular',
  },
  notch: {
    borderTopColor: '#000',
    borderTopWidth: responsiveWidth(0.8),
    width: responsiveWidth(10),
    borderRadius: responsiveWidth(1),
  },
  attachFileText: {
    textAlign: 'center',
    fontFamily: 'Lexend-Bold',
    color: '#ffa07a',
    fontSize: responsiveFontSize(2.2),
    marginVertical: responsiveWidth(2),
  },
  free: {
    borderWidth: 1,
    flexBasis: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: responsiveWidth(2),
    borderBottomLeftRadius: responsiveWidth(2),
    backgroundColor: '#fffdf6',
  },
  paid: {
    borderWidth: 1,
    flexBasis: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: responsiveWidth(2),
    borderBottomRightRadius: responsiveWidth(2),
    backgroundColor: '#fffdf6',
  },
  titleSetPrice: {
    fontSize: responsiveFontSize(2),
    backgroundColor: '#e3dff2',
    height: '90%',
    borderRadius: responsiveWidth(2),
    textAlign: 'center',
    textAlignVertical: 'center',
    flexBasis: '55%',
    fontFamily: 'MabryPro-Regular',
  },
  loginButton: {
    borderWidth: 1,
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#ffa07a',
    marginTop: responsiveWidth(4),
    borderRadius: responsiveWidth(2),
    color: '#282828',
    textAlign: 'center',
    fontFamily: 'Lexend-Medium',
    elevation: 1,
    fontWeight: '600',
    width: responsiveWidth(40),
    height: responsiveWidth(13),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderTopColor: '#282828',
    borderLeftColor: '#282828',
    elevation: 1,
    fontSize: responsiveFontSize(2.8),
  },
  confirmationView: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: responsiveWidth(2),
  },
  confirmationViewTextTitle: {
    fontFamily: 'MabryPro-Bold',
  },
});

export default ChatWindowPreviewModal;
