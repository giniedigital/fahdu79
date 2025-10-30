import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform, TextInput, Alert} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {useDispatch, useSelector} from 'react-redux';
import {toggleAreYou, togglePostEditModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {FONT_SIZES} from '../../../DesiginData/Utility';
import {useAreYouACreatorNotificationMutation, usePostEditMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {chatRoomSuccess, LoginPageErrors} from '../../Components/ErrorSnacks';
import {editMyPostCaption} from '../../../Redux/Slices/NormalSlices/Posts/MyProfileFeedCacheSlice';
import AnimatedButton from '../../Components/AnimatedButton';

const PostEditModal = () => {
  const {postId, show} = useSelector(state => state.hideShow.visibility.postEdit);
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.user.token);
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);

  const [postEdit] = usePostEditMutation();

  const handleSave = useCallback(async () => {
    console.log(postId);

    if (description.trim() === '') {
      LoginPageErrors('Description Required \nPlease enter a post description.');
      return;
    }

    setLoading(true);

    const {data, error} = await postEdit({token, data: {postId, postContent: description.trim()}});

    console.log(data, error);

    if (error) {
      if (error?.status === 'FETCH_ERROR') {
        LoginPageErrors('Please check your network');
        return;
      }
      LoginPageErrors(error?.data?.message);
      setLoading(false);
    }

    if (data?.data) {
      setDescription('');
      chatRoomSuccess(data?.message);
      dispatch(editMyPostCaption({postId, caption: description.trim()}));
      setLoading(false);
      dispatch(togglePostEditModal({show: false, postId: undefined}));
    }
  }, [postId, description]);

  const handleCancel = () => {
    setDescription('');
    setLoading(false);
    dispatch(togglePostEditModal({show: false, postId: undefined}));
  };

  return (
    show && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />
        <Dialog visible={show} dialogStyle={styles.dialog} contentStyle={{padding: 0, paddingTop: 0}}>
          <View style={styles.content}>
            <View style={styles.yesNoContainer}>
              <Text style={styles.textYesNo} numberOfLines={1}>
                Edit Post Description
              </Text>

              <View style={styles.content}>
                <View>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      value={description}
                      onChangeText={t => setDescription(t)}
                      maxLength={120}
                      selectionColor={'#1e1e1e'}
                      cursorColor={'#1e1e1e'}
                      placeholderTextColor="#B2B2B2"
                      placeholder="Instagram userId"
                      spellCheck={false}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      style={styles.textInputs}
                      multiline
                      textAlignVertical="top"
                    />
                    <Text style={styles.charCounter}>
                      {description.length}/<Text style={{color: '#1e1e1e', fontFamily: 'Rubik-Medium'}}>120</Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                {/* <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.noButton]} onPress={handleCancel}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity> */}

                <View style={{flexBasis: '48%'}}>
                  <AnimatedButton title={'Cancel'} showOverlay={false} style={{backgroundColor: '#fff'}} buttonMargin={0} onPress={handleCancel} />
                </View>

                <View style={{flexBasis: '48%'}}>
                  <AnimatedButton title={'Save'} showOverlay={false} loading={loading} onPress={handleSave} buttonMargin={0} />
                </View>
              </View>
            </View>
          </View>
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
    backgroundColor: '#fff',
    width: responsiveWidth(88),
    height: responsiveWidth(80),
    borderColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
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
  yesNoContainer: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  textYesNo: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: FONT_SIZES['16'],
    textAlign: 'center',
    color: '#1e1e1e',
    width: '100%',
    flexShrink: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Platform.OS === 'ios' ? 12 : 8,
    width: '100%',
    marginTop: Platform.OS === 'ios' ? 16 : 12,
  },
  button: {
    width: responsiveWidth(34.5),
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Platform.OS === 'android' ? 6 : 8,
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
    fontSize: 14,
    color: '#1e1e1e',
  },
  textInputContainer: {
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(4),
    paddingLeft: responsiveWidth(5.33),
    width: '100%',
    marginTop: responsiveWidth(3),
    marginBottom: responsiveWidth(1),
  },
  textInputs: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    flex: 1,
    height: 130,
    borderRadius: responsiveWidth(3.73),
    textAlignVertical: 'top',
    paddingTop: Platform.OS === 'android' ? 0 : 10,
  },
  charCounter: {
    alignSelf: 'flex-end',
    color: '#4D4D4D',
    fontSize: FONT_SIZES['10'],
    fontFamily: 'Rubik-Regular',
    marginRight: responsiveWidth(3),
    marginBottom: responsiveWidth(2),
  },
});

export default PostEditModal;
