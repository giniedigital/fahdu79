import {StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Pressable, ActivityIndicator, Platform, Keyboard} from 'react-native';
import React, {useEffect, useState} from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import {useLazyGetFeeSetupDetailsQuery, useUpdateFeeSetupMutation, useUploadAttachmentMutation} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {token as memoizedToken} from '../../Redux/Slices/NormalSlices/AuthSlice';
import {LoginPageErrors, chatRoomSuccess} from '../Components/ErrorSnacks';
import {autoLogout} from '../../AutoLogout';
import {useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import Loader from '../Components/Loader';
import {padios} from '../../DesiginData/Utility';
import {useKeyboard} from '@react-native-community/hooks';
import {navigate} from '../../Navigation/RootNavigation';
import Paisa from '../../Assets/svg/paisa.svg';
import Upload from '../../Assets/svg/upload.svg';
import AnimatedButton from '../Components/AnimatedButton';
import InfoModal from './revenue/InfoModal';
import {reduceImageSize} from '../../FFMPeg/FFMPegModule';
import {Image} from 'expo-image';
import {useContactInfo} from '../Hook/FeeSetupUpdate';

const ManageRevenueFeeSetup = ({route}) => {
  const [forSubscribers, setForSubscribers] = useState(false);
  const [isSubscribers, setIsSubscribers] = useState(false);
  const [forSubscribersVideo, setForSubscribersVideo] = useState(false);
  const [forSubscribersAudio, setForSubscribersAudio] = useState(false);
  const [forSubscribersLiveStream, setForSubscribersLiveStream] = useState(false);
  const token = useSelector(state => state.auth.user.token);

  const userId = useSelector(state => state.auth.user.currentUserId);

  const {fetchContactInfo} = useContactInfo(token, userId);

  const [caption, setCaption] = useState('');
  const [captionSub, setCaptionSub] = useState('');

  const [count, setCount] = useState(0);

  const [amount, setAmount] = useState(0);
  const [amountVideo, setAmountVideo] = useState(0);
  const [amountAudio, setAmountAudio] = useState(0);
  const [amountLiveStream, setAmountLiveStream] = useState(0);

  const [amountSub, setAmountSub] = useState(0);
  const [amountVideoSub, setAmountVideoSub] = useState(0);
  const [amountAudioSub, setAmountAudioSub] = useState(0);
  const [amountLiveStreamSub, setAmountLiveStreamSub] = useState(0);

  const [image, setImage] = useState(undefined);
  const [imageSub, setImageSub] = useState(undefined);
  const [selectedImage, setSelectedImage] = useState({});
  const [serverImageUrl, setServerImageUrl] = useState(undefined);

  const [amountError, setAmountError] = useState('');
  const [amountVideoError, setAmountVideoError] = useState('');
  const [amountAudioError, setAmountAudioError] = useState('');
  const [amountLiveStreamError, setAmountLiveStreamError] = useState('');

  const [currentSelectedInput, setCurrentSelectedInput] = useState(0);

  const [buttonDisable, setDisableButton] = useState(false);

  const [loading, setLoading] = useState(false);

  const [loadingPage, setLoadingPage] = useState(true);

  const [getFeeSetupDetails] = useLazyGetFeeSetupDetailsQuery();

  const [updateFeeSetup] = useUpdateFeeSetupMutation();

  const [uploadAttachment] = useUploadAttachmentMutation();

  const keyboard = useKeyboard();

  const handleTextInput = x => {
    if (forSubscribers) {
      setCount(x?.length);
      setCaptionSub(x);
    } else {
      setCount(x?.length);
      setCaption(x);
    }
  };

  const handleAmount = (t, index, forSubscribers) => {
    console.log(forSubscribers);

    // Allow clearing the input when backspace is pressed
    if (t === '') {
      if (index === 1) {
        setAmount('');
        setAmountError('');
      }
      if (index === 2) {
        setAmountVideo('');
        setAmountVideoError('');
      }
      if (index === 3) {
        setAmountAudio('');
        setAmountAudioError('');
      }
      if (index === 4) {
        setAmountLiveStream('');
        setAmountLiveStreamError('');
      }
      return;
    }

    // Convert input to number
    const num = parseInt(t, 10);

    // Always update the state to allow typing
    if (index === 1) setAmount(t);
    if (index === 2) setAmountVideo(t);
    if (index === 3) setAmountAudio(t);
    if (index === 4) setAmountLiveStream(t);

    // Validate: Check if the number is a multiple of 2
    if (!isNaN(num) && num % 2 !== 0) {
      const errorMessage = 'Please enter a multiple of 2';

      if (index === 1) setAmountError(errorMessage);
      if (index === 2) setAmountVideoError(errorMessage);
      if (index === 3) setAmountAudioError(errorMessage);
      if (index === 4) setAmountLiveStreamError(errorMessage);
    } else {
      if (index === 1) setAmountError('');
      if (index === 2) setAmountVideoError('');
      if (index === 3) setAmountAudioError('');
      if (index === 4) setAmountLiveStreamError('');
    }
  };

  // ✅ Automatically update button state using useEffect
  useEffect(() => {
    const isAnyEmpty = !String(amount).trim() || !String(amountVideo).trim() || !String(amountAudio).trim() || !String(amountLiveStream).trim();

    const hasError = !!amountError || !!amountVideoError || !!amountAudioError || !!amountLiveStreamError;

    setDisableButton(isAnyEmpty || hasError);
  }, [amount, amountVideo, amountAudio, amountLiveStream, amountError, amountVideoError, amountAudioError, amountLiveStreamError]);

  useEffect(() => {
    const getDetails = async () => {
      const {data, error} = await getFeeSetupDetails({token});

      if (error) {
        if (error?.status === 'FETCH_ERROR') {
          LoginPageErrors('Please check your network');
        }

        if (error?.data?.status_code === 401) {
          autoLogout();
        }
      }

      if (data) {
        setAmountAudio(data?.data?.AudioFee?.followAmount);
        setAmountAudioSub(data?.data?.AudioFee?.subsAmount);

        setAmountLiveStream(data?.data?.StreamFee?.followAmount);
        setAmountLiveStreamSub(data?.data?.StreamFee?.subsAmount);

        setAmountVideo(data?.data?.VideoFee?.followAmount);
        setAmountVideoSub(data?.data?.VideoFee?.subsAmount);

        setAmount(data?.data?.chatFee?.followers?.amount);
        setAmountSub(data?.data?.chatFee?.subscribers?.amount);

        setCaption(data?.data?.chatFee?.followers?.message);
        setCount(data?.data?.chatFee?.followers?.message?.length || data?.data?.chatFee?.subscribers?.message?.length);
        setCaptionSub(data?.data?.chatFee?.subscribers?.message);

        setImage(data?.data?.chatFee?.followers?.image?.url);
        setImageSub(data?.data?.chatFee?.subscribers?.image?.url);
      }
    };

    getDetails().then(() => {
      setLoadingPage(false);
    });
  }, [token]);

  const openImageGall = async () => {
    try {
      setLoading(true);
      const mediaInfo = await launchImageLibrary({mediaType: 'photo', selectionLimit: 1});
      const compressedImage = await reduceImageSize(mediaInfo?.assets[0]?.uri);
      console.log('Compressed Image Path:', compressedImage);

      setSelectedImage({
        uri: mediaInfo?.assets[0]?.uri,
        type: mediaInfo?.assets[0]?.type,
        name: mediaInfo?.assets[0]?.fileName,
      });

      const formData = new FormData();

      formData.append('keyName', 'feeSetup_image_android');

      formData.append('file', {
        uri: compressedImage,
        type: mediaInfo?.assets[0]?.type,
        name: mediaInfo?.assets[0]?.fileName,
      });

      uploadAttachment({
        token,
        formData,
      }).then(async e => {
        console.log(e);

        if (e?.data?.statusCode === 200) {
          console.log('uploaded');
          setLoading(false);
          setServerImageUrl(e?.data?.data?.url);
        }
      });
    } catch (e) {
      setLoading(false);
      console.log(e, ':::::Opne image gallery ManageRevenueFeeSetup');
    }
  };

  const handleSave = async () => {
    setLoading(true);

    const {data, error} = await updateFeeSetup({
      token,
      data: {
        // chatSubAmount: amountSub,
        chatSubMessage: captionSub,
        chatSubImage: forSubscribers && serverImageUrl ? serverImageUrl : imageSub,
        chatFollowAmount: amount,
        chatFollowMessage: caption,
        chatFollowImage: !forSubscribers && serverImageUrl ? serverImageUrl : image,
        // videoSubAmount: amountVideoSub,
        videoFollowAmount: amountVideo,
        // audioSubAmount: amountAudioSub,
        audioFollowAmount: amountAudio,
        // streamSubAmount: amountLiveStreamSub,
        streamFollowAmount: amountLiveStream,
      },
    });

    console.log(error);

    if (error) {
      if (error?.status === 'FETCH_ERROR') {
        LoginPageErrors('Please check your network');
      }

      if (error?.data?.status_code === 401) {
        autoLogout();
      }

      LoginPageErrors(error?.data?.message);
      setLoading(false);
    }

    if (data) {
      if (route?.params?.from === 'livestream') {
        setLoading(false);
        fetchContactInfo();
        navigate('beforeStreamScreen');
      } else {
        fetchContactInfo();
        chatRoomSuccess('Fee setup updated successfully!');
        setLoading(false);
      }
    }
  };

  if (loadingPage) {
    return <Loader />;
  }

  console.log(forSubscribers, '::::::::::::::::::::::::::::::');

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}} contentContainerStyle={[{flexGrow: 1}, keyboard.keyboardShown && Platform.OS === 'ios' ? {paddingBottom: keyboard.keyboardHeight + responsiveWidth(10)} : {}]} showsVerticalScrollIndicator={false}>
        {/* <Text style={{ textAlign: "center", fontFamily: "MabryPro-Medium", color: "#1e1e1e", fontSize: responsiveFontSize(2.3), width: responsiveWidth(80), alignSelf: "center" }}>Boost subscribers with a higher follower fee for exclusive content</Text> */}

        <View style={[styles.box, {marginTop: 0}]}>
          <View>
            <Text style={{fontFamily: 'Rubik-SemiBold', fontSize: responsiveFontSize(2), color: '#1E1E1E', marginTop: responsiveWidth(2)}}>Set Chat Fee</Text>
            <Text style={{fontFamily: 'Rubik-Regular', fontSize: responsiveFontSize(1.5), color: '#1e1e1e', marginTop: responsiveWidth(1)}}>Create your custom automated message</Text>
          </View>

          <View style={[styles.center, {flexDirection: 'row', marginTop: responsiveWidth(4.3), width: responsiveWidth(90), alignSelf: 'center', justifyContent: 'center', gap: responsiveWidth(2.2)}]}>
            <View style={styles.textInputContainer}>
              <TextInput value={!forSubscribers ? caption : captionSub} style={styles.textInputStyle} maxLength={120} placeholder="Write, what's in your mind!" multiline onChangeText={x => handleTextInput(x)} />
              <Text style={styles.characterCount}>
                {count}/<Text style={{color: '#1e1e1e', fontFamily: 'Rubik-Medium'}}>120</Text>
              </Text>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={selectedImage?.uri ? {uri: selectedImage?.uri} : !image || !imageSub ? require('../../Assets/Images/selectMedia.png') : !forSubscribers ? {uri: image} : {uri: imageSub}}
                resizeMethod="resize"
                contentFit="contain"
                placeholder={require('../../Assets/Images/man.png')}
                placeholderContentFit="contain"
                style={{width: '100%', height: '100%'}}
              />
              {loading && (
                <View style={styles.uploadingImage}>
                  <ActivityIndicator size={'large'} color={'#fff'} />
                </View>
              )}
            </View>
            <TouchableOpacity style={{position: 'absolute', left: responsiveWidth(80), top: responsiveWidth(17)}} onPress={() => openImageGall()}>
              <Upload />
            </TouchableOpacity>
          </View>

          <View style={[styles.amountInput, currentSelectedInput === 1 && {backgroundColor: '#FFF6F0'}]}>
            <View style={{flexDirection: 'row', backgroundColor: 'red'}}>
              <View style={[styles.titleback]}>
                <Text style={[styles.titleSetPrice]}>Set Price</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput
                maxLength={6}
                keyboardType="number-pad"
                style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                value={!forSubscribers ? String(amount) : String(amountSub)}
                onChangeText={t => handleAmount(t.replace(/[^0-9]/g, ''), 1, forSubscribers)}
                onFocus={() => setCurrentSelectedInput(1)}
                onBlur={() => setCurrentSelectedInput(0)}
              />
              <Paisa />
            </View>
          </View>

          {amountError ? <Text style={[styles.liveMinute, {color: '#F73B3B'}]}>*{amountError}</Text> : <Text style={styles.liveMinute}>*Chat/Msg.</Text>}

          <View style={styles.containerSub}>
            <Text style={styles.text}>Subscriber Fee</Text>
            <View style={styles.rightSection}>
              <Text style={styles.amount}>{amount % 2 === 0 ? amount / 2 : 0}</Text>
              <Paisa />
            </View>
          </View>
        </View>

        <View style={styles.box}>
          <Text style={styles.heading}>Set Video call Fee</Text>
          <Text style={[styles.insideBoxTitle]}>Create your custom fee for video call </Text>

          <View style={[styles.amountInput, {alignSelf: 'center', width: '100%'}, currentSelectedInput === 2 && {backgroundColor: '#FFF6F0'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback]}>
                <Text style={[styles.titleSetPrice]}>Set Price</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput
                maxLength={6}
                keyboardType="number-pad"
                style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                value={!forSubscribers ? String(amountVideo) : String(amountVideoSub)}
                onChangeText={t => handleAmount(t.replace(/[^0-9]/g, ''), 2, forSubscribersVideo)}
                onFocus={() => setCurrentSelectedInput(2)}
                onBlur={() => setCurrentSelectedInput(0)}
              />
              <Paisa />
            </View>
          </View>

          {amountVideoError ? <Text style={[styles.liveMinute, {color: '#F73B3B'}]}>*{amountVideoError}</Text> : <Text style={styles.liveMinute}>*Call/Minute</Text>}

          <View style={styles.containerSub}>
            <Text style={styles.text}>Subscriber Fee</Text>
            <View style={styles.rightSection}>
              <Text style={styles.amount}>{amountVideo % 2 === 0 ? amountVideo / 2 : 0}</Text>
              <Paisa />
            </View>
          </View>
        </View>

        <View style={styles.box}>
          <Text style={styles.heading}> Set Audio call Fee</Text>

          <Text style={styles.insideBoxTitle}> Create your custom fee for audio call </Text>

          <View style={[styles.amountInput, {alignSelf: 'center', width: '100%'}, currentSelectedInput === 3 && {backgroundColor: '#FFF6F0'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback]}>
                <Text style={[styles.titleSetPrice]}>Set Price</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput
                maxLength={6}
                keyboardType="number-pad"
                style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                value={!forSubscribers ? String(amountAudio) : String(amountAudioSub)}
                onChangeText={t => handleAmount(t.replace(/[^0-9]/g, ''), 3, forSubscribersAudio)}
                onFocus={() => setCurrentSelectedInput(3)}
                onBlur={() => setCurrentSelectedInput(0)}
              />
              <Paisa />
            </View>
          </View>

          {amountAudioError ? <Text style={[styles.liveMinute, {color: '#F73B3B'}]}>*{amountAudioError}</Text> : <Text style={styles.liveMinute}>*Call/Minute</Text>}

          <View style={styles.containerSub}>
            <Text style={styles.text}>Subscriber Fee</Text>
            <View style={styles.rightSection}>
              <Text style={styles.amount}>{amountAudio % 2 === 0 ? amountAudio / 2 : 0}</Text>
              <Paisa />
            </View>
          </View>
        </View>

        <View style={styles.box}>
          <Text style={styles.heading}>Set Livestream Fee</Text>
          <Text style={styles.insideBoxTitle}>Create your custom fee for livestream </Text>

          {/* <View style={[styles.amountIn, {alignSelf: 'center'}]}>
              <View style={{flexDirection: 'row'}}>
                <View style={[styles.titleback]}>
                  <Text style={[styles.titleSetPrice]}>Set Price</Text>
                </View>

                {Platform.OS == 'ios' && <View style={[styles.ios]}></View>}
              </View>

              <View style={{flexDirection: 'row', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
                <TextInput
                  maxLength={6}
                  keyboardType="number-pad"
                  value={forSubscribers ? String(amountLiveStream) : String(amountLiveStreamSub)}
                  onChangeText={t => handleAmount(t.replace(/[^0-9]/g, ''), 4, forSubscribersLiveStream)}
                  style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                />
                <Paisa />
              </View>
            </View> */}

          <View style={[styles.amountInput, {alignSelf: 'center', width: '100%'}, currentSelectedInput === 4 && {backgroundColor: '#FFF6F0'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback]}>
                <Text style={[styles.titleSetPrice]}>Set Price</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput
                maxLength={6}
                keyboardType="number-pad"
                value={!forSubscribers ? String(amountLiveStream) : String(amountLiveStreamSub)}
                onChangeText={t => handleAmount(t.replace(/[^0-9]/g, ''), 4, forSubscribersLiveStream)}
                style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                onFocus={() => setCurrentSelectedInput(4)}
                onBlur={() => setCurrentSelectedInput(0)}
              />
              <Paisa />
            </View>
          </View>

          {amountLiveStreamError ? <Text style={[styles.liveMinute, {color: '#F73B3B'}]}>*{amountLiveStreamError}</Text> : <Text style={styles.liveMinute}>*Stream/Minute</Text>}

          <View style={styles.containerSub}>
            <Text style={styles.text}>Subscriber Fee</Text>
            <View style={styles.rightSection}>
              <Text style={styles.amount}>{amountLiveStream % 2 === 0 ? amountLiveStream / 2 : 0}</Text>
              <Paisa />
            </View>
          </View>
        </View>

        <View style={{width: responsiveWidth(85.5), alignSelf: 'center'}}>
          <AnimatedButton title={'Save'} onPress={handleSave} loading={loading} disabled={buttonDisable} />
        </View>
        <View style={{height: responsiveWidth(20)}} />
      </ScrollView>

      <InfoModal />
    </View>
  );
};

export default ManageRevenueFeeSetup;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: responsiveFontSize(2),
    color: '#1e1e1e',
  },
  box: {
    borderColor: '#1e1e1e',
    // padding: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    marginVertical: 24,
    // backgroundColor : 'red'
  },

  insideBoxTitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.5),
    color: '#1e1e1e',
    marginTop: 8,

    // left: responsiveWidth(10),
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

  ios: {
    height: responsiveWidth(11.5),
    width: responsiveWidth(2),
    backgroundColor: '#FF8580',
    position: 'absolute',
    left: responsiveWidth(27.5),
    borderRightWidth: responsiveWidth(0.3),
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
  textInputContainer: {
    borderWidth: 1,
    width: '66%',
    height: responsiveWidth(25),
    padding: responsiveWidth(2),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(3.7),
  },
  textInputStyle: {
    backgroundColor: '#fff',
    width: responsiveWidth(40),
    paddingLeft: responsiveWidth(2),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    height: responsiveWidth(21),
    fontSize: responsiveFontSize(1.8),
  },

  characterCount: {
    textAlign: 'right',
    fontSize: responsiveFontSize(1.4),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    position: 'absolute',
    transform: [
      {
        translateY: responsiveWidth(18),
      },
      {
        translateX: responsiveWidth(42),
      },
    ],
  },

  imageContainer: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
    height: responsiveWidth(25),
    width: responsiveWidth(25),
    resizeMode: 'contain',
    overflow: 'hidden',
    borderRadius: responsiveWidth(3.7),
  },

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
  loginButton: {
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#FF8580',
    borderRadius: responsiveWidth(3),
    color: '#1e1e1e',
    textAlign: 'center',
    fontFamily: 'Rubik-Medium',
    elevation: 1,
    fontWeight: '500',
    width: responsiveWidth(85),
    height: responsiveWidth(10),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderTopColor: '#1e1e1e',
    borderLeftColor: '#1e1e1e',
    elevation: 1,
    fontSize: responsiveFontSize(2.2),
    padding: padios(responsiveWidth(2.6)),
    overflow: 'hidden',
    marginTop: responsiveWidth(1),
    borderBottomWidth: responsiveWidth(1),
    borderRightWidth: responsiveWidth(1),
    height: responsiveWidth(13),
    borderWidth: responsiveWidth(0.3),
    // left: responsiveWidth(1),
  },
  loginButtonIos: {
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#FF8580',
    borderRadius: responsiveWidth(3),
    color: '#1e1e1e',
    textAlign: 'center',
    position: 'absolute',
    top: responsiveWidth(0.8),
    left: responsiveWidth(0.7),

    fontFamily: 'Rubik-Medium',
    elevation: 1,
    fontWeight: '500',
    width: responsiveWidth(85),
    height: responsiveWidth(10),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderTopColor: '#1e1e1e',
    borderLeftColor: '#1e1e1e',
    elevation: 1,
    fontSize: responsiveFontSize(2.2),
    padding: padios(responsiveWidth(2.6)),
    overflow: 'hidden',
    marginTop: responsiveWidth(1),
    borderBottomWidth: responsiveWidth(1),
    borderRightWidth: responsiveWidth(1),
    height: responsiveWidth(13),
    borderWidth: responsiveWidth(0.3),
    // left: responsiveWidth(1),
  },
  liveMinute: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.3),
    alignSelf: 'flex-end',
    marginTop: responsiveWidth(1.1),
  },

  //Style

  containerSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FF7819',
    borderRadius: responsiveWidth(3.7),
    borderStyle: 'dashed',
    backgroundColor: '#FFF9F5',
    marginTop: 16,
  },
  text: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    marginRight: 6,
  },
  uploadingImage: {
    backgroundColor: '#00000060',
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
