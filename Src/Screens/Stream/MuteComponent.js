import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FONT_SIZES, WIDTH_SIZES } from '../../../DesiginData/Utility';
import { useSelector } from 'react-redux';

const MuteComponent = ({ username = 'User' }) => {

    const details = useSelector(state => state.livechats.data.mute)


    if(details?.isMuted) {
      return (
        <View style={styles.container}>
          <Image source={require('../../../Assets/Images/muteLive.png')} style={styles.icon} />
          <Text style={styles.text}>{details?.displayName || 'User'} is Muted</Text>
        </View>
      );
    } else {
      return null
    }



};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E80',
    padding : WIDTH_SIZES[12],
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: WIDTH_SIZES[20],
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  text: {
    color: '#fff',
    fontSize: FONT_SIZES[14],
    fontFamily: 'Rubik-SemiBold',
    marginLeft: 6,
  },
});

export default MuteComponent;
