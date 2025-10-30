import React from 'react';
import {View, Text, StyleSheet, Linking, Alert} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import Feather from 'react-native-vector-icons/Feather';
import AnimatedButton from '../../Components/AnimatedButton';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {Image} from 'expo-image';
import {toggleEmailVerificationModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {useDispatch} from 'react-redux';
import {openInbox} from 'react-native-email-link';
import {nTwins} from '../../../DesiginData/Utility';

const EmailVerificationModal = ({visible}) => {
  const dispatch = useDispatch();

  const handleMailOpen = async () => {
    // console.log("opening mail")
    // const supported = await Linking.canOpenURL('mailto:');
    // if (supported) {
    //   await Linking.openURL('googlegmail://'); // Open the mail app
    // } else {
    //   Alert.alert('Error', 'No mail app is available on this device.');
    // }
  };

  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />
        <Dialog visible={visible} dialogStyle={styles.dialog} contentStyle={{padding: 0, paddingTop: 0}} onTouchOutside={() => dispatch(toggleEmailVerificationModal({show: false}))}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Image source={require('../../../Assets/Images/EmailVerify.png')} contentFit="contain" style={{flex: 1}} />
            </View>
            <Text style={styles.text}>Check your mail box to {'\n'} verify your registered email!</Text>
            <AnimatedButton title={'Verify Email'} buttonMargin={0} showOverlay={false} onPress={() => openInbox()} style={{height: responsiveHeight(5.91), width: nTwins(72, 77.33), marginTop: 0}} loading={false} />
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
    width: nTwins(88, 92),
    height: nTwins(63.2, 60),
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
    height: 35,
    width: 46.4,
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
});

export default EmailVerificationModal;
