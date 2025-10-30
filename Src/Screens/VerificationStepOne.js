import {StyleSheet, Text, View, TextInput, Pl, TouchableOpacity, Pressable, FlatList, ActivityIndicator, Platform} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {LoginPageErrors, chatRoomSuccess} from '../Components/ErrorSnacks';
import {useCoverUpdateProfileMutation, useLazyCheckUserNameAvailabilityQuery, useLazyGetNoOnceQuery, useLazyGetUserDocQuery, useLazyInstaVerifyQuery, useLazyUserProfileQuery} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {useDispatch, useSelector} from 'react-redux';
import {autoLogout} from '../../AutoLogout';
import {toggleDateTimePicker, toggleInstagramVerification, toggleIsThisYou, toggleVerificatinInformation} from '../../Redux/Slices/NormalSlices/HideShowSlice';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import DateTimePickerSheet from '../Components/CreatePostComponents/DateTimePickerSheet';
import dayjs from 'dayjs';
import Loader from '../Components/Loader';
import MyProfilePicture from '../Components/MyProfile/MyProfilePicture';
import {nTwins, padios} from '../../DesiginData/Utility';
import useKeyboardHook from '../CustomHooks/useKeyboardHook';
import InputOverlay from '../Components/InputOverlay';
import {Image} from 'expo-image';
import AnimatedButton from '../Components/AnimatedButton';
import GetVerifiedInstagram from './LoginSignup/GetVerifiedInstagram';
import VerifiedModal from '../Components/Verification/VerifiedModal';
import VerificationInformation from '../Components/Verification/VerificationInformation';

const options = ['Health & Wellness', 'Lifestyle', 'Education & Career', 'Business & Finance', 'Technology', 'Culinary', 'Photography & Videography', 'Personal Development', 'Travel', 'Entertainment', 'Astrology'];

