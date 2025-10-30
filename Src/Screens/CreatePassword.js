import {StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator, Keyboard, Platform, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {useResetPasswordMutation} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {useDispatch, useSelector} from 'react-redux';
import {LoginPageErrors, chatRoomSuccess} from '../Components/ErrorSnacks';
import {navigate} from '../../Navigation/RootNavigation';

import Back from '../Components/Back/Back';

import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import InputOverlay from '../Components/InputOverlay';
import AnimatedButton from '../Components/AnimatedButton';

import {SafeAreaView} from 'react-native-safe-area-context';

import {Image} from 'expo-image';
import {nTwins, selectionTwin} from '../../DesiginData/Utility';

const CreatePassword = ({route}) => {
  const [password, setPassword] = useState('');
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cShowPassword, cSetShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const [focusedInput, setFocusedInput] = useState(null); // Tracks the currently focused input
  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [resetPassword] = useResetPasswordMutation();
  const token = useSelector(state => state.auth.user.token);

  const passwordInputRef = useRef(null); // Ref for password input
  const confirmPasswordInputRef = useRef(null); // Ref for confirm password input

  const handlePassword = new_pass => {
    setPassword(new_pass);

    const lowerCase = /[a-z]/g;
    const upperCase = /[A-Z]/g;
    const numbers = /[0-9]/g;
    const spaces = /\s/g;
    const specialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\|=]/;

    if (!new_pass.match(lowerCase)) {
      setErrorMessage('Password must contain lowercase letters');
      setIsPasswordStrong(false);
    } else if (!new_pass.match(upperCase)) {
      setErrorMessage('Password must contain uppercase letters');
      setIsPasswordStrong(false);
    } else if (!new_pass.match(numbers)) {
      setErrorMessage('Password must contain numbers');
      setIsPasswordStrong(false);
    } else if (new_pass.length < 6) {
      setErrorMessage('Password length must be more than 6.');
      setIsPasswordStrong(false);
    } else if (new_pass.match(spaces)) {
      setErrorMessage('Do not use spaces in the password.');
      setIsPasswordStrong(false);
    } else if (!new_pass.match(specialCharacter)) {
      setErrorMessage('Password must have at least one special character.');
      setIsPasswordStrong(false);
    } else {
      setIsPasswordStrong(true);
      setErrorMessage('Password is strong!');
    }
  };

  const setNewPasswordHandler = async () => {
    if (!password || !confirmPassword) {
      LoginPageErrors('Input fields are empty');
      return;
    }

    if (password !== confirmPassword) {
      LoginPageErrors('New and confirm password do not match');
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      const response = await resetPassword({
        token,
        data: {
          cPassword: confirmPassword,
          email: route?.params?.email,
          newPassword: password,
        },
      });

      if (response?.error) {
        LoginPageErrors(response?.error?.data?.message || 'Something went wrong');
      } else if (response?.data?.statusCode === 200) {
        chatRoomSuccess(response?.data?.message);
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('LoginHome'), 1000);
      }
    } catch (error) {
      LoginPageErrors('Network error! Please try again.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate('LoginEmail')}>
          <Back />
        </TouchableOpacity>

        <Text style={styles.heading}>Create New Password</Text>
        <Text style={styles.subHead}>Your new Password must be unique</Text>

        <Text style={styles.fieldName}>New Password</Text>

        <View>
          <View style={[styles.textInputContainer, Platform.OS === "ios" && !isPasswordStrong && password.length > 0 ? {backgroundColor: '#FEEBEB'} : null]}>
            <TextInput
              ref={passwordInputRef} // Ref for this input
              style={[styles.textInputs, Platform.OS === "ios" && !isPasswordStrong && password.length > 0 ? {color: '#FF5252', backgroundColor: '#FEEBEB'} : null]}
              secureTextEntry={!showPassword}
              onChangeText={handlePassword}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
              selectionColor={selectionTwin()}
              cursorColor={'#1e1e1e'}
              maxLength={64}
              placeholder='Enter new password'
              selectionHandleColor={'#ffa86b'}
              placeholderTextColor="#B2B2B2"
            />
            <Pressable style={styles.iconContainer} onPress={() => setShowPassword(prev => !prev)}>
              {showPassword ? <Image  source={require('../../Assets/Images/eyeOpen.png')} contentFit="contain" style={styles.eyeStyle} /> : <Image source={require('../../Assets/Images/eyeClose.png')} contentFit="contain" style={styles.eyeStyle} />}
            </Pressable>
          </View>
          {focusedInput === 'password' && (
            <InputOverlay
              isVisible
              style={{
                marginLeft: responsiveWidth(1.06),
                marginTop: nTwins(4.8, 4.8),
              }}
            />
          )}

          {password.length > 0 && (
            <>
              {isPasswordStrong ? null : (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}
            </>
          )}
        </View>

        <Text style={styles.fieldName}>Confirm New Password</Text>

        <View>
          <View style={[styles.textInputContainer]}>
            <TextInput
              ref={confirmPasswordInputRef} // Ref for this input
              style={styles.textInputs}
              secureTextEntry={!cShowPassword}
              onChangeText={t => setConfirmPassword(t)}
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput(null)}
              selectionColor={selectionTwin()}
              cursorColor={'#1e1e1e'}
              maxLength={64}
              placeholder='Confirm new password'
              selectionHandleColor={'#ffa86b'}
              placeholderTextColor="#B2B2B2"
            />
            <Pressable style={styles.iconContainer} onPress={() => cSetShowPassword(prev => !prev)}>
              {cShowPassword ? <Image source={require('../../Assets/Images/eyeOpen.png')} contentFit="contain" style={styles.eyeStyle} /> : <Image source={require('../../Assets/Images/eyeClose.png')} contentFit="contain" style={styles.eyeStyle} />}
            </Pressable>
          </View>
          {focusedInput === 'confirmPassword' && (
            <InputOverlay
              isVisible
              style={{
                marginLeft: responsiveWidth(1.06),
                marginTop: nTwins(4.8, 4.8),
              }}
            />
          )}
        </View>

        <AnimatedButton title={'Reset Password'} onPress={setNewPasswordHandler} loading={loading} />
      </View>
    </SafeAreaView>
  );
};

export default CreatePassword;

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
    marginTop: Platform.OS === "android" ? 0 : 10,
  },
  subHeadHighlight: {
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    fontSize: 14,
  },
  subHeadHighlight: {
    fontFamily: 'Rubik-Medium',
    color: 'black',
    fontSize: 14,
  },

  fieldName: {
    marginTop: responsiveWidth(5.5),
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    fontSize: responsiveFontSize(1.97),
  },
  fieldNameSec: {
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

  iconContainer: {
    marginRight: responsiveWidth(4),
    height: 19,
    width: 19,
    backgroundColor : 'transparent'
  },
  button: {
    padding: Platform.OS === 'ios' ? responsiveWidth(4) : null,
    backgroundColor: '#FFA86B',
    borderRadius: responsiveWidth(4),
    borderWidth: responsiveWidth(0.5),
    alignSelf: 'center',
    width: responsiveWidth(85),
    height: responsiveWidth(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveWidth(2),
  },
  buttonText: {
    fontFamily: 'Rubik-Medium',
    fontWeight: '600',
    fontSize: responsiveFontSize(2.1),
    color: '#282828',
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveWidth(2.67),
  },

  errorText: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.48),
    color: 'red',
    flexShrink: 1,
  },
  successText: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.8),
    color: 'green',
    flexShrink: 1,
  },
  eyeStyle: {
    flex: 1,
    backgroundColor : 'transparent'
  },
});
