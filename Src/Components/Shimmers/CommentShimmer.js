import React, {useEffect, useRef} from 'react';
import {Animated, View, StyleSheet, FlatList} from 'react-native';
import { useSelector } from 'react-redux';

const CommentShimmer = () => {
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

  const renderShimmerItem = () => (
    <View style={styles.commentContainer}>
      {/* Profile Picture Placeholder */}
      <Animated.View style={[styles.profilePic, {opacity: shimmerOpacity}]} />

      {/* Text Container */}
      <View style={styles.textContainer}>
        {/* Username Placeholder */}
        <Animated.View style={[styles.username, {opacity: shimmerOpacity}]} />
        {/* Comment Text Placeholder */}
        <Animated.View style={[styles.commentText, {opacity: shimmerOpacity}]} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={[1, 2, 3, 4, 5, 6, 7, 8, 9]} // Simulating multiple comments
      renderItem={renderShimmerItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    // width : "100%"
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    width: 150,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 6,
  },
  commentText: {
    width: '95%',
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});

export default CommentShimmer;
