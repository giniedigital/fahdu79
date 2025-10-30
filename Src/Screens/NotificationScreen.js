import {FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Pressable, RefreshControl} from 'react-native';
import React, {useCallback, useState} from 'react';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {responsiveWidth, responsiveFontSize, responsiveHeight} from 'react-native-responsive-dimensions';
import Moment from 'react-moment';
import {navigate} from '../../Navigation/RootNavigation';
import {ChatWindowError, LoginPageErrors} from '../Components/ErrorSnacks';
import {Image} from 'expo-image';
import {useLazyJoinLiveStreamQuery, useLazyMyPostListQuery} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {WIDTH_SIZES} from '../../DesiginData/Utility';
import NotificationScreenShimmer from '../Components/Shimmers/NotificationScreenShimmer';
import {setFeedCacheMyPost} from '../../Redux/Slices/NormalSlices/Posts/MyProfileFeedCacheSlice';

const NotificationScreen = () => {
  const [joinLiveStream] = useLazyJoinLiveStreamQuery();
  const token = useSelector(state => state.auth.user.token);
  const userRole = useSelector(state => state.auth.user.role);
  const dispatch = useDispatch();

  const [notification, setNotifications] = useState([]);
  const [isNotification, setIsNotification] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [metaData, setMetaData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [refreshing, setRefreshing] = useState(false); // 👈 state for pull-to-refresh

  const suspended = useSelector(state => state.auth.user.suspended);

  const filters = ['All', 'Like', 'Comments', 'liveStream', 'Chats', 'Subscription', 'Calls', 'Wishlist'];
  if (userRole === 'creator') {
    filters.splice(3, 0, 'Payments');
  }

  const FilterNotifications = () => (
    <FlatList
      data={filters}
      keyExtractor={(item, index) => `${item}-${index}`}
      horizontal
      style={{maxHeight: responsiveWidth(14)}}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingVertical: 10, alignItems: 'center'}}
      ItemSeparatorComponent={() => <View style={{width: responsiveWidth(3)}} />}
      renderItem={({item}) => {
        const isActive = selectedFilter === item;
        return (
          <TouchableOpacity
            onPress={() => {
              setSelectedFilter(item);
              setPage(1);
              setHasMore(true);
            }}
            style={[styles.filterButton, isActive ? styles.activeFilterButton : styles.inactiveFilterButton]}>
            <Text style={[styles.filterText, isActive && styles.activeFilterText]}>{item}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );

  const fetchNotifications = async (filter, pageNum = 1, isLoadMore = false) => {
    let myFilter = filter === 'All' ? '' : filter === 'liveStream' ? filter : filter.toLowerCase();

    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const {data} = await axios.get(`https://api.fahdu.in/api/notification/get-notification?filter=${myFilter}&page=${pageNum}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      const newMetadata = data?.data?.metadata[0];
      const newNotifications = data?.data?.notifications || [];

      setMetaData(newMetadata);

      if (isLoadMore) {
        setNotifications(prev => [...prev, ...newNotifications]);
      } else {
        setNotifications(newNotifications);
      }

      setIsNotification(true);
      setHasMore(newMetadata.page * newMetadata.limit < newMetadata.total);
    } catch (e) {
      console.log('Error ', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setNotifications([]);
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchNotifications(selectedFilter, 1, false);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(selectedFilter, 1, false);
    }, [selectedFilter]),
  );

  const loadMoreNotifications = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(selectedFilter, nextPage, true);
    }
  };

  const renderNotificationMessage = item => {
    switch (item.type) {
      case 'like':
        return `liked your post.`;
      case 'comments':
        return `commented on your post.`;
      case 'coins':
        return `tipped ${item?.data?.coin || 1} coins on your post.`;
      case 'liveStream':
        return `is going live!`;
      case 'calls':
        return `called you.`;
      case 'follow':
        return `started following you.`;
      case 'wishlist':
        return item?.title;
      case 'subscription':
        return item?.title || `subscribed to you.`;
      case 'subs':
        return item?.title;
      case 'chats':
        return `sent you a message.`;
      default:
        return item?.title || 'You have a new notification.';
    }
  };

  const [postList] = useLazyMyPostListQuery();

  const handleLinks = async (type, urlOrId, wishlistTitle) => {
    if (suspended) {
      LoginPageErrors('Your account is suspended');
      return;
    }

    if (type === 'liveStream') {
      let roomId = urlOrId.split('/').at(-1);
      const {error, data} = await joinLiveStream({token, roomId});

      if (error?.data?.statusCode === 400) {
        ChatWindowError('Hey!, Livestream has ended');
        return;
      }

      console.log(data?.data);
      navigate('confirmlivestreamjoin', {data: data?.data, roomId});
    } else if (['like', 'comments', 'coins'].includes(type)) {
      const {data: postData} = await postList({token}, false);

      if (postData) {
        let pinnedPost = postData?.data?.pinnedPosts.map(x => ({
          ...x,
          pinned: true,
        }));
        let combined = [...pinnedPost, ...postData?.data?.posts];
        const index = combined.findIndex(item => item._id === urlOrId);
        dispatch(setFeedCacheMyPost({data: combined}));
        navigate('allmyposts', {scrollIndex: index, type, postId: urlOrId});
      }
    } else if (type === 'subscription') {
      navigate('fsPage', {title: 'Subscribed', token, role: 'creator'});
    } else if (type === 'follow') {
      navigate('fsPage', {title: 'Followers', token, role: 'creator'});
    } else if (type === 'wishlist') {
      if (!wishlistTitle?.toLowerCase()?.includes('thank')) {
        navigate('profile', {from: 'notification', wishlistScrollId: urlOrId});
      }
    } else if (type === 'payments') {
      navigate('mrDashboard');
    } else if (type === 'chats') {
      navigate('Chats', {
        chatRoomId: urlOrId?.data?.room_id,
        name: urlOrId?.createdBy?.displayName,
        profileImageUrl: urlOrId?.createdBy?.profile_image?.url,
        role: urlOrId?.data?.role,
        id: urlOrId?.createdBy?._id,
        label: urlOrId?.data?.label,
      });
    } else if (type === 'subs') {
      navigate('fsPage', {title: 'Subscribers', token, role: 'creator'});
    }
  };

  const renderItem = ({item}) => {
    const username = item?.createdBy?.displayName || 'Someone';

    return (
      <Pressable
        style={({pressed}) => [styles.notificationCard, {backgroundColor: pressed ? '#FFA86B1C' : '#fff'}]}
        onPress={() => handleLinks(item?.type, item?.type === 'liveStream' ? item?.data : item?.type === 'wishlist' ? item?.data?.wishlistItem : item?.type === 'chats' ? item : item?.data?.postId, item?.title)}>
        {item.type === 'liveStream' ? (
          <View style={[styles.profileImageWrapper, {marginRight: 10}]}>
            <Image
              source={{uri: item?.createdBy?.profile_image?.url}}
              placeholder={{
                uri: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png',
              }}
              style={styles.profileImage}
              contentFit="cover"
            />
          </View>
        ) : (
          <Image
            source={{uri: item?.createdBy?.profile_image?.url}}
            placeholder={{
              uri: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png',
            }}
            style={styles.profileImageSmall}
            contentFit="cover"
          />
        )}

        <View style={styles.textContainer}>
          <Text style={styles.notificationText}>
            <Text style={styles.usernameText}>{username}</Text>
            <Text style={styles.messageText}>{' ' + renderNotificationMessage(item)}</Text>
          </Text>
          <Moment element={Text} style={styles.timeText} fromNow>
            {item.createdAt}
          </Moment>
        </View>

        {item?.data?.postContent?.file && <Image source={{uri: item?.data?.postContent?.file}} style={styles.thumbnail} contentFit="cover" />}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{paddingLeft: 24, justifyContent: 'center', paddingRight: WIDTH_SIZES['10']}}>
        <FilterNotifications />
      </View>

      {loading && page === 1 ? (
        <NotificationScreenShimmer />
      ) : (
        <FlatList
          data={notification}
          style={{marginTop: 20}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreNotifications}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: WIDTH_SIZES[1.5],
                backgroundColor: '#E9E9E9',
              }}
            />
          )}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" style={{marginVertical: 20}} /> : null}
          refreshControl={
            // 👈 add this
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FFA868']}
              tintColor="#FFA868" // iOS spinner
            />
          }
        />
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  filterButton: {
    height: responsiveHeight(4.5),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: WIDTH_SIZES['14'],
    borderWidth: 1.5,
    borderColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  activeFilterButton: {
    backgroundColor: '#FFA868',
  },

  inactiveFilterButton: {
    backgroundColor: '#fff',
  },

  filterText: {
    fontFamily: 'Rubik-Medium',
    fontSize: 14,
    color: '#1e1e1e',
  },

  activeFilterText: {
    fontFamily: 'Rubik-SemiBold',
  },

  //

  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  timeText: {
    fontSize: responsiveFontSize(1.5),
    color: '#7e7e7e',
    fontFamily: 'Rubik-Regular',
    marginTop: 2,
  },
  thumbnail: {
    height: responsiveWidth(12),
    width: responsiveWidth(12),
    borderRadius: responsiveWidth(2),
    marginLeft: responsiveWidth(3),
    backgroundColor: '#eee',
  },

  profileImageWrapper: {
    borderWidth: 1.8,
    borderColor: '#1e1e1e', // or any color you prefer
    borderStyle: 'dashed',
    borderRadius: 100, // match with image's radius for a circular look
    padding: 5, // optional, to add some spacing between border and image
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  profileImage: {
    height: 49,
    width: 49,
    borderRadius: responsiveWidth(100),
    borderRadius: responsiveWidth(6),
    borderWidth: 1.8,
    borderColor: '#1e1e1e',
    // marginRight : 80
  },

  notificationText: {
    fontSize: 14,
    color: '#1e1e1e', // or any text color
  },

  usernameText: {
    fontFamily: 'Rubik-SemiBold', // or 'Rubik-Medium' if preferred
    color: '#1e1e1e',
  },

  messageText: {
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
  },

  profileImageWrapper: {
    width: 40,
    height: 40,
    overflow: 'hidden',
    borderRadius: 20, // make it circular if needed
  },

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },

  profileImageSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
});
