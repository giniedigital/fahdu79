import React from 'react';
import {View, Text, StyleSheet, Linking, Alert} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import Feather from 'react-native-vector-icons/Feather';
import AnimatedButton from '../../Components/AnimatedButton';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {Image} from 'expo-image';
import {toggleEmailVerificationModal, togglePaymentInfo} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {useDispatch, useSelector} from 'react-redux';
import {openInbox} from 'react-native-email-link';
import {nTwins} from '../../../DesiginData/Utility';

const InfoModal = () => {
  const dispatch = useDispatch();

  const {paymentInfo} = useSelector(state => state.hideShow.visibility);

  const handler = () => dispatch(togglePaymentInfo({show: false}));

  return (
    paymentInfo && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />
        <Dialog visible={paymentInfo} dialogStyle={styles.dialog} contentStyle={{padding: 0, paddingTop: 0}} onTouchOutside={() => dispatch(togglePaymentInfo({show: false}))}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Image source={require('../../../Assets/Images/info.png')} contentFit="contain" style={{flex: 1}} />
            </View>
            <Text style={styles.text}>Subscriber fee will automatically be{'\n'} set at 50% of the follower fee</Text>
            <AnimatedButton title={'Ok'} buttonMargin={0} showOverlay={false} onPress={() => handler()} style={{height: responsiveHeight(5.91), width: nTwins(72, 74), marginTop: 0}} loading={false} />
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
    height: nTwins(63.2, 57.07),
    borderColor: '#1e1e1e',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Rubik-Medium',
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    lineHeight: responsiveWidth(5.6),
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

export default InfoModal;
