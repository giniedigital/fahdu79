import {Pressable, StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {navigate} from '../../../Navigation/RootNavigation';
import {responsiveWidth, responsiveFontSize, responsiveHeight} from 'react-native-responsive-dimensions';
import {nTwins, selectionTwin, validEmail} from '../../../DesiginData/Utility';
import {LoginPageErrors} from '../../Components/ErrorSnacks';
import Back from '../../../Assets/svg/back.svg';
import InputOverlay from '../../Components/InputOverlay';
import useKeyboardHook from '../../CustomHooks/useKeyboardHook';
import AnimatedButton from '../../Components/AnimatedButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {validateEmail} from '../../../DesiginData/Utility';
const SignupEmail = () => {
  const [email, setEmail] = useState('');
  const {isKeyboardVisible} = useKeyboardHook();

  const handleGoToNext = async () => {
    const validationResult = validateEmail(email);

    if (validationResult.isValid) {
      navigate('SignupPassword', {email});
    } else {
      LoginPageErrors(validationResult.message);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate('LoginHome')}>
          <Back />
        </TouchableOpacity>
        <Text style={styles.heading}>Sign Up</Text>
        <Text style={styles.subHead}>Earn from your content on your terms.</Text>
        <Text style={styles.fieldName}>Email</Text>

        <View>
          <View style={styles.textInputContainer}>
            <TextInput selectionColor={selectionTwin()}
            
            selectionHandleColor={'#ffa86b'}
            
            cursorColor={'#1e1e1e'} placeholderTextColor="#B2B2B2" placeholder="Enter Email" spellCheck={false} autoCorrect={false} autoCapitalize={'none'} style={styles.textInputs} onChangeText={t => setEmail(t)} />
          </View>
          <InputOverlay 
          isVisible={isKeyboardVisible} 
          style={{
            marginLeft: responsiveWidth(1.06),
            marginTop: nTwins(4.4, 4.8),
          }}
          />
        </View>

        <AnimatedButton title={'Next'} onPress={handleGoToNext} loading={false} />

        <TouchableOpacity style={styles.alreadyAccountContainer} onPress={() => navigate('LoginEmail')}>
          <View style={styles.alreadyAccountRow}>
            <Text style={styles.alreadyAccountText}>Do you have an account? </Text>
            <Text style={styles.forgotTextTitle}>Login</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignupEmail;

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
    marginTop: responsiveWidth(2),
  },
  textInputs: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    flex: 1,
    height: responsiveHeight(6.65),
    borderRadius: responsiveWidth(3.73),
  },

  alreadyAccountContainer: {
    marginTop: responsiveWidth(5),
    width : "100%",
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
