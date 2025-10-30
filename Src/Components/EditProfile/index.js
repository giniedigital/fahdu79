import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {useUpdateProfileMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {chatRoomSuccess, LoginPageErrors} from '../ErrorSnacks';
import {useDispatch, useSelector} from 'react-redux';
import {navigate} from '../../../Navigation/RootNavigation';
import AnimatedButton from '../AnimatedButton';
import InputOverlay from '../InputOverlay';
import useKeyboardHook from '../../CustomHooks/useKeyboardHook';
import {setAboutUser, setCategoryDescription, setCategoryHeader, setCurrentUserFullName, updateDisplayName, updateEditProfile} from '../../../Redux/Slices/NormalSlices/AuthSlice';
import {nTwins, selectionTwin} from '../../../DesiginData/Utility';

const EditProfiler = ({route, navigation}) => {
  console.log(route?.params?.categoryHeader);

  const token = useSelector(state => state.auth.user.token);

  const [loading, setLoading] = useState(false);

  const [bio, setBio] = useState(route?.params?.bio);
  const [descriptionHeading, setDescriptionHeading] = useState(route?.params?.categoryHeader);
  const [description, setDescription] = useState(route?.params?.categoryDescription);
  const [fullName, setFullName] = useState(route?.params?.fullName);
  const [userName, setUserName] = useState(route?.params?.userName);

  const dispatch = useDispatch();

  const [focusedInput, setFocusedInput] = useState(null);

  const [updateProfile] = useUpdateProfileMutation();

  const characterLimits = {
    bio: 100,
    descriptionHeading: 50,
    description: 500,
  };

  const onSave = () => {
    setLoading(true);

    let data = Object.assign({});

    if (route?.params?.type === 'personal') {
      data = {
        fullName,
        displayName: userName,
      };
    }

    if (route?.params?.type === 'bio') {
      data = {
        aboutUser: bio,
      };
    }

    if (route?.params?.type === 'desc') {
      data = {
        categoryHeader: descriptionHeading,
        categoryDescription: description,
      };
    }

    updateProfile({token, data}).then(e => {
      console.log(e?.error, '::::::');
      if (e?.error?.status === 'FETCH_ERROR') {
        LoginPageErrors('Please check your network');
      } else {
        if (!e?.error) {
          if (e?.data?.statusCode === 200) {
            console.log(e?.data?.data?.displayName, '|||||');

            chatRoomSuccess('Successfully updated your profile!');

            dispatch(
              updateEditProfile({
                currentUserDisplayName: e?.data?.data?.displayName,
                currentUserFullName: e?.data?.data?.fullName,
                aboutUser: e?.data?.data?.aboutUser,
                categoryHeader: e?.data?.data?.categoryHeader,
                categoryDescription: e?.data?.data?.categoryDescription,
              }),
            );

            setLoading(false);

            navigate('editProfile');
          }
        } else {
          if (e?.error?.data?.status_code === 401) {
            autoLogout();
          }
          LoginPageErrors(e?.error?.data?.message);
        }
      }
    });
  };

  const {isKeyboardVisible} = useKeyboardHook();

  return (
    <View style={styles.container}>
      {route?.params?.type === 'personal' && (
        <>
          <Text style={styles.fieldName}>Full Name</Text>
          <View>
            <View style={styles.textInputContainer}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                placeholderTextColor="#B2B2B2"
                placeholder="Enter Your Full Name"
                spellCheck={false}
                autoCorrect={false}
                autoCapitalize={'sentences'}
                style={styles.textInputs}
                onChangeText={t => setFullName(t)}
                value={fullName}
                onFocus={() => setFocusedInput('fullName')}
              />
            </View>
            {focusedInput === 'fullName' && (
              <InputOverlay
                isVisible={isKeyboardVisible}
                style={{
                  marginLeft: responsiveWidth(1.06),
                  marginTop: nTwins(4.4, 4.8),
                }}
              />
            )}
          </View>
          <Text style={styles.fieldName}>Username</Text>
          <View>
            <View style={styles.textInputContainer}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                placeholderTextColor="#B2B2B2"
                placeholder="Enter Your Username"
                spellCheck={false}
                autoCorrect={false}
                autoCapitalize={'sentences'}
                style={styles.textInputs}
                onChangeText={t => setUserName(t)}
                value={userName}
                onFocus={() => setFocusedInput('userName')}
              />
            </View>
            {focusedInput === 'userName' && (
              <InputOverlay
                isVisible={isKeyboardVisible}
                style={{
                  marginLeft: responsiveWidth(1.06),
                  marginTop: nTwins(4.4, 4.8),
                }}
              />
            )}
          </View>
        </>
      )}

      {route?.params?.type === 'bio' && (
        <>
          <View>
            <View style={styles.textInputContainer}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                placeholderTextColor="#B2B2B2"
                placeholder="Enter Bio"
                spellCheck={false}
                autoCorrect={false}
                autoCapitalize={'sentences'}
                style={[styles.textInputs, {height: 129, paddingTop: nTwins(4, 4), paddingRight: responsiveWidth(4)}]}
                onChangeText={t => setBio(t)}
                value={bio}
                multiline
                textAlignVertical="top"
                maxLength={100}
              />
              <Text style={styles.characterCount}>
                {bio?.length}/<Text style={{color: '#1e1e1e'}}>{characterLimits.bio}</Text>
              </Text>
            </View>
            <InputOverlay
              isVisible={isKeyboardVisible}
              style={{
                marginLeft: responsiveWidth(1.06),
                marginTop: nTwins(4.4, 4.8),
                height: 129,
              }}
            />
          </View>
        </>
      )}

      {route?.params?.type === 'desc' && (
        <>
          <Text style={styles.fieldName}>What’s your role?</Text>
          <View>
            <View style={styles.textInputContainer}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                placeholderTextColor="#B2B2B2"
                placeholder="Heading (e.g., Dance Creator)"
                spellCheck={false}
                autoCorrect={false}
                autoCapitalize={'sentences'}
                style={styles.textInputs}
                onChangeText={t => setDescriptionHeading(t)}
                value={descriptionHeading}
                onFocus={() => setFocusedInput('descriptionHeading')}
                maxLength={30}
              />
            </View>
            {focusedInput === 'descriptionHeading' && (
              <InputOverlay
                isVisible={isKeyboardVisible}
                style={{
                  marginLeft: responsiveWidth(1.06),
                  marginTop: nTwins(4.4, 4.8),
                }}
              />
            )}
          </View>
          <Text style={styles.fieldName}>Describe your role</Text>
          <View>
            <View style={styles.textInputContainer}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                placeholderTextColor="#B2B2B2"
                placeholder="Description to show your skills and interests!"
                spellCheck={false}
                autoCorrect={false}
                autoCapitalize={'sentences'}
                style={[styles.textInputs, {height: 205, paddingTop: responsiveWidth(4), paddingRight: responsiveWidth(4)}]}
                onChangeText={t => setDescription(t)}
                multiline
                value={description}
                onFocus={() => setFocusedInput('description')}
                textAlignVertical="top"
                maxLength={500}
              />

              <Text style={styles.characterCount}>
                {description?.length}/<Text style={{color: '#1e1e1e'}}>{characterLimits.description}</Text>
              </Text>
            </View>
            {focusedInput === 'description' && (
              <InputOverlay
                isVisible={isKeyboardVisible}
                style={{
                  marginLeft: responsiveWidth(1.06),
                  marginTop: nTwins(4.4, 4.8),
                  height: 205,
                }}
              />
            )}
          </View>
        </>
      )}

      <AnimatedButton title={'Save'} loading={loading} onPress={() => onSave()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 0,
    backgroundColor: '#fff',
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
    marginTop: 10,
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
    backgroundColor: '#fff',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: '#888',
    alignSelf: 'flex-end',
    marginRight: responsiveWidth(4),
    marginBottom: responsiveWidth(4),
  },
});

export default EditProfiler;
