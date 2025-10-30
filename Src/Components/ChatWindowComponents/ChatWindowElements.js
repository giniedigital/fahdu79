import {Image, StyleSheet, Text, TouchableOpacity, View, Linking, ImageBackground, Vibration, ToastAndroid, Pressable, Platform} from 'react-native';
import React from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';

import Moment from 'react-moment';
import DIcon from '../../../DesiginData/DIcons';
import {useDispatch} from 'react-redux';
import {toggleChatWindowFullSizedImageModal, toggleChatWindowPaymentModal, toggleChatWindowVideoModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {useInitiatePaymentMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';

import {setUnlockPremiumTempData} from '../../../Redux/Slices/NormalSlices/MessageSlices/ChatWindowUnlockPremiumTempDataSlice';

// import Clipboard from "@react-native-clipboard/clipboard";

import Hyperlink from 'react-native-hyperlink';
import {navigate} from '../../../Navigation/RootNavigation';
import {FONT_SIZES, isSingleEmoji, WIDTH_SIZES} from '../../../DesiginData/Utility';
import WhatsAppTime from '../WhatsAppTime';
import TippedBadge from '../../Screens/Stream/Comments/TippedBadge';

const externalPdfLinkingHandler = url => {
  // Linking.openURL(url).catch((err) => {
  //   console.log(err);
  // });
  navigate('pdfReader', {url});
};

const handleCopyToClipBoard = text => {
  Vibration.vibrate([25, 50]);
  // Clipboard.setString(text);
  ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
};

export const LeftChatBubble = ({displayThread, setFullVideoModalUri, token, chatRoomId: roomId, setFullSizeImageUri}) => {
  const [initiatePayment] = useInitiatePaymentMutation();

  const dispatch = useDispatch();

  const handleFullScreenVideoModal = React.useCallback(uri => {
    setFullVideoModalUri(uri);
    dispatch(toggleChatWindowVideoModal());
    console.log(uri);
  }, []);

  const handlePremiumPayment = React.useCallback((conversationId, amount) => {
    console.log(conversationId, amount, roomId);

    initiatePayment({token, conversationId, roomId})
      .then(e => {
        if (e.error.data.message === 'MESSAGE_ATTACHMENT_PAYMENT') {
          console.log(e.error.data.message);
          dispatch(setUnlockPremiumTempData({conversationId, canPay: true, amount}));
          dispatch(toggleChatWindowPaymentModal());
        } else {
          dispatch(setUnlockPremiumTempData({conversationId, canPay: false, amount}));
          dispatch(toggleChatWindowPaymentModal());
        }
      })
      .catch(e => console.log('Handle Premium Payment Error', e));
  }, []);

  const handleImageZoomView = React.useCallback(uri => {
    setFullSizeImageUri(uri);
    dispatch(toggleChatWindowFullSizedImageModal());
  });

  if (displayThread?.attachment?.updateCoin === true) {
    return (
      <View>
        <View style={styles.feeSetupBlock}>
          <Text style={styles.feeSetupText}>{displayThread.message}</Text>
        </View>
        <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timimingTwo} />
      </View>
    );
  }

  if (displayThread.attachment.is_charagble === true && displayThread.attachment.paid_by_reciever === false) {
    console.log('()()', displayThread?.attachment?.preview);

    return (
      <View style={[styles.leftChat]}>
        <View>
          <View style={[styles.mediaRichMessageWrapper]}>
            <View style={{flex: 1, position: 'relative', overflow: 'hidden'}}>
              {displayThread.attachment.preview !== 'assets/icons/pdf.png' ? (
                <Image source={{uri: displayThread.attachment.preview}} resizeMode={'cover'} resizeMethod={'resize'} style={styles.chatimage} blurRadius={4} />
              ) : (
                <View style={styles.pdf}>
                  <Text style={styles.pdfText}>.PDF</Text>
                </View>
              )}
              <View
                style={[
                  styles.playIconContainer,
                  {
                    borderRadius: 0,
                    backgroundColor: 'transparent',
                    width: responsiveWidth(32),
                    marginTop: '40%',
                  },
                ]}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.5),
                    color: 'white',
                    fontFamily: 'Rubik-Regular',
                    marginBottom: responsiveWidth(4),
                    textTransform: 'capitalize',
                  }}>
                  {/* {displayThread.attachment.format} */}
                </Text>
                {displayThread.attachment.preview !== 'assets/icons/pdf.png' && <DIcon name={displayThread?.attachment?.format === 'image' ? 'lock' : 'control-play'} provider={'SimpleLineIcons'} color="#fff" size={responsiveWidth(12)} />}

                <Text
                  style={{
                    fontSize: responsiveFontSize(2),
                    color: 'white',
                    fontFamily: 'Rubik-Medium',
                    textTransform: 'capitalize',
                    marginTop: responsiveWidth(2),
                  }}>
                  {/* {'Coins | ' + displayThread.attachment.charge_amount} */}
                </Text>
              </View>

              <View style={[styles.premiumOverlay]}>
                <Text style={styles.textPremium}>{`To unlock the ${displayThread?.attachment?.format}`}</Text>

                <Pressable onPress={() => handlePremiumPayment(displayThread._id, displayThread.attachment.charge_amount)} style={({pressed}) => [styles.button, styles.yesButton, {backgroundColor: pressed ? 'black' : styles.yesButton.backgroundColor || 'transparent'}]}>
                  {({pressed}) => (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={[styles.buttonText, {color: pressed ? 'white' : styles.buttonText.color || 'black'}]}>
                        Pay{' '}
                        <Text
                          style={{
                            fontFamily: 'Rubik-Bold',
                            fontSize: FONT_SIZES[16],
                            color: pressed ? 'white' : styles.buttonText.color || 'black',
                          }}>
                          {displayThread.attachment.charge_amount}
                        </Text>
                      </Text>
                      <Image
                        source={require('../../../Assets/Images/Coins2.png')}
                        style={{
                          height: responsiveWidth(4.5),
                          width: responsiveWidth(4.5),
                          resizeMode: 'contain',
                          alignSelf: 'center',
                          marginLeft: responsiveWidth(1),
                          // No tintColor — keep original icon color
                        }}
                      />
                    </View>
                  )}
                </Pressable>
              </View>
            </View>

            {/* {displayThread.message !== '' ? (
              <Text selectable style={styles.mediaRichChatText}>
                {displayThread.message}
              </Text>
            ) : null} */}
          </View>

          <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timiming} />
        </View>
      </View>
    );
  }

  if (displayThread?.coinDetail === true) {
    return (
      <TouchableOpacity style={styles.leftChat} onLongPress={() => handleCopyToClipBoard(displayThread.message)}>
        <View style={styles.chatContainerLeftWrapper}>
          {/* Sender Profile Image */}

          <View style={[styles.chatContainerLeft, {flexDirection: 'row', alignItems: 'center'}]}>
            <Image source={{uri: displayThread.sender.profile_image.url}} style={styles.profileImage} />
            <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{textDecorationLine: 'underline', color: '#2AA6DF'}}>
              <Text style={[styles.chatText]} key={Math.random()}>
                {displayThread.message.replace(/ coins/g, '')}
              </Text>
            </Hyperlink>

            {/* Coin Image */}
            <Image source={require('../../../Assets/Images/Coins.png')} style={styles.coinImage} />
          </View>

          <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timiming} />
        </View>
      </TouchableOpacity>
    );
  }

  if (displayThread.attachment.format === 'video') {
    return (
      <View style={styles.leftChat}>
        <View>
          <View style={styles.mediaRichMessageWrapper}>
            <View style={{flex: 1, position: 'relative'}}>
              <Image source={{uri: displayThread.attachment.preview}} resizeMode={'contain'} resizeMethod={'resize'} style={styles.chatimageRight} />
              <TouchableOpacity style={[styles.playIconContainer, {marginTop: '50%'}, {marginTop: displayThread.attachment.charge_amount > 0 ? '45%' : '70%'}]} onPress={() => handleFullScreenVideoModal(displayThread.attachment.url)}>
                <DIcon name={'control-play'} provider={'SimpleLineIcons'} color="#fff" size={responsiveWidth(12)} />
              </TouchableOpacity>
            </View>
            {displayThread.message !== '' ? (
              <Text selectable style={styles.mediaRichChatText}>
                {displayThread.message}
              </Text>
            ) : null}
          </View>
          <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timiming} />
        </View>
      </View>
    );
  }

  if (displayThread.attachment.format === 'document') {
    return (
      <View style={styles.leftChat}>
        <View>
          <TouchableOpacity style={[styles.mediaRichMessageWrapper, styles.leftChatPdf, displayThread.message !== '' ? {height: responsiveWidth(87)} : null]} onPress={() => externalPdfLinkingHandler(displayThread.attachment.url)}>
            {/* <Image source={require('../../../Assets/Images/pdfThumbnail2.png')} resizeMode={'cover'} resizeMethod={'resize'} style={[styles.chatimageRight, {borderRadius: 0, width: '100%', resizeMode: 'cover'}]} /> */}
            <View style={[styles.pdf, {height: '88.5%'}]}>
              <Text style={styles.pdfText}>.PDF</Text>
            </View>
            {displayThread.message !== '' ? (
              <Text selectable style={styles.mediaRichChatText}>
                {displayThread.message}
              </Text>
            ) : null}
          </TouchableOpacity>
          <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timiming} />
        </View>
      </View>
    );
  }

  if (displayThread?.attachment?.format === 'image') {
    return (
      <View style={styles.leftChat}>
        {displayThread.message !== '' && displayThread.attachment.url !== '' ? (
          <View>
            <View style={styles.mediaRichMessageWrapper}>
              {displayThread.attachment.url !== 'assets/default/default-profile.jpg' ? (
                <TouchableOpacity style={{flex: 1}} onPress={() => handleImageZoomView(displayThread.attachment.url)}>
                  <Image source={displayThread.attachment.url ? {uri: displayThread.attachment.url} : require('../../../Assets/Images/Profile.jpg')} resizeMode={'cover'} resizeMethod={'resize'} style={styles.chatimage} />
                </TouchableOpacity>
              ) : (
                <Image source={require('../../../Assets/Images/Profile.jpg')} resizeMode={'cover'} resizeMethod={'resize'} style={styles.chatimage} />
              )}
              <Text selectable style={styles.mediaRichChatText}>
                {displayThread.message}
              </Text>
            </View>
            <Moment style={styles.timiming} element={Text} fromNow>
              {displayThread.createdAt}
            </Moment>
          </View>
        ) : displayThread.message === '' && displayThread.attachment.url !== '' ? (
          <View style={styles.chatContainerLeftWrapper}>
            <View style={styles.mediaRichMessageWrapper}>
              <TouchableOpacity style={{flex: 1}} onPress={() => handleImageZoomView(displayThread.attachment.url)}>
                <Image source={{uri: displayThread.attachment.url}} resizeMode={'cover'} resizeMethod={'resize'} style={styles.chatimage} />
              </TouchableOpacity>
            </View>
            <Moment style={styles.timiming} element={Text} fromNow>
              {displayThread.createdAt}
            </Moment>
          </View>
        ) : null}
      </View>
    );
  }

  if (displayThread?.attachment?.format === '') {
    return (
      <TouchableOpacity style={styles.leftChat} onLongPress={() => handleCopyToClipBoard(displayThread.message)}>
        <View style={styles.chatContainerLeftWrapper}>
          <View style={styles.chatContainerLeft}>
            <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{textDecorationLine: 'underline', color: '#2AA6DF'}}>
              <Text style={[styles.chatText]} key={Math.random()}>
                {displayThread.message}
              </Text>
            </Hyperlink>
          </View>
          <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timiming} />
        </View>
      </TouchableOpacity>
    );
  }
};