const VerificationStepOne = ({route}) => {
  const {isKeyboardVisible, keyboardHeight} = useKeyboardHook();

  const [fullName, setFullName] = useState('');

  const [fahduUserName, setFahduUserName] = useState('');

  const [checkUserNameAvailability] = useLazyCheckUserNameAvailabilityQuery();

  const [availability, setAvailable] = useState(null);
  const [dob, setDob] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [snapchat, setSnapChat] = useState('');
  const [twitter, setTwitter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [agreeModal, setAgreeModal] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);

  const [date, setDate] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    const maxDate = new Date(
      currentDate.getFullYear() - 16, // Subtract 16 years
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    setDate(maxDate);
  }, []);

  const toggleSelection = item => {
    let updatedSelection = [...selectedItems];

    if (updatedSelection.includes(item)) {
      updatedSelection = updatedSelection.filter(selected => selected !== item);
    } else {
      if (updatedSelection.length < 3) {
        updatedSelection.push(item);
      }
    }

    setSelectedItems(updatedSelection);

    // **Close dropdown automatically when 3 items are selected**
    if (updatedSelection.length === 3) {
      setDropdownVisible(false);
    }
  };

  const handleDropdownPress = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Separate Component for Bubble View
  const BubbleView = ({selectedItems, setSelectedItems}) => {
    return (
      <View style={styles.bubbleContainer}>
        {selectedItems.map(item => (
          <View key={item} style={styles.bubble}>
            <Text style={styles.bubbleText}>{item}</Text>
            <Pressable onPress={() => setSelectedItems(prev => prev.filter(i => i !== item))}>
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>
        ))}
      </View>
    );
  };

  const [virified, setVerified] = useState(false);

  const [rejectionReason, setRejectionReason] = useState([]);

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [mounted, setMounted] = useState(false);

  const [userProfile] = useLazyUserProfileQuery({refetchOnFocus: true});

  const [coverUpdateProfile] = useCoverUpdateProfileMutation();

  const [getUserDoc] = useLazyGetUserDocQuery();

  const [instaVerify] = useLazyInstaVerifyQuery();

  const [profileStatus, setProfileStatus] = useState(null);

  const [focusedInput, setFocusedInput] = useState(null);

  const token = useSelector(state => state.auth.user.token);

  const [transferObject, setTransferObject] = useState({});

  const dispatch = useDispatch();

  const {currentUserProfilePicture, currentUserCoverPicture} = useSelector(state => state.auth.user);

  const [showVerifiedModal, setShowVerifiedModal] = useState(false);

  // const showVerifiedModal = useSelector(state => state.hideShow.visibility.appliedVerify);

  React.useEffect(() => {
    async function getSettingProfile() {
      let userDetail = await userProfile({token}, false);

      console.log(userDetail?.data?.data, ':::::::::{{}{}{}{}{}{}{}');

      const data = userDetail?.data?.data;

      const social = userDetail?.data?.data?.socialHandles;

      setDob(data?.DOB);

      setSelected([...userDetail?.data?.data?.niche]);

      setFullName(data?.fullName); //Editable

      if (social?.instagram?.handle?.length > 0) {
        setVerified(true);
      }
      setInstagram(social?.instagram?.handle ? social?.instagram?.handle : '');
    }

    getSettingProfile();

    dispatch(toggleVerificatinInformation());
  }, [token]);

  useEffect(() => {
    setLoading(true);
    async function getUserDocHandler() {
      const {data, error} = await getUserDoc({token});

      console.log(data, '{}{}{}{}');

      if (data) {
        setRejectionReason(data?.data?.rejectionReason);
        setProfileStatus(data?.data?.status);
        setLoading(false);
      }

      if (error) {
        if (error?.status === 'FETCH_ERROR') {
          LoginPageErrors('Please check your network');
          return;
        }

        // console.log(error?.data, "::::")

        if (error?.data?.statusCode !== 400) {
          LoginPageErrors(error?.data?.message);
        } else {
          console.log('Temp Error from backedn');
        }

        setLoading(false);
      }

      if (error?.status === 401) {
        autoLogout();
      }
    }

    getUserDocHandler();
  }, [token]);

  console.log(profileStatus);

  useEffect(() => {
    if (route?.params?.dob) {
      setDob(route?.params?.dob);
    }
  }, [route]);

  useEffect(() => {
    if (mounted) {
      setMounted(false);
    } else {
      setDob(dayjs(date).format('DD-MM-YYYY'));
    }
  }, [date]);

  useEffect(() => {
    if (profileStatus === 'SENT') {
      setShowVerifiedModal(true);
    }
  }, [profileStatus]);

  useEffect(() => {
    if (showVerifiedModal) {
      setAgreeModal(false);
    } else {
      setAgreeModal(true);
    }
  }, [showVerifiedModal]);

  const updateProfileHandler = async () => {
    console.log('full name', fullName);

    if (!fullName.trim()) {
      return LoginPageErrors('Please enter full name');
    }

    if (!fahduUserName.trim()) {
      return LoginPageErrors('Please enter username');
    }

    if (!dob.trim()) {
      return LoginPageErrors('Please enter DOB');
    }

    if (selectedItems.length === 0) {
      return LoginPageErrors('Please select at least one niche');
    }

    const defaultCover = 'https://fahdu-bucket.s3.us-east-1.amazonaws.com/assets/Untitleddesign.jpg';
    const defaultProfile = 'https://fahdu-bucket.s3.us-east-1.amazonaws.com/assets/default-avatar-profile-icon-1.jpg';

    if (currentUserCoverPicture === defaultCover || currentUserProfilePicture === defaultProfile) {
      return LoginPageErrors('Please change your profile and cover pictures');
    }

    try {
      const {data: userNameData, error: userNameError} = await checkUserNameAvailability({token, displayName: fahduUserName});

      console.log(userNameData?.data, '+++++++++++++++++++++++++');

      if (userNameError) {
        return LoginPageErrors('Error checking username availability');
      }

      if (userNameData?.statusCode === 200) {
        if (!userNameData?.data) {
          setAvailable('TAKEN');
        } else {
          setTransferObject({
            fullName,
            fahduUserName,
            dob,
            selectedItems,
          });
          setAvailable(null);
          dispatch(toggleInstagramVerification({show: true}));
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      LoginPageErrors('Something went wrong, please try again later');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <KeyboardAwareScrollView style={styles.chatRoomContainer} contentContainerStyle={{flexGrow: 1}} nestedScrollEnabled={true}>
        <MyProfilePicture isEditable={true} />

        <View style={{width: responsiveWidth(91), alignSelf: 'center'}}>
          <View style={{marginTop: responsiveWidth(8)}}>
            <Text style={styles.titles}>Personal Information</Text>
          </View>
          <View>
            <View style={styles.textInputContainer}>
              <TextInput
                onFocus={() => setFocusedInput('fullName')}
                maxLength={30}
                selectionColor={'#1e1e1e'}
                cursorColor={'#1e1e1e'}
                placeholderTextColor="#B2B2B2"
                placeholder="Full Name"
                spellCheck={false}
                autoCorrect={false}
                autoCapitalize={'sentences'}
                style={styles.textInputs}
                value={fullName}
                onChangeText={t => setFullName(t)}
              />
            </View>
            {focusedInput === 'fullName' && (
              <InputOverlay
                isVisible={isKeyboardVisible}
                style={{
                  marginLeft: responsiveWidth(1.06),
                  marginTop: nTwins(4.8, 4.8),
                }}
              />
            )}
          </View>

          <View>
            <View style={styles.textInputContainer}>
              <TextInput
                maxLength={30}
                selectionColor={'#1e1e1e'}
                cursorColor={'#1e1e1e'}
                placeholderTextColor="#B2B2B2"
                placeholder="Set Fahdu Username"
                onFocus={() => setFocusedInput('fahduUserName')}
                spellCheck={false}
                autoCorrect={false}
                autoCapitalize={'none'}
                style={styles.textInputs}
                onChangeText={t => setFahduUserName(t)}
              />
            </View>
            {focusedInput === 'fahduUserName' && (
              <InputOverlay
                isVisible={isKeyboardVisible}
                style={{
                  marginLeft: responsiveWidth(1.06),
                  marginTop: nTwins(4.8, 4.8),
                }}
              />
            )}
          </View>

          {availability === 'TAKEN' && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>*{'Username not available'}</Text>
            </View>
          )}
        </View>

        <Pressable
          style={{
            borderColor: '#282828',
            borderRadius: responsiveWidth(3),
            width: responsiveWidth(91),
            alignSelf: 'center',
            marginTop: 6,
          }}
          onPress={() => dispatch(toggleDateTimePicker({show: 1}))}>
          <View style={styles.textInputContainer}>
            <TextInput
              pointerEvents="none"
              editable={false}
              selectionColor={'#1e1e1e'}
              cursorColor={'#1e1e1e'}
              placeholderTextColor="#B2B2B2"
              placeholder="Enter Date of Birth"
              spellCheck={false}
              autoCorrect={false}
              autoCapitalize={'sentences'}
              style={[styles.textInputs]}
              value={dob}
            />

            <TouchableOpacity style={styles.calenderContainer}>
              <Image source={require('../../Assets/Images/calenderdob.png')} contentFit="contain" style={{flex: 1}} />
            </TouchableOpacity>
          </View>
        </Pressable>

        <View style={{width: responsiveWidth(91), alignSelf: 'center'}}>
          <Text style={styles.titles}>Select Creator's Niche</Text>
        </View>

        <Pressable
          style={{
            borderColor: '#282828',
            borderRadius: responsiveWidth(3),
            width: responsiveWidth(91),
            alignSelf: 'center',
          }}>
          <View style={styles.textInputContainer}>
            <TextInput
              pointerEvents="none"
              editable={false}
              selectionColor={'#1e1e1e'}
              cursorColor={'#1e1e1e'}
              placeholderTextColor="#474747"
              placeholder="--Select Your Niche--"
              spellCheck={false}
              autoCorrect={false}
              autoCapitalize={'sentences'}
              style={[styles.textInputs, {fontSize: responsiveFontSize(2)}]}
            />
            <TouchableOpacity style={styles.calenderContainer} onPress={() => handleDropdownPress()}>
              {!dropdownVisible ? <Image source={require('../../Assets/Images/VerificationDown.png')} contentFit="contain" style={{flex: 1}} /> : <Image source={require('../../Assets/Images/verificationUp.png')} contentFit="contain" style={{flex: 1}} />}
            </TouchableOpacity>
          </View>
        </Pressable>

        <View style={[styles.nicheContainer, selectedItems.length >= 3 && {borderWidth: 0}]}>
          {selectedItems.length > 2 || !dropdownVisible ? (
            <BubbleView selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
          ) : (
            dropdownVisible &&
            selectedItems.length < 3 && (
              <FlatList
                data={options}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <Pressable style={[styles.item, selectedItems.includes(item) ? styles.selectedItem : styles.defaultItem]} onPress={() => toggleSelection(item)}>
                    <Text style={[styles.text, selectedItems.includes(item) && styles.selectedText]}>{item}</Text>
                  </Pressable>
                )}
                contentContainerStyle={{
                  borderWidth: 1, // ✅ Apply border here
                  overflow: 'hidden',
                  borderRadius: 20,
                }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            )
          )}
        </View>

        <View style={{width: responsiveWidth(91), alignSelf: 'center'}}>
          <AnimatedButton title={'Next'} onPress={() => updateProfileHandler()} />
        </View>

        <View style={{height: responsiveWidth(16)}} />
      </KeyboardAwareScrollView>

      {/* jabb modal open hoga toh verificationiNofrmoation nai dikhna chahiye */}

      {!showVerifiedModal && <VerificationInformation agreeModal={agreeModal} setAgreeModal={setAgreeModal} />}
      <DateTimePickerSheet onScreen={'profileEdit'} date={date} setDate={setDate} type={'dob'} />
      <GetVerifiedInstagram transferObject={transferObject} setShowVerifiedModal={setShowVerifiedModal} />
      <VerifiedModal visible={showVerifiedModal} />
    </GestureHandlerRootView>
  );
};

