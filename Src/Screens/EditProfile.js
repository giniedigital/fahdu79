import {StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable, ActivityIndicator, Platform} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import MyProfilePicture from '../Components/MyProfile/MyProfilePicture';
import {useLazyUserProfileQuery, useUpdateProfileMutation} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Loader from '../Components/Loader';
import AnimatedButton from '../Components/AnimatedButton';
import {navigate} from '../../Navigation/RootNavigation';
import {nTwins} from '../../DesiginData/Utility';

const regex = /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/;

const PersonalDetailsCard = ({fullName, username, emailAddress}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>Personal Details</Text>
        <TouchableOpacity
          onPress={() =>
            navigate('editprofiler', {
              title: 'Personal Info',
              type: 'personal',
              fullName,
              userName: username,
              emailAddress,
            })
          }>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{fullName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{username}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{emailAddress}</Text>
        </View>
      </View>
    </View>
  );
};

const EditProfile = ({route}) => {
  const [updateProfile] = useUpdateProfileMutation({});

  const [userProfile] = useLazyUserProfileQuery({refetchOnFocus: true});

  const token = useSelector(state => state.auth.user.token);

  const navigation = useNavigation();

  const creatorOrUser = useSelector(state => state.auth.user.role);

  const [bio, setBio] = useState('');

  const [fullName, setFullName] = useState('');

  const [userName, setUserName] = useState('');

  const [emailAddress, setEmailAddress] = useState('');

  const [mounted, setMounted] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [dob, setDob] = useState('');

  const [loading, setLoading] = useState(false);

  const [screenLoading, setScreenLoading] = useState(true);

  const [categoryHeader, setCategoryHeader] = useState('Heading (e.g., Dance Creator)');

  const [categoryDescription, setCategoryDescription] = useState('Add a detailed description to showcase your skills and interests!');

  useFocusEffect(
    useCallback(() => {
      async function getSettingProfile() {
        let userDetail = await userProfile({token}, false);

        const data = userDetail?.data?.data;

        console.log(data, 'User Edit profile Data');

        setBio(data?.aboutUser); //Editable

        setFullName(data?.fullName); //Editable

        setUserName(data?.displayName); //Editable

        setEmailAddress(data?.email);

        setCategoryDescription(data?.categoryDescription);

        setCategoryHeader(data?.categoryHeader);

        setScreenLoading(false);
      }

      getSettingProfile();
    }, []),
  );

  if (screenLoading) {
    return <Loader />;
  }

  const onEdit = componentName => {
    if (componentName === 'description') {
      navigation.navigate('editprofiler', {
        type: 'desc',
        categoryHeader,
        categoryDescription,
        title: 'Description',
      });
    }

    if (componentName === 'bio') {
      navigation.navigate('editprofiler', {
        type: 'bio',
        bio,
        title: 'Bio',
      });
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: '#fff'}}>
      <KeyboardAwareScrollView style={styles.container} keyboardDismissMode="interactive">
        <MyProfilePicture setRefresh={setRefresh} isEditable={true} />

        <PersonalDetailsCard fullName={fullName} username={userName} emailAddress={emailAddress} />

        <View style={styles.detailContainer}>
          {/* Bio Section */}

          <View style={styles.section}>
            <View style={styles.headerRow}>
              <Text style={styles.heading}>Bio</Text>
              <Pressable onPress={() => onEdit('bio')}>
                <Text style={styles.edit}>Edit</Text>
              </Pressable>
            </View>
            <Text style={styles.textContent}>{bio || 'Add a short bio to introduce yourself!'}</Text>
          </View>

          {/* Description Section */}
          {creatorOrUser === 'creator' && (
            <View style={styles.section}>
              <View style={styles.headerRow}>
                <Text style={styles.heading}>Description</Text>
                <Pressable onPress={() => onEdit('description')}>
                  <Text style={styles.edit}>Edit</Text>
                </Pressable>
              </View>
              <Text style={styles.subheading}>{categoryHeader || 'Heading (e.g., Dance Creator)'}</Text>
              <Text style={styles.textContent}>{categoryDescription || 'Add a detailed description to showcase your skills and interests!'}</Text>
            </View>
          )}

          <View style={{padding: 24, paddingTop: 0}}>
            <AnimatedButton title={'View Profile'} buttonMargin={0} onPress={() => navigate('profile')} />
          </View>
        </View>

        {/* <DateTimePickerSheet onScreen={"profileEdit"} date={date} setDate={setDate} type={"dob"} /> */}
      </KeyboardAwareScrollView>
    </GestureHandlerRootView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  detailContainer: {
    // marginTop: 32,
    backgroundColor: '#fff',
    // padding: 24,
  },
  section: {
    // marginBottom: responsiveWidth(1),
    padding: 24,
    borderTopWidth: 6,
    borderColor: '#EDEDED',
    // borderRadius: responsiveWidth(2),
    // backgroundColor: 'red',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: responsiveWidth(2),
  },

  heading: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 18,
    color: '#1e1e1e',
  },
  subheading: {
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    color: '#1e1e1e',
    marginTop: 8,
  },
  editButton: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.8),
    color: '#007AFF',
  },
  textContent: {
    fontFamily: 'Rubik-Regular',
    fontSize: 16,
    color: '#1e1e1e',
    lineHeight: 20,
    marginTop: 8,
  },
  input: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.6),
    color: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: responsiveWidth(1),
    padding: responsiveWidth(2),
    backgroundColor: '#ffffff',
  },
  counter: {
    textAlign: 'right',
    marginTop: responsiveWidth(1),
    fontFamily: 'Rubik-Regular',
    color: '#888',
    fontSize: responsiveFontSize(1.4),
  },

  cardContainer: {
    borderWidth: 1,
  },

  cardContainer: {
    padding: 24,
    marginTop: 32,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth: 1,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Rubik-SemiBold',
    color: '#1e1e1e',
  },
  edit: {
    fontSize: 12,
    color: '#1e1e1e',
    fontFamily: 'Rubik-Regular',
    textDecorationLine: 'underline',
  },
  card: {
    backgroundColor: '#FFF3EB',
    padding: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1e1e1e',
    width: nTwins(89, 98.5),
    height: 137,
    alignSelf: 'center',
    flexDirection: 'column',
    gap: Platform.OS === 'ios' ? 23 : 14,
    marginTop: Platform.OS === 'android' ? 16 : 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#1e1e1e',
    fontFamily: 'Rubik-Regular',
  },
  value: {
    fontSize: 14,
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
  },
});
