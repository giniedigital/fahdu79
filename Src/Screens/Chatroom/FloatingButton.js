import React from 'react';
import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Image} from 'expo-image'; // or use react-native's Image if needed
import {useDispatch} from 'react-redux';
import {toggleCombineSelectorModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';

const FloatingButton = () => {
  const dispatch = useDispatch();

  return (
    <Pressable
      onPress={() => dispatch(toggleCombineSelectorModal({show: true}))}
      style={({pressed}) => [
        styles.fab,
        {backgroundColor: pressed ? '#FFEDE0' : 'white'}, // change bg when pressed
      ]}>
      <Image source={require('../../../Assets/Images/floatMessage.png')} style={styles.icon} contentFit="contain" />
    </Pressable>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 12,
    zIndex: 1000,
  },
  icon: {
    width: 30,
    height: 30,
  },
});
