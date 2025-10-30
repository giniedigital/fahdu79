import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';

const UserProfileTrendingShimmer = () => {
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
      ])
    ).start();
  }, [shimmerOpacity]);

  return (
    <View style={styles.card}>
      <View style={styles.headerContainer}>
        <Animated.View style={[styles.profilePic, { opacity: shimmerOpacity }]} />
        <View style={styles.profileInfo}>
          <Animated.View style={[styles.userName, { opacity: shimmerOpacity }]} />
          <Animated.View style={[styles.category, { opacity: shimmerOpacity }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: responsiveWidth(2),
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 6,
    width: '50%',
  },
  category: {
    height: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    width: '40%',
  },
});

export default UserProfileTrendingShimmer;