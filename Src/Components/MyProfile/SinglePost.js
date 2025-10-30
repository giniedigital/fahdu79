import { StyleSheet, FlatList, Platform, View } from "react-native";
import React, { memo, useRef, useState, useCallback } from "react";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import { useSelector } from "react-redux";
import PostCards from "../HomeComponents/PostCards";
import { token as memoizedToken } from "../../../Redux/Slices/NormalSlices/AuthSlice";
import { useFocusEffect } from "@react-navigation/native";
import OtherProfilePostCard from "../NewOtherProfileComponents/OtherProfilePostCard";

const SinglePost = ({ route }) => {
  const homeFlashRef = useRef();

  const userPosts = useSelector((state) => state.profileFeedCache.data.content);
  const token = useSelector(state => state.auth.user.token);

  const SocialPostRender = memo(({ item, index }) => <OtherProfilePostCard item={item} index={index} token={token} />);

  useFocusEffect(
    useCallback(() => {
      
      let wait = new Promise((resolve) => setTimeout(resolve, 300)); // I used this because ref was not accessible directly...

      wait.then(() => {
        if (homeFlashRef.current && typeof homeFlashRef.current.scrollToIndex === "function") {
          homeFlashRef.current.scrollToIndex({
            animated: false,
            index: route?.params?.scrollIndex,
          });
          clearTimeout(wait)
        }
      });
    }, [route?.params?.scrollIndex, homeFlashRef.current])
  );

  return (
    <GestureHandlerRootView style={styles.homeContainer}>
      <FlatList
        ref={homeFlashRef}
        data={userPosts} //Because
        renderItem={({ item, index }) => <SocialPostRender item={item} index={index} />}
        keyExtractor={(item) => item._id}
        // onViewableItemsChanged={({ changed, viewableItems }) => currentShownPost(viewableItems)}
        estimatedItemSize={434}
        showsVerticalScrollIndicator={false}
        // refreshControl={<RefreshControl refreshing={refreshFeed} onRefresh={onRefreshFeed} />}
        onEndReachedThreshold={0.1}
        // onEndReached={fetchNextPage}
        // ListFooterComponent={ListEndLoader}
        renderToHardwareTextureAndroid
        decelerationRate={Platform.OS === "ios" ? "normal" : "fast"}
        // ListHeaderComponent={showStories ? ({ item, index }) => <Stories /> : null}
        // ListHeaderComponent={() => <Button title="helelo" onPress={() => handlePress()} />}
        ItemSeparatorComponent={() => <View style={{borderWidth: responsiveWidth(1), borderColor: '#EEEEEE'}}></View>}
      />
    </GestureHandlerRootView>
  );
};

export default SinglePost;

const styles = StyleSheet.create({

    homeContainer: {
      flex: 1,
      backgroundColor: '#fff',
    },

});
