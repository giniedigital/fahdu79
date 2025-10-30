import {Pressable, StyleSheet, Text, View, Keyboard, TouchableOpacity, Platform} from 'react-native';
import React, {useCallback, useState, useEffect, useRef} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {responsiveWidth, responsiveFontSize, responsiveHeight} from 'react-native-responsive-dimensions';
import {LoginPageErrors, VerifyEmail} from '../../Components/ErrorSnacks';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserInformation} from '../../../Redux/Slices/NormalSlices/AuthSlice';
import {checkApplicationPermission} from '../../../Permissions';
import {enableNotificationModal, toggleEmailVerificationModal, toggleForgetPassword, toggleVerficationScreen} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {selectionTwin, validEmail} from '../../../DesiginData/Utility';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {nTwins} from '../../../DesiginData/Utility';
import Back from '../../../Assets/svg/back.svg';
import DIcon from '../../../DesiginData/DIcons';
import {navigate} from '../../../Navigation/RootNavigation';
import {setKeyboardHeight} from '../../../Redux/Slices/NormalSlices/AppData/KeyboardPropertiesSlice';
import ForgetPassword from '../../Components/LoginComponent/ForgetPassword';
import Eye from '../../../Assets/svg/eye.svg';
import CutEye from '../../../Assets/svg/cutEye.svg';
import {useNavigation} from '@react-navigation/native';
import useKeyboardHook from '../../CustomHooks/useKeyboardHook';
import InputOverlay from '../../Components/InputOverlay';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedButton from '../../Components/AnimatedButton';
import {Image} from 'expo-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import EmailVerificationModal from './EmailVerificationModal';
import {setCredentials} from '../../../Redux/Slices/NormalSlices/TempCredentials';
import Authenticator from '../../Components/LoginComponent/Authenticator';
import ChevronLoader from '../../ChevronLoader';

const LoginPassword = ({route}) => {
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);
  const [authToken, setAuthToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const dispatcher = useDispatch();
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const showEmailVerificationModal = useSelector(state => state.hideShow.visibility.emailVerification);

  const {isKeyboardVisible} = useKeyboardHook();

  const afterLoginProcess = useCallback(async data => {
    await AsyncStorage.setItem('data', data?.data?.token);

    console.log('FULLLLLNAME', data?.data?.user?.fullName);

    dispatcher(
      currentUserInformation({
        token: data?.data?.token,
        currentUserId: data?.data?.user?._id,
        currentUserFullName: data?.data?.user?.fullName,
        currentUserDisplayName: data?.data?.user?.displayName,
        currentUserProfilePicture: data?.data?.user?.profile_image?.url,
        role: data?.data?.user?.role,
        email: data?.data?.user?.email,
        currentUserCoverPicture: data?.data?.user?.cover_photo?.url,
        passwordCreated: data?.data?.user?.passwordCreated,
        licenseAgreed: data?.data?.user?.licenseAgreed,
        onlyBrandsAccess: data?.data?.user?.onlyBrandsAccess ?? false,
        ylyticInstagramUserId: data?.data?.user?.ylyticInstagramUserId ?? null,
        is_phone_verified: data?.data?.user?.is_phone_verified,
        suspended: data?.data?.user?.suspended,
      }),
    );

    checkApplicationPermission().then(e => {
      console.log('NOTIFICATION PERMISSION', e);

      if (e === 'granted') {
        // navigation.navigate("chatRoomTab");
      } else if (e === 'denied') {
        checkApplicationPermission().then(e => {
          if (e === 'denied') {
            console.log('enabling');
            dispatcher(enableNotificationModal());
          }
        });
      } else if (e === 'never_ask_again') {
        dispatcher(enableNotificationModal());
      }
    });
  }, []);

  async function logInHandler() {
    Keyboard.dismiss();

    if (route?.params?.email?.trim()?.length === 0) {
      LoginPageErrors('Please enter email address');
      return;
    }

    if (!validEmail(route?.params?.email?.trim())) {
      LoginPageErrors('Provide valid email address');
      return;
    }

    if (route?.params?.email.length > 0) {
      if (password.length > 0) {
        setLoading(true);

        try {
          const {data, status, request} = await axios.post(
            'https://api.fahdu.in/api/user/signin',

            {email: route?.params?.email?.trim(), password: password.trim()},
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'System-Agent': `${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`,
                'App-Platform': `${Platform.OS}`,
              },
              timeout: 5000,
            },
          );

          console.log(data?.statusCode, '::::::EMAIL LOGIN');

          if (data?.statusCode === 200) {
            setLoading(false);
            afterLoginProcess(data);
            setAuthToken(data?.data?.authToken);
          } else if (data?.statusCode === 202) {
            setLoading(false);
            setType(data?.data?.email);
            setAuthToken(data?.data?.authToken);
            dispatcher(toggleVerficationScreen({show: 1}));
          } else {
            setLoading(false);
            LoginPageErrors('Something Went Wrong');
          }
        } catch (e) {
          console.log(e);

          if (e.message === 'Network Error') {
            LoginPageErrors('Please check your network');
            setLoading(false);
          } else {
            LoginPageErrors('Something went wrong, please try again later');
            console.log('Error at 160');
            setLoading(false);
          }

          if (e?.response?.data?.message.search('Invalid') >= 0) {
            console.log('luada');

            console.log(e?.response?.data?.message);
            LoginPageErrors(e?.response?.data?.message);
            setLoading(false);
            return;
          }

          if (e?.response?.data?.message.search('verify') >= 0) {
            VerifyEmail('Email not verified, link sent to your mail please verify', route?.params?.email?.trim(), e?.response?.data?.data?.token);
            setLoading(false);

            dispatcher(toggleEmailVerificationModal({show: true}));
            dispatcher(setCredentials({data: {email: route?.params?.email?.trim(), password: password.trim()}}));

            return;
          }
        }
      } else {
        LoginPageErrors('Please enter password');
      }
    } else LoginPageErrors('Please Enter Valid Details');
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      {loading && <ChevronLoader />}

      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate('LoginEmail')}>
          <Back />
        </TouchableOpacity>
        <Text style={styles.heading}>Login</Text>
        <Text style={styles.subHead}>Welcome to Fahdu, Login to Continue...</Text>
        <Text style={styles.fieldName}>Password</Text>

        <View>
          <View style={styles.textInputContainer}>
            <TextInput
              selectionColor={selectionTwin()}
              selectionHandleColor={'#ffa86b'}
              cursorColor={'#1e1e1e'}
              maxLength={20}
              placeholderTextColor="#B2B2B2"
              placeholder="Enter Password "
              spellCheck={false}
              autoCorrect={false}
              style={styles.textInputs}
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
            />
            <Pressable style={styles.iconContainer} onPress={() => setPasswordVisible(!isPasswordVisible)}>
              {isPasswordVisible ? <Image source={require('../../../Assets/Images/eyeOpen.png')} contentFit="contain" style={styles.eyeStyle} /> : <Image source={require('../../../Assets/Images/eyeClose.png')} contentFit="contain" style={styles.eyeStyle} />}
            </Pressable>
          </View>

          <Pressable style={{alignSelf: 'flex-end', marginTop: responsiveWidth(2.93)}} onPress={() => navigate('forgetPassword', {email: route?.params?.email})}>
            <Text style={{fontFamily: 'Rubik-Medium', fontSize: responsiveFontSize(1.48), color: '#1e1e1e'}}>Forgot Password?</Text>
          </Pressable>

          <InputOverlay
            style={{
              marginLeft: responsiveWidth(1.06),
              marginTop: nTwins(4.8, 4.8),
            }}
            isVisible={isKeyboardVisible}
          />
        </View>

        <AnimatedButton title={'Login'} onPress={logInHandler} loading={loading} />

        {/* <View style={styles.forgotPasswordContainer}>
          <Pressable onPress={() => navigate('forgetPassword', {email: route?.params?.email})}>
            <Text style={styles.signupText}>
              Forgotten password? <Text style={styles.signupLink}>Recover</Text>
            </Text>
          </Pressable>
        </View> */}

        <TouchableOpacity style={styles.alreadyAccountContainer} onPress={() => navigate('SignupEmail')}>
          <View style={styles.alreadyAccountRow}>
            <Text style={styles.alreadyAccountText}>Don't you have an account? </Text>
            <Text style={styles.forgotTextTitle}>SignUp</Text>
          </View>
        </TouchableOpacity>
      </View>
      <EmailVerificationModal visible={showEmailVerificationModal} />
      {authToken && <Authenticator authToken={authToken} type={type} afterLoginProcess={afterLoginProcess} />}
    </SafeAreaView>
  );
};

