import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {useSelector} from 'react-redux';
import {nTwins} from '../../../DesiginData/Utility';
import {logoutExplicit} from '../../../AutoLogout';
import {Image} from 'expo-image';
import AnimatedButton from '../../Components/AnimatedButton';

const ReLoginModal = () => {
  const visible = useSelector(state => state.hideShow.visibility.relogin);

  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />
        <Dialog visible={visible} dialogStyle={styles.dialog} contentStyle={{padding: 0, paddingTop: 0}}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Image source={require('../../../Assets/Images/info.png')} contentFit="contain" style={{flex: 1}} />
            </View>
            <Text style={styles.text}>Authentication failed {'\n'} kindly login again.</Text>
            <AnimatedButton title={'Ok'} buttonMargin={0} showOverlay={false} onPress={() => logoutExplicit()} style={{height: responsiveHeight(5.91), width: nTwins(72, 74), marginTop: 0}} loading={false} />
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

export default ReLoginModal;
