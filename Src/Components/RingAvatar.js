import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import { WIDTH_SIZES } from '../../DesiginData/Utility';


const LIGHT_GRAY = '#F4F4F4';
const DARK_COLOR = '#1e1e1e';

const RingAvatar = ({children, size = 120}) => {
  // Animated values for each ring (0 to 1)
  const animValues = [
    useRef(new Animated.Value(0)).current, // inner
    useRef(new Animated.Value(0)).current, // middle
    useRef(new Animated.Value(0)).current, // outer
  ];

  useEffect(() => {
    let index = 0;

    const animate = () => {
      // Reset all to 0 (light gray)
      animValues.forEach((val) => val.setValue(0));

      // Animate current ring to 1 (dark)
      Animated.timing(animValues[index], {
        toValue: 1,
        duration: 250, // smooth transition duration
        useNativeDriver: false,
      }).start(() => {
        // After animation, move to next ring
        index = (index + 1) % 3;
        setTimeout(animate, 50); // slight delay before next anim
      });
    };

    animate();

    return () => {
      animValues.forEach((val) => val.stopAnimation());
    };
  }, [animValues]);

  // Interpolate border color from animValues
  const interpolateColor = (animValue) =>
    animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [LIGHT_GRAY, DARK_COLOR],
    });

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          borderWidth: WIDTH_SIZES['2'],
          borderColor: interpolateColor(animValues[2]), // outer ring
          padding: 15,
          borderStyle : 'dashed'
        },
      ]}
    >
      <Animated.View
        style={[
          styles.ring,
          {
            borderWidth: WIDTH_SIZES['2'],
            borderColor: interpolateColor(animValues[1]), // middle ring
            padding: 15,
            borderStyle : 'dashed'
          },
        ]}
      >
        <Animated.View
          style={[
            styles.ring,
            {
              borderWidth: WIDTH_SIZES['2'],
              borderColor: interpolateColor(animValues[0]), // inner ring
              padding: 15,
              borderStyle : 'dashed'
            },
          ]}
        >
          <View
            style={[
              styles.avatarContainer,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
              },
            ]}
          >
            {children}
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ring: {
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle : 'dashed'
  },
  avatarContainer: {
    backgroundColor: '#fff9cc',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: WIDTH_SIZES[1.5],
    borderColor: '#1e1e1e',
    
  },
});

export default RingAvatar;
