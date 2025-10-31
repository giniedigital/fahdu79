import {
  StyleSheet,
  View,
  Image,
  Text,
  ActivityIndicator,
  Alert,
  Platform,
  Button,
  TouchableOpacity,
} from 'react-native';

import PostCards from '../Components/HomeComponents/PostCards';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import messaging from '@react-native-firebase/messaging';
import {
  FlatList,
  GestureHandlerRootView,
  Pressable,
  RefreshControl,
  TextInput,
} from 'react-native-gesture-handler';
import {token as memoizedToken} from '../../Redux/Slices/NormalSlices/AuthSlice';
import HomeBottomSheet from '../Components/HomeComponents/HomeBottomSheet';
import {
  useCanClearCacheMutation,
  useLazyGetInstagramProfileInfoQuery,
  useLazyGetStoriesQuery,
  useLazyGetUserFeedQuery,
} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {useDispatch, useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import BrandCards from '../Components/HomeComponents/BrandCards';
import BrandBottomSheet from '../Components/HomeComponents/BrandBottomSheet';
import {
  resetAllModal,
  setCurrentVideoPlayId,
  setPostsCardType,
} from '../../Redux/Slices/NormalSlices/HideShowSlice';
import {useFocusEffect, useScrollToTop} from '@react-navigation/native';
import CreatePostBottomSheet from '../Components/HomeComponents/CreatePostBottomSheet';

import SwitcherSheet from '../Components/HomeComponents/SwitcherSheet';
import {navigate} from '../../Navigation/RootNavigation';
import PostTipModal from '../Components/HomeComponents/PostTipModal';
import CreateCommentBottomSheet from '../Components/HomeComponents/CreateCommentBottomSheet';
import PostActionBottomSheet from '../Components/HomeComponents/PostActionBottomSheet';
import Loader from '../Components/Loader';
import {autoLogout} from '../../AutoLogout';
import {Dialog} from 'react-native-simple-dialogs';
import {
  mainpulateFirstPageCreatedAt,
  manipulateCurrentPage,
  manipulateTotalPages,
  resetFeed,
  setFeedCache,
} from '../../Redux/Slices/NormalSlices/Home/FeedCacheSlice';
import DeviceInfo from 'react-native-device-info';
import {
  onDisplayNotification,
  showPostInteractionNotification,
} from '../../Notificaton';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';

import {_filterPostList} from '../../DesiginData/Utility';
import TermsOfLive from './Stream/TermsOfLive';
import {
  pushChats,
  pushGoals,
} from '../../Redux/Slices/NormalSlices/LiveStream/LiveChats';
// import Stories from '../Components/HomeComponents/Stories';
// import {pushLiveStories} from '../../Redux/Slices/NormalSlices/Home/StoriesSlice';
import {confirmPasswordReset, firebase} from '@react-native-firebase/auth';
import UpdateAppComponent from '../Components/HomeComponents/UpdateAppComponent';
import {
  setSharedCampaignId,
  setUserFromCampaignLink,
} from '../../Redux/Slices/NormalSlices/Deeplink/DeeplinkSlice';

import {showMessage, hideMessage} from 'react-native-flash-message';
import BrandSubmitLinkModal from '../Components/Modal/BrandSubmitLinkModal';
import PostShimmer from '../Components/Shimmers/PostShimmer';
import AreYou from './LoginSignup/AreYou';

import RNFS from 'react-native-fs';
import {getVersion} from 'react-native-device-info';
import {resetAll} from '../../Redux/Actions';
import {
  resetCallData,
  setCallData,
} from '../../Redux/Slices/NormalSlices/Call/CallSlice';
import PostProgress from '../PostProgress';
import {resetUploadProgress} from '../../Redux/Slices/NormalSlices/UploadSlice';
import ReLoginModal from './LoginSignup/ReLoginModal';
import CallKeepService from '../../service/CallKeepService';

const PlaceHolder = ({text}) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <Text
        style={{
          fontFamily: 'MabryPro-Regular',
          color: '#282828',
          fontSize: responsiveFontSize(2),
        }}>
        {text}
      </Text>
    </View>
  );
};

let tempRemoteNotificationData;

