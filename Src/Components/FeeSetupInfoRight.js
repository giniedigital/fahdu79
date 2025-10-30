import {Pressable, TouchableOpacity, View} from 'react-native';
import React from 'react';

import {Image} from 'expo-image';
import {useDispatch} from 'react-redux';
import {togglePaymentInfo} from '../../Redux/Slices/NormalSlices/HideShowSlice';

const FeeSetupInfoRight = () => {
  const dispatch = useDispatch();

  return (
    <TouchableOpacity style={{height: 17, width: 17}} onPress={() => dispatch(togglePaymentInfo({show: true}))}>
      <Image cachePolicy="memory-disk" source={require('../../Assets/Images/info.png')} contentFit="contain" style={{flex: 1}} />
    </TouchableOpacity>
  );
};

export default FeeSetupInfoRight;
