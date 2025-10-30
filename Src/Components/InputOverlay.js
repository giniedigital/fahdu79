import React from 'react';
import {StyleSheet, View} from 'react-native';
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {nTwins} from '../../DesiginData/Utility';

const InputOverlay = ({isVisible, style}) => {
  if (!isVisible) return null; // Render nothing if overlay is not visible

  return <View style={[styles.overlay,  style]}></View>;
};

export default InputOverlay;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    borderBottomWidth: responsiveWidth(1.2),
    borderRightWidth: responsiveWidth(1.2),
    borderWidth: 2,
    backgroundColor: 'black',
    borderRadius: responsiveWidth(3.73),
    width: '100%',
    height: responsiveHeight(6.65),
    marginLeft: responsiveWidth(1.06),
    marginTop: nTwins(2.6, 4),
    zIndex: -1,
  },
});
