import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform, Pressable} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {navigate} from '../../../Navigation/RootNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {toggleAreYou} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {FONT_SIZES} from '../../../DesiginData/Utility';
import {useAreYouACreatorNotificationMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';

const AreYou = () => {
  const visible = useSelector(state => state.hideShow.visibility.areYou);

  const dispatch = useDispatch();

  const token = useSelector(state => state.auth.user.token);

  const [areYouACreatorNotification] = useAreYouACreatorNotificationMutation();

  async function isCreator(is) {
    const {data, error} = await areYouACreatorNotification({
      token,
      data: {
        creator: is,
      },
    });

    if (data) {
      console.log(data);
    }

    if (error) {
      console.log(error);
    }
  }

  const handleButtonPress = async what => {
    if (what === 'verificationStepOne') {
      await isCreator('yes');

      navigate('verificationStepOne');
    }

    if (what === 'discover') {
      await isCreator('no');

      navigate('discover');
    }

    dispatch(toggleAreYou({show: false}));
  };

  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />
        <Dialog visible={visible} dialogStyle={styles.dialog} contentStyle={{padding: 0, paddingTop: 0}}>
          <View style={styles.content}>
            <View style={styles.yesNoContainer}>
              <Text style={styles.textYesNo} numberOfLines={1}>
                Are you a "CREATOR" ?
              </Text>

              <View style={styles.buttonContainer}>
                <Pressable onPress={() => handleButtonPress('verificationStepOne')} style={({pressed}) => [styles.button, styles.yesButton, pressed && {backgroundColor: '#FFC399'}]}>
                  <Text style={styles.buttonText}>Yes</Text>
                </Pressable>

                <Pressable onPress={() => handleButtonPress('discover')} style={({pressed}) => [styles.button, styles.noButton, pressed && {backgroundColor: '#FFF3EB'}]}>
                  <Text style={styles.buttonText}>No</Text>
                </Pressable>
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
    width: responsiveWidth(88), // Adjusted for consistency
    height: responsiveWidth(44), // Adjusted for consistency
    borderColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: FONT_SIZES[22], // Adjust font size if needed
    textAlign: 'center',
    color: '#1e1e1e',
    width: '100%', // Ensure the text container takes full width
    flexShrink: 1, // Prevent text from wrapping
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Platform.OS === 'ios' ? 4 : 0,
    width: '100%',
    marginTop: Platform.OS === 'ios' ? 16 : 12,
  },
  button: {
    width: responsiveWidth(34.5), // Adjusted for consistency
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
});

export default AreYou;
