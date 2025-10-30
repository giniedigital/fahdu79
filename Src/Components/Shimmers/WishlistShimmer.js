import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, FlatList } from 'react-native';

const WishlistShimmer = () => {
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

  // Render Shimmer Item
  const renderShimmerItem = () => (
    <View style={styles.card}>


      {/* Title Section */}
      <Animated.View style={[styles.title, { opacity: shimmerOpacity }]} />

      {/* Post Content */}
      <Animated.View style={[styles.post, { opacity: shimmerOpacity }]} />

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: shimmerOpacity }]} />
    </View>
  );

  return (
    <FlatList
      data={[1, 2, 3, 4, 5, 6]} // Placeholder data for 3 posts
      renderItem={renderShimmerItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.listContainer}
      // style = {{flex : 1}}
      showsVerticalScrollIndicator = {false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 0, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circle shape
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },
  header: {
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    flex: 1, // Take remaining space
  },
  title: {
    height: 30,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 12,
    width: '100%', // Title is smaller than the full width
  },
  post: {
    height: 250,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  footer: {
    height: 25,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    width: '100%',
  },
});

export default WishlistShimmer;
