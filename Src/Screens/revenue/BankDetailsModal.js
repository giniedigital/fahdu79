import React, {useState} from 'react';
import {View, Text, StyleSheet, Linking, Alert, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import AnimatedButton from '../../Components/AnimatedButton';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';

import InputOverlay from '../../Components/InputOverlay';
import {TextInput} from 'react-native-gesture-handler';
import {ChatWindowError, LoginPageErrors} from '../../Components/ErrorSnacks';
import {useSaveBankDetailsMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {useDispatch, useSelector} from 'react-redux';
import {toggleBankDetailsModal, toggleTransferModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';

const BankDetailsModal = ({visible, setFormDetails}) => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [pan, setPan] = useState('');

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // State for errors
  const [errors, setErrors] = useState({
    beneficiaryName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    pan: '',
  });

  const dismissKeyboard = () => Keyboard.dismiss();

  // Validation functions
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      beneficiaryName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      pan: '',
    };

    // Beneficiary Name Validation
    if (!beneficiaryName.trim()) {
      newErrors.beneficiaryName = 'Beneficiary Name is required';
      isValid = false;
    }

    // Account Number Validation
    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account Number is required';
      isValid = false;
    } else if (!/^\d{9,18}$/.test(accountNumber)) {
      newErrors.accountNumber = 'Account Number must be 9-18 digits';
      isValid = false;
    }

    // Confirm Account Number Validation
    if (!confirmAccountNumber.trim()) {
      newErrors.confirmAccountNumber = 'Confirm Account Number is required';
      isValid = false;
    } else if (confirmAccountNumber !== accountNumber) {
      newErrors.confirmAccountNumber = 'Account Numbers do not match';
      isValid = false;
    }

    // IFSC Code Validation
    if (!ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC Code is required';
      isValid = false;
    } else if (!/^[A-Za-z]{4}\d{7}$/.test(ifscCode)) {
      newErrors.ifscCode = 'Invalid IFSC Code';
      isValid = false;
    }

    // PAN Number Validation
    if (!pan.trim()) {
      newErrors.pan = 'PAN Number is required';
      isValid = false;
    } else if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(pan)) {
      newErrors.pan = 'Invalid PAN Number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setFormDetails({
        beneficiaryName: beneficiaryName,
        accountNumber: accountNumber,
        confirmAccountNumber: confirmAccountNumber,
        ifscCode: ifscCode,
        pan: pan,
      });

      dispatch(toggleBankDetailsModal({show: false}));

      setTimeout(() => {
        console.log('oening bank deatilas');
        dispatch(toggleTransferModal({show: true}));
      }, 500);
    } else {
      console.log('Form has errors');
    }
  };

  return (
    visible && (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.overlay}>
          <BlurView experimentalBlurMethod intensity={15} style={styles.blurBackground} />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
            <Dialog visible={visible} dialogStyle={styles.dialog} contentStyle={{padding: 0, paddingTop: 0, backgroundColor: '#fff'}} onTouchOutside={() => dispatch(toggleBankDetailsModal({show: false}))}>
              <ScrollView showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag" keyboardShouldPersistTaps={'always'} automaticallyAdjustKeyboardInsets>
                <Text style={styles.heading}>Bank Details</Text>

                {/* ✅ Beneficiary Name */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Beneficiary Name</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      value={beneficiaryName}
                      onChangeText={setBeneficiaryName}
                      placeholder="Enter your beneficiary name"
                      placeholderTextColor="#B2B2B2"
                      style={styles.textInputs}
                      onFocus={() => setFocusedInput('beneficiaryName')}
                      onBlur={() => setFocusedInput(null)}
                      selectionColor="#1e1e1e"
                      cursorColor="#1e1e1e"
                      autoCapitalize="characters"
                    />
                  </View>
                  {errors.beneficiaryName && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{errors.beneficiaryName}</Text>
                    </View>
                  )}
                </View>

                {/* ✅ Account Number */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Account Number</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      value={accountNumber}
                      onChangeText={setAccountNumber}
                      placeholder="Enter your account number"
                      placeholderTextColor="#B2B2B2"
                      style={styles.textInputs}
                      onFocus={() => setFocusedInput('accountNumber')}
                      onBlur={() => setFocusedInput(null)}
                      selectionColor="#1e1e1e"
                      cursorColor="#1e1e1e"
                      keyboardType="numeric"
                    />
                  </View>
                  {errors.accountNumber && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{errors.accountNumber}</Text>
                    </View>
                  )}
                </View>

                {/* ✅ Confirm Account Number */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Confirm Account Number</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      value={confirmAccountNumber}
                      onChangeText={setConfirmAccountNumber}
                      placeholder="Re-enter your account number"
                      placeholderTextColor="#B2B2B2"
                      style={styles.textInputs}
                      onFocus={() => setFocusedInput('confirmAccountNumber')}
                      onBlur={() => setFocusedInput(null)}
                      selectionColor="#1e1e1e"
                      cursorColor="#1e1e1e"
                      keyboardType="numeric"
                    />
                  </View>
                  {errors.confirmAccountNumber && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{errors.confirmAccountNumber}</Text>
                    </View>
                  )}
                </View>

                {/* ✅ IFSC Code */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>IFSC Code</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      value={ifscCode}
                      onChangeText={setIfscCode}
                      placeholder="Enter IFSC code"
                      placeholderTextColor="#B2B2B2"
                      style={styles.textInputs}
                      onFocus={() => setFocusedInput('ifscCode')}
                      onBlur={() => setFocusedInput(null)}
                      selectionColor="#1e1e1e"
                      cursorColor="#1e1e1e"
                      autoCapitalize="characters"
                    />
                  </View>
                  {errors.ifscCode && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{errors.ifscCode}</Text>
                    </View>
                  )}
                </View>

                {/* ✅ PAN Number */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>PAN Number</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      autoCapitalize="characters"
                      value={pan}
                      onChangeText={setPan}
                      placeholder="Enter PAN number"
                      placeholderTextColor="#B2B2B2"
                      style={styles.textInputs}
                      onFocus={() => setFocusedInput('pan')}
                      onBlur={() => setFocusedInput(null)}
                      selectionColor="#1e1e1e"
                      cursorColor="#1e1e1e"
                    />
                  </View>
                  {errors.pan && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{errors.pan}</Text>
                    </View>
                  )}
                </View>
              </ScrollView>

              <View style={{width: '100%', alignSelf: 'center'}}>
                <AnimatedButton title={'Submit'} buttonMargin={Platform.OS === 'android' ? 5 : 3} onPress={handleSubmit} loading={loading} />
              </View>
            </Dialog>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
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
    backgroundColor: '#fff',
    width: responsiveWidth(92),
    height: '90%',
    borderColor: '#1e1e1e',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: responsiveFontSize(2.46),
    textAlign: 'center',
    lineHeight: responsiveWidth(6.93),
    marginVertical: 16,
    textTransform: 'capitalize',
    color: '#1e1e1e',
    width: responsiveWidth(75),
  },
  iconContainer: {
    height: 45,
    width: 40,
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

  //Input styles
  container: {
    paddingBottom: 20, // Extra space for better layout
  },

  heading: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Rubik-Bold',
    color: '#1e1e1e',
    marginBottom: responsiveWidth(6.4),
  },

  inputWrapper: {
    marginBottom: 12,
  },

  label: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
  },

  textInputContainer: {
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(4),
    paddingLeft: responsiveWidth(5.33),
    width: '100%',
    marginTop: responsiveWidth(1.87),
  },

  textInputs: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    flex: 1,
    height: responsiveWidth(12.8),
    borderRadius: responsiveWidth(3.73),
  },
  errorContainer: {
    flexDirection: 'row',
    borderRadius: responsiveWidth(2),
    // marginLeft: 90,
    alignSelf: 'flex-end',
    marginTop: 6,
    marginRight: 6,
    width: responsiveWidth(52),
    justifyContent: 'flex-end',
  },
  errorText: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.48),
    color: 'red',
    flexShrink: 1,
  },
});

export default BankDetailsModal;
