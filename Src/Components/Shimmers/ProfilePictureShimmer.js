import React, {useEffect, useRef} from 'react';
import {Animated, View, StyleSheet} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const ProfilePictureShimmer = () => {
  const shimmerOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmerOpacity]);

  return (
    <View style={styles.container}>
      {/* ✅ Cover Picture Shimmer */}
      <Animated.View style={[styles.coverPicture, {opacity: shimmerOpacity}]} />

      {/* ✅ Profile Picture Shimmer */}

      <Animated.View style={[styles.profilePicture, {opacity: shimmerOpacity}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // borderRadius: 12,
    marginBottom: 16,
    // overflow: 'hidden',
    // alignItems: 'center',
  },
  coverPicture: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  profilePicture: {
    height: responsiveWidth(25),
    width: responsiveWidth(25),
    borderRadius: responsiveWidth(80),
    backgroundColor: '#e0e0e0',
    position: 'absolute',
    bottom: -40,
    borderWidth: 4,
    borderColor: '#fff',
    zIndex: 3,
    left: responsiveWidth(5.6),
  },
  //   profilePictureContainer: {
  //     borderWidth: responsiveWidth(0.5),
  //     height: responsiveWidth(25),
  //     width: responsiveWidth(25),
  //     borderRadius: responsiveWidth(20),
  //     resizeMode: 'contain',
  //     overflow: 'hidden',
  //     position: 'absolute',
  //     left: responsiveWidth(5.6),
  //     top: responsiveWidth(32),
  //     backgroundColor: 'white',
  //     padding: responsiveWidth(0.8),
  //   },
});

export default ProfilePictureShimmer;
