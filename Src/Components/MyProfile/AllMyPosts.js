import {StyleSheet, FlatList, View, Platform} from 'react-native';
import React, {memo, useRef, useState, useCallback} from 'react';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import MyProfilePostCard from '../PostComponents/MyProfilePostCard';
import PostEditModal from '../../Screens/LoginSignup/PostEditModal';

const AllMyPosts = ({route}) => {
  console.log(route?.params?.type, ':::hola');

  const homeFlashRef = useRef();

  const userPosts = useSelector(state => state.myProfileFeedCache.data.content);


  console.log(userPosts?._id, "::::PPP:::::::")

  const token = useSelector(state => state.auth.user.token);

  const SocialPostRender = memo(({item, index}) => <MyProfilePostCard item={item} index={index} token={token} postId={route?.params?.postId} />);

  useFocusEffect(
    useCallback(() => {
      let wait = new Promise(resolve => setTimeout(resolve, 300)); // I used this because ref was not accessible directly...

      wait.then(() => {
        if (homeFlashRef.current && typeof homeFlashRef.current.scrollToIndex === 'function') {
          homeFlashRef.current.scrollToIndex({
            animated: false,
            index: route?.params?.scrollIndex,
          });
          clearTimeout(wait);
        }
      });
    }, [route?.params?.scrollIndex, homeFlashRef.current]),
  );

  return (
    <GestureHandlerRootView style={styles.homeContainer}>
      <FlatList
        ref={homeFlashRef}
        data={userPosts} //Because
        renderItem={({item, index}) => <SocialPostRender item={item} index={index} />}
        keyExtractor={item => item._id}
        // onViewableItemsChanged={({ changed, viewableItems }) => currentShownPost(viewableItems)}
        estimatedItemSize={434}
        showsVerticalScrollIndicator={false}
        // refreshControl={<RefreshControl refreshing={refreshFeed} onRefresh={onRefreshFeed} />}
        onEndReachedThreshold={0.1}
        // onEndReached={fetchNextPage}
        // ListFooterComponent={ListEndLoader}
        renderToHardwareTextureAndroid
        decelerationRate={Platform.OS === 'ios' ? 'normal' : 'fast'}
        // ListHeaderComponent={showStories ? ({ item, index }) => <Stories /> : null}
        // ListHeaderComponent={() => <Button title="helelo" onPress={() => handlePress()} />}
        ItemSeparatorComponent={() => <View style={{borderWidth: responsiveWidth(1), borderColor: '#EEEEEE'}}></View>}
      />

      <PostEditModal postId={route?.params?.postId}/>
    </GestureHandlerRootView>
  );
};

export default AllMyPosts;

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
