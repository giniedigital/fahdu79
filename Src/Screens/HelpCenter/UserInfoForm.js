import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Back from '../../Components/Back/Back';
import InputOverlay from '../../Components/InputOverlay';
import AnimatedButton from '../../Components/AnimatedButton';
import {nTwins, selectionTwin} from '../../../DesiginData/Utility';
import HelpCenterModal from './HelpCenterModal';
import {toggleHelpCenterModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';

const PhoneNumberScreen = () => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);

  const showHelpModal = useSelector(state => state.hideShow.visibility.helpCenterModal);

  const dispatch = useDispatch();

  const phoneInputRef = useRef(null);
  const navigation = useNavigation();

  const validateIndianPhoneNumber = number => {
    const cleaned = number.replace(/\D/g, '');
    // Must be exactly 10 digits starting with 6-9
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const handlePhoneChange = text => {
    setPhone(text);
    // Clear error when user starts typing again
    if (phoneError) setPhoneError('');
  };

  const handleSubmit = () => {
    if (!phone) {
      setPhoneError('Phone number is required');
      return;
    }

    if (!validateIndianPhoneNumber(phone)) {
      setPhoneError('Enter valid 10-digit number starting with 6,7,8 or 9');
      return;
    }

    setLoading(true);
    console.log('Valid phone submitted:', phone.replace(/\D/g, ''));

    setTimeout(() => {
      setLoading(false);
      dispatch(toggleHelpCenterModal({show: true}));
    }, 1000);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Back />
        </TouchableOpacity>

        <Text style={styles.heading}>Help Center</Text>
        <Text style={styles.subHead}>Please submit the required details so the team can assist you better.</Text>

        <Text style={styles.fieldName}>Phone Number</Text>
        <View>
          <View style={[styles.textInputContainer, phoneError ? styles.errorInput : null]}>
            <TextInput
              ref={phoneInputRef}
              style={[styles.textInputs, phoneError ? styles.errorTextInput : null]}
              onChangeText={handlePhoneChange}
              onFocus={() => setFocusedInput('phone')}
              onBlur={() => setFocusedInput(null)}
              maxLength={10}
              value={phone}
              keyboardType="phone-pad"
              placeholder="9876543210"
              selectionHandleColor={'#ffa86b'}
              cursorColor={'#1e1e1e'}
              placeholderTextColor="#B2B2B2"
              selectionColor={selectionTwin()}
            />
          </View>
          {focusedInput === 'phone' && (
            <InputOverlay
              isVisible
              style={{
                marginLeft: responsiveWidth(1.06),
                marginTop: nTwins(4.8, 4.8),
              }}
            />
          )}
          {phoneError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{phoneError}</Text>
            </View>
          ) : null}
        </View>

        <AnimatedButton title={'Submit'} onPress={handleSubmit} loading={loading} />
      </View>

      <HelpCenterModal visible={showHelpModal} phone={phone} />
    </SafeAreaView>
  );
};

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
    fontFamily: 'Rubik-Bold',
    color: '#1e1e1e',
    fontSize: 24,
    marginBottom: 8,
  },
  subHead: {
    width: responsiveWidth(90),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    fontSize: 14,
    marginBottom: responsiveHeight(3),
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
    borderColor: '#1e1e1e',
  },
  errorInput: {
    borderColor: '#FF5252',
  },
  textInputs: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    flex: 1,
    height: responsiveHeight(6.65),
    borderRadius: responsiveWidth(3.73),
  },
  errorTextInput: {
    color: '#FF5252',
  },
  errorContainer: {
    marginTop: responsiveWidth(1.5),
    marginLeft: responsiveWidth(1),
    height: responsiveHeight(3),
  },
  errorText: {
    color: '#FF5252',
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Rubik-Regular',
    textAlign: 'right',
  },
});

export default PhoneNumberScreen;