export const RightChatBubble = ({displayThread, setFullVideoModalUri, setFullSizeImageUri}) => {
  const dispatch = useDispatch();

  const handleFullScreenVideoModal = React.useCallback(uri => {
    setFullVideoModalUri(uri);
    dispatch(toggleChatWindowVideoModal());
    console.log(uri);
  }, []);

  const handleImageZoomView = React.useCallback(uri => {
    setFullSizeImageUri(uri);
    dispatch(toggleChatWindowFullSizedImageModal());
  });

  if (displayThread?.attachment?.updateCoin === true) {
    return (
      <View>
        <View style={styles.feeSetupBlock}>
          <Text style={styles.feeSetupText}>{displayThread.message}</Text>
        </View>
        <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timimingTwo} />
      </View>
    );
  }

  if (displayThread.attachment.is_charagble === true && displayThread.attachment.format === 'image') {
    return (
      <View style={[styles.rightChat]}>
        <View>
          <View style={[styles.mediaRichMessageWrapperRight]}>
            <View style={{flex: 1, position: 'relative'}}>
              <TouchableOpacity style={{flex: 1}} onPress={() => handleImageZoomView(displayThread.attachment.url)}>
                <Image source={{uri: displayThread.attachment.url}} resizeMode={'cover'} resizeMethod={'resize'} style={styles.chatimage} />
              </TouchableOpacity>
            </View>

            {displayThread.message !== '' ? (
              <Text selectable style={styles.mediaRichChatTextRight}>
                {displayThread.message}
              </Text>
            ) : null}

            <TouchableOpacity style={[styles.button, styles.yesButton, {marginBottom: 14}]}>
              <Text style={styles.buttonText}>
                <Text style={{fontFamily: 'Rubik-Bold', fontSize: FONT_SIZES[16]}}>{displayThread.attachment.charge_amount}</Text>
              </Text>
              <Image source={require('../../../Assets/Images/Coins2.png')} style={{height: responsiveWidth(4.5), width: responsiveWidth(4.5), resizeMode: 'contain', alignSelf: 'center', marginLeft: responsiveWidth(1)}} />
            </TouchableOpacity>
          </View>
          <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timimingTwo} />
        </View>
      </View>
    );
  }

  if (displayThread.attachment.format === 'video') {
    return (
      <View style={styles.rightChat}>
        <View>
          <View style={styles.mediaRichMessageWrapperRight}>
            <View style={{flex: 1, position: 'relative'}}>
              <Image source={{uri: displayThread.attachment.preview}} resizeMode={'contain'} resizeMethod={'resize'} style={styles.chatimageRight} />
              <TouchableOpacity style={[styles.playIconContainer, {marginTop: displayThread.attachment.charge_amount > 0 ? '45%' : '70%'}]} onPress={() => handleFullScreenVideoModal(displayThread.attachment.url)}>
                <DIcon name={'play-circle'} provider={'FontAwesome5'} color="#fff" size={responsiveWidth(12)} />
              </TouchableOpacity>

              {displayThread.message !== '' ? (
                <Text selectable style={styles.mediaRichChatTextRight}>
                  {displayThread.message}
                </Text>
              ) : null}

              {displayThread.attachment.charge_amount > 0 ? (
                <TouchableOpacity style={[styles.button, styles.yesButton, {marginBottom: WIDTH_SIZES[14]}]} onPress={() => handlePremiumPayment(displayThread._id, displayThread.attachment.charge_amount)}>
                  <Text style={styles.buttonText}>
                    <Text style={{fontFamily: 'Rubik-Bold', fontSize: FONT_SIZES[16]}}>{displayThread.attachment.charge_amount}</Text>
                  </Text>
                  <Image source={require('../../../Assets/Images/Coins2.png')} style={{height: responsiveWidth(4.5), width: responsiveWidth(4.5), resizeMode: 'contain', alignSelf: 'center', marginLeft: responsiveWidth(1)}} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timimingTwo} />
        </View>
      </View>
    );
  }

  if (displayThread.attachment.format === 'document') {
    return (
      <View style={[styles.rightChat]}>
        <View>
          <TouchableOpacity style={[styles.mediaRichMessageWrapperRight, styles.rightChatPdf, displayThread.message !== '' ? {height: responsiveWidth(87)} : null]} onPress={() => externalPdfLinkingHandler(displayThread.attachment.url)}>
            <View style={{flex: 1, position: 'relative'}}>
              {/* <Image source={require('../../../Assets/Images/pdf-thumbnail2My.png')} resizeMode={'cover'} resizeMethod={'resize'} style={[styles.chatimageRight, {borderRadius: 0, width: '100%', resizeMode: 'cover'}]} /> */}
              <View style={[styles.pdf, {height: '100%'}]}>
                <Text style={styles.pdfText}>.PDF</Text>
              </View>
            </View>

            {displayThread.message !== '' ? (
              <Text selectable style={[styles.mediaRichChatTextRight]}>
                {displayThread.message}
              </Text>
            ) : null}
            {displayThread.attachment.charge_amount > 0 ? (
              // <View style={[styles.stripContainer, {marginTop: responsiveWidth(60)}]}>
              //   <View style={[styles.premiumIcon, {top: responsiveWidth(2)}]}>
              //     <DIcon name={'workspace-premium'} provider={'MaterialIcons'} color="#fff" size={responsiveWidth(10)} />
              //   </View>
              //   <View style={styles.strip}>
              //     <Text style={styles.stripText}>Paid | Coins • {displayThread.attachment.charge_amount}</Text>
              //   </View>
              // </View>

              <View style={[styles.premiumOverlay, {borderTopWidth: 0, height: '25%'}]}>
                <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={() => handlePremiumPayment(displayThread._id, displayThread.attachment.charge_amount)}>
                  <Text style={styles.buttonText}>
                    <Text style={{fontFamily: 'Rubik-Bold', fontSize: FONT_SIZES[16]}}>{displayThread.attachment.charge_amount}</Text>
                  </Text>
                  <Image source={require('../../../Assets/Images/Coins2.png')} style={{height: responsiveWidth(4.5), width: responsiveWidth(4.5), resizeMode: 'contain', alignSelf: 'center', marginLeft: responsiveWidth(1)}} />
                </TouchableOpacity>
              </View>
            ) : null}
          </TouchableOpacity>
          <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timimingTwo} />
        </View>
      </View>
    );
  }

  if (displayThread.attachment.format === 'image') {
    return (
      <View style={styles.rightChat}>
        {displayThread.message !== '' && displayThread.attachment.url !== '' ? (
          <View>
            <View style={styles.mediaRichMessageWrapperRight}>
              {displayThread.attachment.url !== 'assets/default/default-profile.jpg' ? (
                <Pressable style={{flex: 1}} onPress={() => handleImageZoomView(displayThread.attachment.url)}>
                  <Image source={{uri: displayThread.attachment.url}} resizeMode={'contain'} resizeMethod={'resize'} style={styles.chatimageRight} />
                </Pressable>
              ) : (
                <Image source={require('../../../Assets/Images/Profile.jpg')} resizeMode={'contain'} resizeMethod={'resize'} style={styles.chatimageRight} />
              )}
              <Text selectable style={styles.mediaRichChatTextRight}>
                {displayThread.message}
              </Text>
            </View>
            <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timimingTwo} />
          </View>
        ) : displayThread.message === '' && displayThread.attachment.url !== '' ? (
          <View>
            <View style={styles.mediaRichMessageWrapperRight}>
              <Pressable style={{flex: 1}} onPress={() => handleImageZoomView(displayThread.attachment.url)}>
                <Image source={{uri: displayThread.attachment.url}} resizeMode={'cover'} resizeMethod={'resize'} style={styles.chatimage} />
              </Pressable>
            </View>

            <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timimingTwo} />
          </View>
        ) : null}
      </View>
    );
  }

  if (displayThread.attachment.format === '') {
    if (displayThread?.message?.search('tipped') > 0) {
      console.log(displayThread.message, 'MESSAGE');

      const tippedMatch = displayThread.message.match(/tipped (\d+)/);

      return (
        <TouchableOpacity style={styles.rightChat} onLongPress={() => handleCopyToClipBoard(displayThread.message)}>
          <View style={styles.chatContainerLeftWrapper}>
            {/* Receiver Profile Image */}
            <View style={[styles.chatContainerRight, {flexDirection: 'row', alignItems: 'center'}]}>
              <Image source={{uri: displayThread.sender?.profile_image?.url}} style={styles.profileImage} />
              <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{textDecorationLine: 'underline', color: '#2AA6DF'}}>
                <Text style={[styles.chatText]} key={Math.random()}>
                  {displayThread.message.replace(/(\d+)\scoins/, (_, num) => '')}
                </Text>
              </Hyperlink>

              {/* {displayThread.message.match(/tipped (\d+)/) && <Text style={[styles.chatText, {fontFamily: 'Rubik-SemiBold'}]}>{displayThread.message.match(/tipped (\d+)/)[1]}</Text>} */}

              {tippedMatch && <Text style={[styles.chatText, {fontFamily: 'Rubik-SemiBold'}]}>{tippedMatch[1]}</Text>}

              {/* Coin Image */}
              <Image source={require('../../../Assets/Images/Coins2.png')} style={styles.coinImage} />
            </View>

            <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timimingTwo} />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.rightChat} onLongPress={() => handleCopyToClipBoard(displayThread.message)}>
          <View style={styles.chatContainerLeftWrapper}>
            <View style={styles.chatContainerRight}>
              <Hyperlink onPress={(url, text) => Linking.openURL(url)} linkStyle={{textDecorationLine: 'underline', color: '#2AA6DF'}}>
                {/* { isSingleEmoji(displayThread.message) ? <Text } */}

                <Text adjustsFontSizeToFit style={styles.chatTextRight}>
                  {displayThread.message}
                </Text>
              </Hyperlink>
            </View>
            <WhatsAppTime timestamp={displayThread.createdAt} style={styles.timimingTwo} />
          </View>
        </TouchableOpacity>
      );
    }
  }
};

