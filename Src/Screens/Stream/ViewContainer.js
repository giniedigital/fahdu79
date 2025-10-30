import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import DIcon from '../../../DesiginData/DIcons';
import {nTwins, nTwinsFont} from '../../../DesiginData/Utility';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {Image} from 'expo-image'

const ViewContainer = ({views}) => {
  return (
    <View style={{width: responsiveWidth(15), height: 22, borderRadius: responsiveWidth(1.3), borderWidth: responsiveWidth(0.4), borderColor: '#ffffff60', overflow: 'hidden'}}>
      <BlurView intensity={30} tint="light" style={styles.blurContainer}>
        <View style={styles.verifyContainer}>
          <Image cachePolicy="memory-disk" source={require('../../../Assets/Images/viewsEye.png')} contentFit="contain" style={{flex: 1}} />
        </View>
        <Text style={[styles.text]}>{views}</Text>
      </BlurView>
    </View>
  );
};

export default memo(ViewContainer);

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(2.2),
    overflow: 'hidden', // Ensures blur stays within rounded edges
    height: 22,
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveWidth(1.3),
  },
  text: {
    color: '#131313',
    fontSize: nTwinsFont(1.5, 1.5),
    fontFamily: 'Rubik-Medium',
    marginLeft: responsiveWidth(1.5), // Space between icon & text
  },
  verifyContainer: {
    width: 15,
    height: 14.32,
  },
});
