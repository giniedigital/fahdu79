import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking, Clipboard, Platform, Pressable} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import Feather from 'react-native-vector-icons/Feather';
import AnimatedButton from '../../Components/AnimatedButton';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {Image} from 'expo-image';
import {TextInput} from 'react-native-gesture-handler';
import InputOverlay from '../../Components/InputOverlay';
import useKeyboardHook from '../../CustomHooks/useKeyboardHook';
import {hTwins, nTwins} from '../../../DesiginData/Utility';
import {useDispatch, useSelector} from 'react-redux';
import {toggleAppliedVerify, toggleInstagramVerification} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {useCoverUpdateProfileMutation, useFinalVerificationSubmissionMutation, useLazyInstaVerifyQuery} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {chatRoomSuccess, LoginPageErrors} from '../../Components/ErrorSnacks';
import {autoLogout} from '../../../AutoLogout';
import {navigate} from '../../../Navigation/RootNavigation';
import DIcon from '../../../DesiginData/DIcons';

const GetVerifiedInstagram = ({transferObject, setShowVerifiedModal}) => {
  const dispatch = useDispatch();

  const {isKeyboardVisible, keyboardHeight} = useKeyboardHook();

  const [showConfirmation, setShowConfirmation] = useState('stepone');

  const visible = useSelector(state => state.hideShow.visibility.instagramVerification);

  const [instagram, setInstagram] = useState('');

  const [stepOneVerifyObj, setStepOneVerifyObj] = useState({});

  const regex = /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/;

  const [coverUpdateProfile] = useCoverUpdateProfileMutation();

  const [finalVerificationSubmission] = useFinalVerificationSubmissionMutation();

  const [instaVerify] = useLazyInstaVerifyQuery();

  const token = useSelector(state => state.auth.user.token);

  function getReadableDateTime() {
    return new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  function copyToClipboard(code) {
    const message = `I have applied for verification on Fahdu on ${getReadableDateTime()}.${'\n'}My unique code is ${code}.`;
    Clipboard.setString(message);
    chatRoomSuccess('Message copied to clipboard!');
  }

  const handleVerify = async () => {
    console.log('calliung', instagram);

    if (instagram?.trim() === '') {
      LoginPageErrors('Please give us instagram Username');
      return;
    }

    if (!regex.test(instagram?.trim()) && instagram?.trim().length > 0) {
      LoginPageErrors('Please enter a valid Instagram Username');
      return;
    }

    const {data, error} = await instaVerify({token, handle: instagram});

    console.log(data?.data);

    if (data?.statusCode === 200) {
      setStepOneVerifyObj(data?.data);
      setShowConfirmation('steptwo');
    }

    if (error) {
      if (error?.status === 'FETCH_ERROR') {
        LoginPageErrors('Please check your network');
        return;
      }
      LoginPageErrors(error?.data?.message);
    }

    if (error?.status === 401) {
      autoLogout();
    }
  };

  // console.log(token)

  const handleFinalSubmission = async code => {
    copyToClipboard(code);

    //Your prevous verrifivaiton reqwuest reject5ed. thus you can'tt app;y for revfection after 7Days

    // setShowConfirmation("stepone")
    const {data: finalData, error: finalError} = await finalVerificationSubmission({
      token,
      data: {
        fullName: transferObject.fullName,
        DOB: transferObject.dob,
        niche: transferObject.selectedItems,
        socialHandles: {
          instagram: {
            handle: instagram,
          },
        },
        displayName: transferObject.fahduUserName,
      },
    });

    console.log(finalData, finalError);

    if (finalError?.status === 'FETCH_ERROR') {
      LoginPageErrors('Please check your network');
      return;
    }

    if (finalData?.statusCode === 200) {
      chatRoomSuccess('Thanks for your interest in fahdu creator profile!');

      // Hide the Instagram verification component
      dispatch(toggleInstagramVerification({show: false}));

      console.log(stepOneVerifyObj?.dmUrl);

      // After 500ms, show the "applied verify" component and open the URL
      setTimeout(() => {
        setShowVerifiedModal(true);
        Linking.openURL(stepOneVerifyObj?.dmUrl);
      }, 500);
    }

    if (finalError) {
      LoginPageErrors(finalError?.data?.message);
      setTimeout(() => {
        setShowVerifiedModal(true);
        Linking.openURL(stepOneVerifyObj?.dmUrl);
      }, 500);
    }

    if (finalError?.status === 401) {
      autoLogout();
    }
  };

  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView intensity={15} experimentalBlurMethod style={styles.blurBackground} />
        <Dialog
          visible={visible}
          onTouchOutside={() => dispatch(toggleInstagramVerification({show: false}))}
          dialogStyle={[styles.dialog, showConfirmation === 'stepone' && {height: nTwins(50, 55.5), paddingHorizontal: 32}, showConfirmation === 'steptwo' && {height: responsiveWidth(50)}, showConfirmation === 'stepthree' && {height: nTwins(75, 60.5), paddingHorizontal: 32}]}
          contentStyle={{padding: 0, paddingTop: 0}}>
          {showConfirmation === 'stepone' && (
            <View style={styles.content}>
              <Text style={styles.text}>
                Enter your
                <Text style={{fontFamily: 'Rubik-SemiBold'}}> "Instagram Id" </Text>
                here{' '}
              </Text>

              <View>
                <View style={styles.textInputContainer}>
                  <TextInput
                    value={instagram}
                    onChangeText={t => setInstagram(t)}
                    maxLength={30}
                    selectionColor={'#1e1e1e'}
                    cursorColor={'#1e1e1e'}
                    placeholderTextColor="#B2B2B2"
                    placeholder="Instagram userId"
                    spellCheck={false}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    style={styles.textInputs}
                  />
                </View>
                <InputOverlay
                  isVisible={isKeyboardVisible}
                  style={{
                    marginLeft: responsiveWidth(0.3),
                    marginTop: nTwins(4.8, 4.8),
                    height: 48,
                  }}
                />
              </View>
              {/* <AnimatedButton title={'Submit'} buttonMargin={0} showOverlay={false}  style={{height: hTwins(6.4, 5.91), width: Platform.OS === 'ios' ? 298 : 298, marginTop: 0}} loading={false} /> */}
              <Pressable style={({pressed}) => [styles.button, styles.yesButton, {width: '100%', height: hTwins(6.4, 5.91), width: Platform.OS === 'ios' ? 298 : 298, marginTop: 0}, pressed && {backgroundColor: '#FFC399'}]} onPress={() => handleVerify()}>
                <Text style={styles.buttonText}>Submit</Text>
              </Pressable>
            </View>
          )}

          {showConfirmation === 'steptwo' && (
            <View style={styles.yesNoContainer}>
              <Text style={styles.textYesNo}>
                Is your Instagram Username{'\n'}"<Text style={styles.username}>@{instagram}</Text>" is correct?
              </Text>

              <View style={styles.buttonContainer}>
                <Pressable style={({pressed}) => [styles.button, styles.yesButton, pressed && {backgroundColor: '#FFC399'}]} onPress={() => setShowConfirmation('stepthree')}>
                  <Text style={styles.buttonText}>Yes</Text>
                </Pressable>

                <Pressable style={({pressed}) => [styles.button, styles.noButton, pressed && {backgroundColor: '#FFF3EB'}]} onPress={() => setShowConfirmation('stepone')}>
                  <Text style={styles.buttonText}>No</Text>
                </Pressable>
              </View>
            </View>
          )}

          {showConfirmation === 'stepthree' && (
            <View style={{backgroundColor: '#fff'}}>
              <Text style={styles.copyMessageText}>Copy this message and send it to us using the button below or via DM on our handle @fahduIndia </Text>
              <View style={styles.copyContainer}>
                <Text style={styles.copyText}>
                  I applied for creator verification on{'\n'}
                  <Text style={styles.boldText}>FAHDU - {stepOneVerifyObj?.dmMessage?.split('-')[1]}</Text>
                </Text>

                <TouchableOpacity onPress={() => copyToClipboard(stepOneVerifyObj?.dmMessage?.split('-')[1])} style={styles.copyButton}>
                  <Image source={require('../../../Assets/Images/copy.png')} style={styles.icon} />
                </TouchableOpacity>
              </View>
              <Pressable
                style={({pressed}) => [styles.button, styles.yesButton, {height: hTwins(6.4, 5.91), alignSelf: 'center', width: Platform.OS === 'ios' ? '100%' : 298, marginTop: 12, marginBottom: 12}, pressed && {backgroundColor: '#FFC399'}]}
                onPress={() => handleFinalSubmission(stepOneVerifyObj?.dmMessage?.split('-')[1])}>
                <Text style={styles.buttonText}>
                  {`Send this on `} <DIcon provider={'Entypo'} name={'instagram'} size={responsiveWidth(3)} />
                </Text>
              </Pressable>
            </View>
          )}
        </Dialog>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: responsiveWidth(5.33),
    borderWidth: 2,
    borderStyle: 'dashed',
    alignSelf: 'center',
    padding: 32,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    width: responsiveWidth(92),
    borderColor: '#1e1e1e',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor : 'red'
  },
  text: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    textAlign: 'left',
    textTransform: 'none',
    color: '#1e1e1e',
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
  iconContainer: {
    height: 35,
    width: 46.4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  textInputContainer: {
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(4),
    paddingLeft: responsiveWidth(5.33),
    width: '99%',
    // marginTop: responsiveWidth(6),
    // marginVertical : responsiveWidth(3)
    marginTop: responsiveWidth(3),
    marginBottom: responsiveWidth(3),
  },
  textInputs: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    flex: 1,
    height: 48,
    borderRadius: responsiveWidth(3.73),
  },
  //yes no container

  yesNoContainer: {
    alignItems: 'center',
    // padding: 15,
    // backgroundColor: 'blue',
    alignSelf: 'center',
  },
  textYesNo: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: responsiveFontSize(2.1),
    textAlign: 'center',
    color: '#1e1e1e',
  },
  username: {
    fontFamily: 'Rubik-Bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    gap: 4,
    width: '100%',
    marginTop: 16,
    // backgroundColor : 'red'
  },
  button: {
    width: Platform.OS === 'android' ? 138 : 140,
    height: 42,
    // paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderWidth: 1.5,
    borderColor: '#1E1E1E',
  },
  yesButton: {
    backgroundColor: '#ffa86b',
  },
  noButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    color: '#1e1e1e',
  },
  copyMessageText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    width: nTwins(74, 74.5),
    alignSelf: 'center',
    color: '#1e1e1e',
  },
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#1e1e1e',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 20,
    width: nTwins(72, 74.5),
    marginTop: 16,
    alignSelf: 'center',
  },
  copyText: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    color: '#1e1e1e',
  },
  boldText: {
    fontFamily: 'Rubik-Bold',
  },
  copyButton: {
    // padding: 8,
    marginLeft: 9,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});

export default GetVerifiedInstagram;