export default VerificationStepOne;

const styles = StyleSheet.create({
  chatRoomContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 24,
  },
  titles: {
    fontFamily: 'Rubik-SemiBold',
    color: '#282828',
    fontSize: responsiveFontSize(2.1),
    lineHeight: 20,
    // marginVertical : 5
    marginTop: 24,
    // marginBottom : 12
  },

  titleSetPrice: {
    fontSize: responsiveFontSize(1.8),
    // backgroundColor: "#e3dff2",
    height: '90%',
    borderRadius: responsiveWidth(2),
    textAlign: 'center',
    textAlignVertical: 'center',
    // flexBasis: "55%",
    left: responsiveWidth(2),
    fontFamily: 'Rubik-Regular',
    overflow: 'hidden',
    lineHeight: Platform.OS === 'ios' ? 44 : 22,
  },
  propertyTitle: {
    flexDirection: 'row',
  },
  inputStyle: {
    // flex: 1,
    width: responsiveWidth(80),
    height: responsiveWidth(12),
    padding: 0,
    paddingLeft: 5,
    fontFamily: 'Rubik-Regular',
    marginLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(1.5),
    color: '#282828',
    // paddingRight: responsiveWidth(1),
  },
  description: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.8),
    color: '#282828',
    // left: responsiveWidth(5),
  },
  loginButton: {
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#C5FFD2',
    borderRadius: responsiveWidth(4),
    color: '#282828',
    borderBottomWidth: Platform.OS == 'ios' ? null : responsiveWidth(0.7),
    borderRightWidth: Platform.OS == 'ios' ? null : responsiveWidth(0.7),
    borderTopWidth: Platform.OS == 'ios' ? null : responsiveWidth(0.3),
    borderLeftWidth: Platform.OS == 'ios' ? null : responsiveWidth(0.3),
    borderWidth: Platform.OS == 'ios' ? responsiveWidth(0.5) : null,
    right: responsiveWidth(5),
    textAlign: 'center',
    fontFamily: 'Rubik-Medium',
    elevation: 1,
    fontWeight: '600',
    width: responsiveWidth(83),
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
  },
  login: {
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#FFA86B',
    borderRadius: responsiveWidth(4),
    color: '#282828',

    borderBottomWidth: Platform.OS == 'ios' ? null : responsiveWidth(0.7),
    borderRightWidth: Platform.OS == 'ios' ? null : responsiveWidth(0.7),
    borderTopWidth: Platform.OS == 'ios' ? null : responsiveWidth(0.3),
    borderLeftWidth: Platform.OS == 'ios' ? null : responsiveWidth(0.3),
    borderWidth: Platform.OS == 'ios' ? responsiveWidth(0.5) : null,
    right: responsiveWidth(1),
    textAlign: 'center',
    fontFamily: 'Rubik-Medium',
    elevation: 1,
    fontWeight: '600',
    width: responsiveWidth(53),
    height: responsiveWidth(13),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderTopColor: '#282828',
    borderLeftColor: '#282828',
    elevation: 1,
    fontSize: responsiveFontSize(2),
    padding: Platform.OS == 'ios' ? responsiveWidth(3) : responsiveWidth(1),
    overflow: 'hidden',
    marginTop: responsiveWidth(4),
  },
  loginTwo: {
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: 'black',
    top: responsiveWidth(1),
    borderRadius: responsiveWidth(4),
    position: 'absolute',
    width: responsiveWidth(90),
    color: '#282828',
    borderBottomWidth: responsiveWidth(0.7),
    borderRightWidth: responsiveWidth(0.7),
    borderTopWidth: responsiveWidth(0.3),
    borderLeftWidth: responsiveWidth(0.3),
    right: responsiveWidth(1),
    textAlign: 'center',
    fontFamily: 'Rubik-Bold',
    elevation: 1,
    fontWeight: '600',
    width: responsiveWidth(53),
    height: responsiveWidth(13),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderTopColor: '#282828',
    borderLeftColor: '#282828',
    elevation: 1,
    fontSize: responsiveFontSize(2),
    padding: padios(responsiveWidth(2.6)),
    overflow: 'hidden',
    marginTop: responsiveWidth(4),
  },
  rejectionMessage: {
    fontFamily: 'Rubik-Medium',
    paddingLeft: responsiveWidth(3),
    marginVertical: responsiveWidth(1),
    color: '#FF6961',
  },

  textInputContainer: {
    borderWidth: 1.5,
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
  calenderContainer: {
    marginRight: responsiveWidth(4),
    height: 19,
    width: 19,
  },

  nicheContainer: {
    // borderWidth: 1.5,
    borderColor: '#282828',
    marginTop: 4,
    borderRadius: responsiveWidth(4),
    backgroundColor: '#fff',
    width: responsiveWidth(91),
    alignSelf: 'center',
    // maxHeight: 200,
    overflow: 'hidden',
  },
  nicheContainerTwo: {
    borderColor: '#282828',
    marginTop: 4,
    borderRadius: responsiveWidth(4),
    backgroundColor: '#fff',
    width: responsiveWidth(91),
    alignSelf: 'center',
    // maxHeight: 200,
    overflow: 'hidden',
  },

  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    // backgroundColor : 'blue',
    width: '99.9%',
    alignSelf: 'center',
  },
  defaultItem: {
    borderTopColor: '#EAEAEA',
    borderBottomColor: '#EAEAEA',
  },
  selectedItem: {
    borderTopColor: '#FFA86B',
    borderBottomColor: '#FFA86B',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: '#FFF3EB',
  },

  text: {
    fontSize: responsiveFontSize(2.1),
    color: '#1e1e1e',
  },
  selectedText: {
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
  },
  bubbleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows wrapping when width exceeds container
    padding: 8,
    paddingLeft: 0,
    // backgroundColor: 'red',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA86B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 8,
    marginVertical: 4,
    borderWidth: 1.5,
    borderColor: '#1e1e1e',
  },
  bubbleText: {
    color: 'black',
    fontSize: 14,
    marginRight: 6,
    fontFamily: 'Rubik-Medium',
  },
  close: {
    color: '#1e1e1e',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    borderRadius: responsiveWidth(2),
    marginLeft: 90,
    alignSelf: 'flex-end',
    marginTop: 6,
    marginRight: 6,
  },
  errorText: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.48),
    color: 'red',
    flexShrink: 1,
  },
  iconContainer: {
    height: 40,
    width: 35,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
});