const Home = () => {
  const token = useSelector(state => state.auth.user.token);

  const homeFlashRef = useRef(null);

  useScrollToTop(
    React.useRef({
      scrollToTop: () =>
        homeFlashRef.current?.scrollToOffset({
          animated: true,
          offset: 0,
        }),
    }),
  );

  const currentUserDetails = useSelector(state => state?.auth?.user);

  const [
    fetchFeedData,
    {isLoading: isUserFeedFetching, isSuccess: isUserFeedSuccess},
  ] = useLazyGetUserFeedQuery();

  // const [getStories] = useLazyGetStoriesQuery();

  const [getInstagramProfileInfo] = useLazyGetInstagramProfileInfoQuery();

  const postCardType = useSelector(
    state => state.hideShow.visibility.postCardType,
  );

  const [campaignArray, setCampaignArray] = useState([]);

  const [removePostId, setRemovePostId] = useState(undefined);

  const [refreshing, setRefreshing] = useState(false);

  const [refreshFeed, setRefreshFeed] = useState(false);

  const [feedData, setFeedData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // const [showStories, setShowStories] = useState(false);

  const dispatch = useDispatch();

  const [pages, setPages] = useState(1);

  const [mainLoading, setMainLoading] = useState(true);

  const {
    content: cachedFeed,
    blockedPost: blockedPostArr,
    totalPages,
    currentPage,
    firstPostCreatedAt,
  } = useSelector(state => state.feedCache.data);

  const [canClearCache] = useCanClearCacheMutation();

  const callData = useSelector(state => state.call.data);

  const suspension = useSelector(state => state.auth.user.suspended);

  console.log('Calldata', callData);

  async function shouldClearCache() {
    const androidVersion =
      Platform.OS === 'android' ? DeviceInfo.getSystemVersion() : null;
    const iosVersion =
      Platform.OS === 'ios' ? DeviceInfo.getSystemVersion() : null;
    const {data, error} = await canClearCache({
      token,
      data: {
        user_id: currentUserDetails?.currentUserId,
        android_version: androidVersion,
        ios_version: iosVersion,
      },
    });

    if (data?.data?.clearcache) {
      dispatch(resetAllModal());
      dispatch(resetAll());
    }
  }

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        console.log(
          callData?.showCallScreen,
          callData?.fromNotification,
          ':::::yellowhouse',
        );

        if (
          callData?.showCallScreen === true &&
          callData?.fromNotification === true
        ) {
          Alert.alert('yaha se');
          navigate('incomingCall');
        }
      }, 500);
    }, [callData]),
  );

  useEffect(() => {
    shouldClearCache();
  }, []);

  useEffect(() => {
    if (currentUserDetails?.onlyBrandsAccess) {
      dispatch(setPostsCardType({postCardType: 'brand'}));
    }
  }, [currentUserDetails.onlyBrandsAccess]);

  //Notification opens app in background, once index.js mounts, it won't work later but inside background hanlder will work

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('iOS working find...');

    let remoteNotificationData = JSON.parse(remoteMessage.data.payload);

    if (remoteNotificationData?.type === 'message') {
      tempRemoteNotificationData = remoteNotificationData;
      await onDisplayNotification(remoteNotificationData?.content);
    } else {
      await showPostInteractionNotification(remoteNotificationData);
    }
  });

  //Update states

  const SocialPostRender = memo(({item, index}) => (
    <PostCards item={item} index={index} token={token} />
  ));

  const brandPostRender = ({item, index}) => <BrandCards item={item} />;

  // useEffect(() => {
  //   const fethBrandPostList = async () => {
  //     const {data: responseBrandList} = await trigger({token, page: 1}, false);

  //     console.log(responseBrandList, '{}+}{{}{}{}{}{}{}{}{}{}{}');

  //     if (responseBrandList?.data?.length > 0) {
  //       setCampaignArray(responseBrandList?.data);
  //       setRefreshing(false);
  //     }
  //   };

  //   fethBrandPostList();
  // }, [refreshing]);

  const userRole = useSelector(state => state.auth.user.role);

  console.log(token);

  useFocusEffect(
    useCallback(() => {
      console.log('Fetcing');
      const fetchFeeds = async () => {
        setIsLoading(true);

        const {data: responseFeed, error} = await fetchFeedData({
          token,
          page: currentPage,
          timestamp: currentPage === 1 ? '' : firstPostCreatedAt,
        });

        console.log(error?.data, ':::::::::', error?.data);

        if (error?.data?.status_code === 401) {
          console.log('Before logout', error?.data);

          autoLogout();
        }

        dispatch(
          mainpulateFirstPageCreatedAt({
            timestamp: responseFeed?.data?.posts[0]?.createdAt,
          }),
        );

        if (responseFeed) {
          setIsLoading(false);
          setRefreshFeed(false);

          dispatch(
            manipulateTotalPages({
              currentTotalPage: Number(
                Math.ceil(
                  Number(responseFeed?.data?.metadata[0]?.total) /
                    Number(responseFeed?.data?.metadata[0]?.limit),
                ),
              ),
            }),
          );

          if (responseFeed?.data?.posts?.length > 0) {
            if (
              cachedFeed.findIndex(
                x => x._id === responseFeed?.data?.posts[0]?._id,
              ) === -1
            ) {
              dispatch(
                setFeedCache({
                  data: [...cachedFeed, ...responseFeed?.data?.posts],
                }),
              );
            } else {
              console.log('Duplicate');
            }
          }
        }
      };

      fetchFeeds().then(() => {
        setMainLoading(false);
      });
    }, [refreshFeed, currentPage, token]),
  );

  //Just to remove homeBottomSheet
  useEffect(() => {
    dispatch(resetAllModal());
    dispatch(resetUploadProgress());
  }, []);

  useEffect(() => {
    let index = campaignArray?.findIndex(x => x?._id === removePostId);

    if (index !== -1) {
      let tempArr = [...campaignArray];

      tempArr?.splice(index, 1);

      setCampaignArray(tempArr);
    }
  }, [removePostId]);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetAllModal());
    }, []),
  );

  const onRefresh = () => {
    console.log('Refresh');
    setRefreshing(true);
  };

  const onRefreshFeed = () => {
    dispatch(resetFeed());
    dispatch(manipulateCurrentPage({currentPage: 1}));
    dispatch(manipulateTotalPages({currentTotalPage: 0}));
    setRefreshFeed(true);
  };

  const handleCall = () => {
    console.log('xxx');
    CallKeepService.showIncomingCall('user_12345', 'Rishabh');
  };
  useEffect(() => {
    console.log('USEREMEMMEMEMEM CALLELD DFIFDFJP{{}{}{}');

    async function configureRevenueCat() {
      console.log(
        '🛠️ Setting up RevenueCat',
        currentUserDetails?.currentUserId,
      );

      Purchases.setLogLevel(LOG_LEVEL.ERROR);

      if (Platform.OS === 'ios') {
        try {
          // Step 1: Always log out first to clear Anonymous ID

          if (!currentUserDetails?.currentUserId) return;

          Purchases.configure({
            apiKey: 'appl_jdVBoXcPlFOOtSRgdOySIPRyiIt',
            appUserID: String(currentUserDetails?.currentUserId),
          });

          const customerInfo = await Purchases.getCustomerInfo();
          console.log('✅ User Logged In:', customerInfo.originalAppUserId);
          console.log('📜 Full Customer Info:', customerInfo);

          const result = await Purchases.logIn(
            String(currentUserDetails?.currentUserId),
          );
          console.log('✅ Logged In:', result.customerInfo.originalAppUserId);
        } catch (error) {
          console.error('❌ RevenueCat configuration failed:', error);
        }
      } else {
        console.log('⚠️ RevenueCat setup skipped (not iOS)');
      }
    }

    configureRevenueCat();
  }, [currentUserDetails?.currentUserId]);

  const currentShownPost = useCallback(post => {
    if (post[0]?.isViewable) {
      dispatch(setCurrentVideoPlayId({currentVideoId: post[0]?.item?._id}));
    }
  }, []);

  const showMeSuspension = () => {
    console.log('clalign');
    console.log(suspension);
  };

  const ListEndLoader = () => {
    if (!isLoading && cachedFeed?.length !== 0) {
      return (
        <Text
          style={{
            fontFamily: 'MabryPro-Bold',
            color: '#282828',
            textAlign: 'center',
          }}>
          You're all caught up!
        </Text>
      );
    } else {
      return <ActivityIndicator size={'large'} color={'#e7e8ea'} />;
    }
  };

  const fetchNextPage = async () => {
    if (cachedFeed?.length <= 0) return;

    if (currentPage >= totalPages) return;

    dispatch(manipulateCurrentPage({currentPage: currentPage + 1}));
  };

  if (mainLoading || refreshFeed) {
    return <PostShimmer />;
  }

  // console.log(cachedFeed[0])

  if (postCardType === 'normal') {
    return (
      <GestureHandlerRootView style={styles.homeContainer}>
        <FlashList
          ref={homeFlashRef}
          data={_filterPostList([...cachedFeed], [...blockedPostArr])} //Because
          renderItem={({item, index}) => (
            <SocialPostRender item={item} index={index} />
          )}
          keyExtractor={item => item._id}
          onViewableItemsChanged={({changed, viewableItems}) =>
            currentShownPost(viewableItems)
          }
          estimatedItemSize={434}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshFeed}
              onRefresh={onRefreshFeed}
            />
          }
          onEndReachedThreshold={0.1}
          onEndReached={fetchNextPage}
          ListFooterComponent={ListEndLoader}
          renderToHardwareTextureAndroid
          decelerationRate={Platform.OS === 'ios' ? 'normal' : 'fast'}
          ItemSeparatorComponent={() => (
            <View style={{backgroundColor: '#E9E9E9', height: 4}} />
          )}
          // ListHeaderComponent={() => <PostProgress />}
          ListHeaderComponent={() => (
            <Button title="Dummy Cal" onPress={() => handleCall()} />
          )}
        />

        <CreatePostBottomSheet />
        <SwitcherSheet />
        <PostTipModal />
        <HomeBottomSheet currentUserDetails={currentUserDetails} />
        <CreateCommentBottomSheet />
        <PostActionBottomSheet />
        <TermsOfLive />
        {currentUserDetails?.role !== 'creator' && <AreYou />}
      </GestureHandlerRootView>
    );
  } else {
    return (
      <GestureHandlerRootView style={styles.homeContainer}>
        {campaignArray?.length > 0 && userRole === 'creator' ? (
          <FlatList
            data={campaignArray}
            renderItem={brandPostRender}
            keyExtractor={item => item._id}
            estimatedItemSize={600}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <PlaceHolder text={'No brand collaborations yet.'} />
        )}
        <BrandBottomSheet setRemovePostId={setRemovePostId} />
        <SwitcherSheet />
        <BrandSubmitLinkModal />
      </GestureHandlerRootView>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopColor: '#282828',
  },
});