const styles = StyleSheet.create({
  leftChat: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginVertical: 6,
  },
  rightChat: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 6,
    // backgroundColor : 'red'
  },

  chatContainerLeft: {
    maxWidth: responsiveWidth(70),
    minWidth: responsiveWidth(10),
    borderWidth: WIDTH_SIZES[1.5],
    paddingVertical: WIDTH_SIZES[10],
    paddingHorizontal: WIDTH_SIZES[16],
    flexDirection: 'column',
    borderColor: '#1e1e1e',
    borderRadius: WIDTH_SIZES[14],
    backgroundColor: '#FFF9F5',
    borderTopLeftRadius: responsiveWidth(0),
  },

  chatContainerRight: {
    maxWidth: responsiveWidth(70),
    minWidth: responsiveWidth(2),
    borderWidth: 1,
    paddingVertical: WIDTH_SIZES[10],
    paddingHorizontal: WIDTH_SIZES[16],
    flexDirection: 'column',
    borderColor: '#1e1e1e',
    borderRadius: WIDTH_SIZES[14],
    borderBottomRightRadius: responsiveWidth(0),
    backgroundColor: '#FFC399',
  },

  mediaRichMessageWrapper: {
    height: responsiveWidth(100),
    width: responsiveWidth(60),
    backgroundColor: '#FFF9F5',
    borderRadius: WIDTH_SIZES[14],
    overflow: 'hidden',
    borderTopLeftRadius: responsiveWidth(0),
    borderWidth: WIDTH_SIZES[1.5],
  },

  mediaRichMessageWrapperRight: {
    borderWidth: WIDTH_SIZES[1.5],
    borderColor: '#1e1e1e',
    height: responsiveWidth(100),
    width: responsiveWidth(60),
    backgroundColor: '#FFC399',
    borderRadius: WIDTH_SIZES[14],
    overflow: 'hidden',
    borderBottomRightRadius: responsiveWidth(0),
  },

  chatimage: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
    borderTopRightRadius: responsiveWidth(2),
    borderTopLeftRadius: responsiveWidth(0.0),
    borderBottomWidth: WIDTH_SIZES[1.5],
  },
  chatimageRight: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
  },
  chatContainerLeftWrapper: {},
  chatText: {
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    fontSize: FONT_SIZES[14],
  },
  chatTextRight: {
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    fontSize: FONT_SIZES[14],
  },
  mediaRichChatText: {
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    fontSize: FONT_SIZES[14],
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(2),
    borderTopWidth: WIDTH_SIZES[1.5],
  },
  mediaRichChatTextRight: {
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    fontSize: FONT_SIZES[14],
    paddingVertical: responsiveWidth(2.5),
    paddingHorizontal: responsiveWidth(3),
    borderTopWidth: WIDTH_SIZES[1.5],
    borderColor: '#1e1e1e',
  },
  timiming: {
    fontSize: FONT_SIZES[10],
    fontFamily: 'Rubik-Regular',
    paddingLeft: responsiveWidth(2),
    paddingTop: responsiveWidth(0.8),
    color: '#1e1e1e',
  },
  playIconContainer: {
    position: 'absolute',
    height: responsiveWidth(22),
    width: responsiveWidth(22),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: responsiveWidth(4),
    borderRadius: responsiveWidth(15),
  },
  leftChatPdf: {
    height: responsiveWidth(81),
  },
  rightChatPdf: {
    height: responsiveWidth(81),
  },

  stripContainer: {
    width: '100%',
    height: responsiveWidth(15),
    position: 'absolute',
    marginTop: responsiveWidth(75),
    justifyContent: 'center',
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000090',
    paddingLeft: responsiveWidth(10),
    alignItems: 'center',
    height: '40%',
  },
  stripText: {
    color: 'white',
    fontFamily: 'Rubik-Regular',
  },
  premiumIcon: {
    position: 'absolute',
    // top : responsiveWidth(2),
    zIndex: 1,
  },

  timimingTwo: {
    fontSize: FONT_SIZES[10],
    fontFamily: 'Rubik-Regular',
    paddingLeft: responsiveWidth(2),
    paddingTop: responsiveWidth(0.8),
    color: '#1e1e1e',
    textAlign: 'right',
    marginRight: WIDTH_SIZES[1.5],
  },

  profileImage: {
    width: WIDTH_SIZES[32] - WIDTH_SIZES[2],
    height: WIDTH_SIZES[32] - WIDTH_SIZES[2],
    borderRadius: responsiveWidth(30),
    marginRight: WIDTH_SIZES[8],
    borderWidth: WIDTH_SIZES[2],
    borderColor: '#1e1e1e',
  },
  coinImage: {
    width: WIDTH_SIZES[16],
    height: WIDTH_SIZES[16],
    marginLeft: WIDTH_SIZES[4],
    marginBottom: WIDTH_SIZES[2],
  },
  premiumOverlay: {
    backgroundColor: '#FFC399',
    top: 0,
    borderTopWidth: WIDTH_SIZES[1.5],
    paddingHorizontal: WIDTH_SIZES[16],
    paddingTop: WIDTH_SIZES[12],
    paddingBottom: WIDTH_SIZES[14],
  },
  textPremium: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: FONT_SIZES[14],
    color: '#1e1e1e',
  },

  //premium chats overlay

  button: {
    width: responsiveWidth(51),
    height: 48,
    borderRadius: WIDTH_SIZES[14],
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Platform.OS === 'android' ? 6 : 8,
    borderWidth: WIDTH_SIZES[1.5],
    borderColor: '#1E1E1E',
    alignSelf: 'center',
    marginTop: WIDTH_SIZES[8],
  },
  yesButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  buttonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: FONT_SIZES[14],
    color: '#1e1e1e',
  },

  pdf: {
    backgroundColor: '#1e1e1e',
    // height: '70%',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  pdfText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: FONT_SIZES[32],
    color: '#fff',
    textAlign: 'center',
  },
  feeSetupBlock: {
    padding: WIDTH_SIZES[8],
    backgroundColor: '#FFC39947',
    marginVertical: WIDTH_SIZES[8],
    borderRadius: WIDTH_SIZES[4],
  },
  feeSetupText: {
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    textAlign: 'center',
    fontSize: FONT_SIZES[12],
  },
});
