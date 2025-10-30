import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform, TextInput} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {useDispatch, useSelector} from 'react-redux';
import {toggleAreYou, toggleProfileDescriptionModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {FONT_SIZES, selectionTwin, WIDTH_SIZES} from '../../../DesiginData/Utility';
import {useUpdateProfileDescriptionMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {LoginPageErrors} from '../../Components/ErrorSnacks';
import {setAllDescriptions, updateDescription} from '../../../Redux/Slices/NormalSlices/AuthSlice';

const ProfileDescriptionModal = () => {
  const {show, type} = useSelector(state => state.hideShow.visibility.profileDescriptionModal);

  const dispatch = useDispatch();

  const [point1, setPoint1] = useState('');
  const [point2, setPoint2] = useState('');

  const [updateProfileDescription] = useUpdateProfileDescriptionMutation();

  const handleSave = () => {
    console.log('Saved:', point1, point2);
  };

  const handleCancel = () => {
    setPoint1('');
    setPoint2('');
    dispatch(toggleProfileDescriptionModal({type: 'Unknown', show: false}));
  };

  const token = useSelector(state => state.auth.user.token);

  const updateProfileDescriptionHandler = async () => {
    if (!point1.trim() || !point2.trim()) {
      LoginPageErrors('Both fields are required!');
      return;
    }

    //IT can be simplified

    let typeFromBackend;

    switch (type) {
      case 'video':
        typeFromBackend = 'videoCall_info';
        break;
      case 'audio':
        typeFromBackend = 'audioCall_info';
        break;
      case 'chat':
        typeFromBackend = 'chat_info';
        break;
      case 'liveStream':
        typeFromBackend = 'liveStream_info';
        break;
      default:
        typeFromBackend = 'unknown';
    }

    try {
      const response = await updateProfileDescription({
        token,
        data: {
          [typeFromBackend]: [point1.trim(), point2.trim()],
        },
      });

      if (response?.data?.success) {
        if (response.data?.data?.[typeFromBackend]?.length > 0) {
          console.log(response.data?.data?.[typeFromBackend]);

          setPoint1('');
          setPoint2('');

          dispatch(
            updateDescription({
              [typeFromBackend]: response.data?.data?.[typeFromBackend],
            }),
          );

          dispatch(toggleProfileDescriptionModal({type: 'Unknown', show: false}));
        }
      } else {
        LoginPageErrors(response?.error?.data?.message);
      }
    } catch (error) {
      console.error('Error updating profile description:', error);
    }
  };

  return (
    show && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />
        <Dialog visible={show} dialogStyle={styles.dialog} contentStyle={{padding: 0}}>
          <View style={styles.content}>
            <Text style={styles.title}>Edit Perks Of {type?.charAt(0)?.toUpperCase() + type?.slice(1)} Call</Text>

            {/* Point 1 Input */}
            <View style={styles.inputContainer}>
              <TextInput
                value={point1}
                onChangeText={text => {
                  if (text.length <= 40) setPoint1(text);
                }}
                placeholder="Point 1"
                placeholderTextColor="#AFAFAF"
                style={styles.input}
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
              />
              <Text style={styles.charCount}>
                {point1.length}/<Text style={{fontFamily: 'Rubik-Medium'}}>40</Text>
              </Text>
            </View>

            {/* Point 2 Input */}
            <View style={styles.inputContainer}>
              <TextInput
                value={point2}
                onChangeText={text => {
                  if (text.length <= 40) setPoint2(text);
                }}
                placeholder="Point 2"
                selectionColor={selectionTwin()}
                style={styles.input}
                selectionHandleColor={'#ffa86b'}
                cursorColor={'#1e1e1e'}
                placeholderTextColor="#B2B2B2"
              />
              <Text style={styles.charCount}>
                {point2.length}/<Text style={{fontFamily: 'Rubik-Medium'}}>40</Text>
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={updateProfileDescriptionHandler}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
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
    padding: 24,
    backgroundColor: '#fff',
    width: responsiveWidth(88),
    borderColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 34,
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
  content: {
    width: '100%',
  },
  title: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: responsiveFontSize(2.1),
    color: '#1e1e1e',
    marginBottom: 16,
    textAlign: 'left',
  },
  inputContainer: {
    borderWidth: WIDTH_SIZES['1.5'],
    borderColor: '#1e1e1e',
    borderRadius: 14,
    marginBottom: 12,
    paddingHorizontal: 12,
    // paddingVertical: Platform.OS === 'ios' ? 14 : 8,
    height: 56,
    position: 'relative',
  },
  input: {
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
    color: '#1e1e1e',
    borderRadius: WIDTH_SIZES['14'],
    // paddingTop : Platform.OS === "ios" ? 89 : 0
    verticalAlign: 'middle',
    paddingTop: Platform.OS === 'android' ? 14 : 18,
  },
  charCount: {
    position: 'absolute',
    right: 10,
    bottom: Platform.OS === 'android' ? 1 : 5,
    fontSize: 10,
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1E1E1E',
  },
  saveButton: {
    backgroundColor: '#ffa86b',
  },
  cancelButton: {
    backgroundColor: '#fff',
  },
  saveText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14,
    color: '#1e1e1e',
  },
  cancelText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14,
    color: '#1e1e1e',
  },
});

export default ProfileDescriptionModal;
