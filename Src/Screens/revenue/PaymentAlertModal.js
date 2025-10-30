import React from 'react';
import {View, Text, StyleSheet, Linking, Alert, FlatList, Platform} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import AnimatedButton from '../../Components/AnimatedButton';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {Image} from 'expo-image';
import {navigate} from '../../../Navigation/RootNavigation';
import {nTwins} from '../../../DesiginData/Utility';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import { useDispatch } from 'react-redux';
import { togglePaymentAlert } from '../../../Redux/Slices/NormalSlices/HideShowSlice';

const PaymentAlertModal = ({visible}) => {
  console.log(visible, 'VERIFIED MODAL');
  const dispatch = useDispatch()

  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView experimentalBlurMethod intensity={15} style={styles.blurBackground} />
        <Dialog visible={visible} dialogStyle={styles.dialog} contentStyle={{padding: 0, paddingTop: 0, backgroundColor: '#fff'}} onTouchOutside={() => dispatch(togglePaymentAlert({show : false}))}>
          <View style={styles.container}>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Note:</Text> The coins you earn will be available to withdraw after 30 days of receiving it.
            </Text>
          </View>
        </Dialog>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderTopLeftRadius: responsiveWidth(5.33),
    borderTopRightRadius: responsiveWidth(5.33),
    // borderWidth: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
    width: WINDOW_WIDTH,
    // height : WINDOW_HEIGHT,
    height: '20%',
    borderColor: '#1e1e1e',
    position: 'absolute',
    bottom: 0,
    // width : "100%"
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'red',
  },
  container: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#1e1e1e',
    borderRadius: responsiveWidth(3.73),
    padding: responsiveWidth(5.33),
    backgroundColor: '#fff',
  },
  text: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
  },
  boldText: {
    fontFamily: 'Rubik-SemiBold',
    color: '#1e1e1e',
  },
});
export default PaymentAlertModal;