export default LoginPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    margin: responsiveWidth(6.4),
  },
  backButton: {
    height: responsiveWidth(10),
    width: responsiveWidth(10),
  },
  heading: {
    // marginTop: responsiveWidth(5),
    fontFamily: 'Rubik-Bold',
    color: '#1e1e1e',
    fontSize: 24,
  },
  subHead: {
    width: responsiveWidth(90),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    fontSize: 14,
    marginTop: Platform.OS === 'android' ? 0 : 10,
  },
  subHeadHighlight: {
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    fontSize: 14,
  },
  subHeadHighlight: {
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    fontSize: 14,
  },
  fieldName: {
    marginTop: responsiveWidth(5.5),
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    fontSize: responsiveFontSize(1.97),
  },
  textInputContainer: {
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(4),
    paddingLeft: responsiveWidth(5.33),
    width: '100%',
    marginTop: responsiveWidth(2.67),
  },
  textInputs: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    flex: 1,
    height: responsiveHeight(6.65),
    borderRadius: responsiveWidth(3.73),
  },

  loginButtonContainer: {
    marginTop: responsiveWidth(5),
    alignSelf: 'center',
  },
  loginButton: {
    padding: Platform.OS === 'ios' ? responsiveWidth(4) : null,
    backgroundColor: 'rgba(255, 168, 107, 1)',
    borderRadius: responsiveWidth(4),
    color: '#282828',
    textAlign: 'center',
    fontFamily: 'Rubik-Medium',
    fontWeight: '600',
    width: responsiveWidth(85),
    height: responsiveWidth(14),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderWidth: responsiveWidth(0.5),
    borderTopColor: '#282828',
    borderLeftColor: '#282828',
    fontSize: responsiveFontSize(2.4),
    overflow: 'hidden',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveWidth(5),
  },
  forgotPasswordText: {
    textAlign: 'center',
    fontFamily: 'Rubik-Medium',
    color: '#FF7F50',
  },
  iconContainer: {
    marginRight: responsiveWidth(4),
  },
  signupText: {
    textAlign: 'center',
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
  },
  signupLink: {
    color: '#FF7F50',
  },
  iconContainer: {
    marginRight: responsiveWidth(4),
    height: 19,
    width: 19,
  },
  eyeStyle: {
    flex: 1,
  },
  alreadyAccountContainer: {
    marginTop: responsiveWidth(5),
    width: '100%',
    alignSelf: 'center',
  },
  alreadyAccountRow: {
    flexDirection: 'row',
    marginTop: responsiveWidth(3),
    alignSelf: 'center',
  },
  alreadyAccountText: {
    textAlign: 'center',
    color: '#1e1e1e',
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
  },
  forgotTextTitle: {
    color: '#FF7F50',
    fontSize: 14,
    fontFamily: 'Rubik-Medium',
  },
});
