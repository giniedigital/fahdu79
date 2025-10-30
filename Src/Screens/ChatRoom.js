import {StyleSheet, Text, View, TouchableOpacity, FlatList, StatusBar, Button, Vibration, Linking, ToastAndroid, PermissionsAndroid, AppState, Platform, ActivityIndicator, Alert, BackHandler} from 'react-native';
import {useLayoutEffect, useRef} from 'react';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import ChatRoomAudienceSort from '../Components/ChatRoomAudienceSort';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import DIcon from '../../DesiginData/DIcons';

import {useSelector, useDispatch} from 'react-redux';

import {useGetRoomListQuery, useLazyGetRoomListQuery} from '../../Redux/Slices/QuerySlices/roomListSliceApi';

import {deleteFirst, removeRoomList, setCacheByFilter} from '../../Redux/Slices/NormalSlices/RoomListSlice';

import {audienceFilterMap, chatRoomSortMap, WIDTH_SIZES} from '../../DesiginData/Utility';

// import ChatRoomSortModal from '../Components/ChatRoomSortModal';

import {setDefaultSort} from '../../Redux/Slices/NormalSlices/SortSelectedSlice';

import {token as memoizedToken} from '../../Redux/Slices/NormalSlices/AuthSlice';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';

import {checkNotificationGranted, disp} from '../../Notificaton';
import {userIdCreateSelector} from '../../Redux/Slices/NormalSlices/AuthSlice';

import LinearGradient from 'react-native-linear-gradient';

import {resetCurrentChattingRoom} from '../../Redux/Slices/NormalSlices/MessageSlices/ChatWindowCurrentChattingRoom';
import {resetAllModal, setPostsCardType, toggleFloatingViews, toggleHideShowInformationModal, toggleShowChatRoomSelector} from '../../Redux/Slices/NormalSlices/HideShowSlice';

import {autoLogout} from '../../AutoLogout';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import SwitcherSheet from '../Components/HomeComponents/SwitcherSheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {navigate} from '../../Navigation/RootNavigation';
import {firebase} from '@react-native-firebase/messaging';
import Loader from '../Components/Loader';
import {setDefaultAudience} from '../../Redux/Slices/NormalSlices/AudienceSelectedSlice';
import Verify from '../../Assets/svg/vvv.svg';

import {Image} from 'expo-image';
import NotificationHeader from '../Components/NotificationHeader';
import LabelModal from '../Components/LabelModal';
import {labelColor} from '../../DesiginData/Data';
import {confirmPasswordReset} from '@react-native-firebase/auth';
import LabelEditsModal from '../LabelEditsModal';
import FloatingButton from './Chatroom/FloatingButton';
import CombineSelectorModal from './Chatroom/CombineSelectorModal';
import CustomCheckbox from '../Components/CustomCheckbox';
import {setMassMessageAddToUserList} from '../../Redux/Slices/NormalSlices/MessageSlices/MassMessage';

const getRoomLastChatObject = (array, _id) => {
  //Array == ChatRoomArray,  _id == Each Chat Id

  if (array?.length > 0) {
    const roomIdObjectIndex = array.findIndex(x => x._id === _id);
    return array[roomIdObjectIndex]?.lastMessage;
  } else {
    return [];
  }
};

let monitor = true;

const ChatRoom = () => {
  let x = useRoute();

  const dispatch = useDispatch();

  const [isSkipped, setIsSkipped] = useState(true);

  const [tempDataToList, setTempDataToList] = useState();

  const [notificationAccess, setNotificationAccess] = useState(false);

  const token = useSelector(state => state.auth.user.token);

  const selectedAudinceForFilter = useSelector(state => state.filterBy.selected.audience);

  const currentUserId = useSelector(state => state.auth.user.currentUserId);

  const selectedSortForFilter = useSelector(state => state.sortBy.selected.sort);

  const searchString = useSelector(state => state.chatRoomSearchValue.data.searchString);

  const [getRoomList] = useLazyGetRoomListQuery();

  //ONline Offline

  const [isOnlineFilterEnabled, setIsOnlineFilterEnabled] = useState(false);

  const showSelectorCheckBox = useSelector(state => state.hideShow.visibility.showChatRoomSelector);

  const [isOnline, setIsOnline] = useState(false);

  //pages state

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [tempRoomList, setTempRoomList] = useState([]);

  const [showTempRoomList, setShowTempRoomList] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const {target} = useSelector(state => state.massMessage.data);

  console.log(target.label, '???');

  const visibility = useSelector(state => state.hideShow.visibility.floatingViews);

  const lable = useSelector(state => state.sortBy.selected.label);

  const role = useSelector(state => state.auth.user.role);

  let getNotificationPermission = useCallback(async () => {
    if (Platform.Version >= 33) {
      let x = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

      if (x === 'granted') {
        setNotificationAccess(true);
      } else {
        setNotificationAccess(false);
        massMessageSelectedUsers;
      }
    } else {
      let lowEndDeviceNotificationPermission = await checkNotificationGranted();
      if (lowEndDeviceNotificationPermission) {
        setNotificationAccess(true);
      } else {
        setNotificationAccess(false);
      }
    }
  });

  async function requestUserPermission() {
    const authorizationStatus = await firebase.messaging().requestPermission();

    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }
  }

  const isPermissionFetching = useRef(false);

  const handlerAppStateChange = async nextAppState => {
    if (nextAppState === 'active' && !isPermissionFetching.current) {
      console.log('App has come to the foreground!');
      isPermissionFetching.current = true;
      await getNotificationPermission();
      isPermissionFetching.current = false;
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handlerAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    getNotificationPermission();

    if (Platform.OS === 'ios') {
      requestUserPermission();
    }
  }, []);

  /**
   * @See_in_cache_if_there_is_data_already_present
   * */

  let dataFromCache = useSelector(state => state.roomList.data[audienceFilterMap[selectedAudinceForFilter]]);

  let arrayOfunReadThreadIds = useSelector(state => state?.unReadThread?.unReadRoomIdArr);

  console.log(arrayOfunReadThreadIds, '909090');

  /**
   *
   * TODO -  run whenever any audience filter changes
   *
   * Todo_Learnig - Don't call usequery inside useEffect, running dispatch outside useEffect re-renders entire screen causeing infinite loop
   *
   **/

  const ListEndLoader = () => {
    if ((tempRoomList?.length > 0 || dataFromCache?.length > 0) && totalPages !== currentPage && searchString === '') {
      return <ActivityIndicator size={'large'} color={'#e7e8ea'} />;
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(setDefaultSort());
      dispatch(setDefaultAudience());
      dispatch(toggleHideShowInformationModal({show: false}));
    }, []),
  );

  useEffect(() => {
    setLoading(true);
    setTotalPages(1);
    setCurrentPage(1);
    monitor = true;
    dispatch(removeRoomList());
    setTempRoomList([]);
  }, [audienceFilterMap[selectedAudinceForFilter], chatRoomSortMap[selectedSortForFilter]]);

  console.log('Current page', currentPage, 'Total page', monitor, lable);

  const roomOperations = async () => {
    console.log(lable, 'BALS');
    const {data: roomListResponse, error} = await getRoomList({
      token,
      page: currentPage,
      sortBy: chatRoomSortMap[selectedSortForFilter],
      label: lable,
      filter: audienceFilterMap[selectedAudinceForFilter],
    });

    if (roomListResponse) {
      if (audienceFilterMap[selectedAudinceForFilter] === 'none' && chatRoomSortMap[selectedSortForFilter] === 'recent') {
        setShowTempRoomList(false);

        if (monitor) {
          dispatch(setCacheByFilter({type: 'none', data: [...roomListResponse?.data?.rooms]}));
          monitor = false;
        } else {
          if (dataFromCache?.findIndex(x => x?._id === roomListResponse?.data?.rooms[0]?._id) === -1) {
            dispatch(setCacheByFilter({type: 'none', data: [...dataFromCache, ...roomListResponse?.data?.rooms]}));
          } else {
            // Alert.alert("fuck you")
            console.log('Same same:::::::::::::::::::::');
          }
        }
      } else {
        setShowTempRoomList(true);

        if (monitor) {
          setTempRoomList([...roomListResponse?.data?.rooms]);
          monitor = false;
        } else {
          setTempRoomList([...tempRoomList, ...roomListResponse?.data?.rooms]);
        }
      }
    }

    if (roomListResponse?.data?.metadata) setTotalPages(Number(Math.ceil(Number(roomListResponse?.data?.metadata[0]?.total) / Number(roomListResponse?.data?.metadata[0]?.limit))));
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      roomOperations().then(() => {
        if (isActive) setLoading(false);
      });

      return () => {
        isActive = false; // cleanup if user navigates away before async is done
      };
    }, [selectedSortForFilter, selectedAudinceForFilter, currentPage]),
  );

  // console.log(notificationAccess, "Notification Access");

  const userRole = useSelector(state => state.auth.user.role);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link && link.url === 'https://app.fahdu.com/home?goto=brands') {
          if (userRole === 'creator') {
            dispatch(setPostsCardType({postCardType: 'brand'}));
          } else {
            console.log('Get Verify : ::::::::');

            navigate('verificationStepOne');
          }
        }
      });
  }, [userRole]);

  useEffect(() => {
    const backAction = () => {
      dispatch(toggleShowChatRoomSelector({show: false}));

      dispatch(toggleFloatingViews({show: 'showMessageFloat'}));
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const fetchNextPage = async () => {
    console.log('CAlled**************************************************');

    if (currentPage >= totalPages) {
      console.log('Finish');
      return;
    }

    if (dataFromCache?.length <= 0) return;

    if (totalPages > currentPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getFilteredData = () => {
    return showTempRoomList
      ? tempRoomList?.filter(x => x.recipient?.displayName?.toLowerCase()?.search(searchString?.toLowerCase()) > -1)?.filter(x => (isOnlineFilterEnabled ? (isOnline ? x.onlineStatus === true : x.onlineStatus === false) : true))
      : dataFromCache?.filter(x => x.recipient?.displayName?.toLowerCase()?.search(searchString?.toLowerCase()) > -1)?.filter(x => (isOnlineFilterEnabled ? (isOnline ? x.onlineStatus === true : x.onlineStatus === false) : true));
  };

  useEffect(() => {
    if (showTempRoomList && tempRoomList?.length) {
      const sorted = [...tempRoomList].sort((a, b) => {
        const aHasLabel = a?.label === lable ? 0 : 1;
        const bHasLabel = b?.label === lable ? 0 : 1;
        return aHasLabel - bHasLabel;
      });

      setTempRoomList(sorted);
    }
  }, [lable]);

  const EachChildContainer = props => {
    console.log('PPP', props?.item?.label);

    const simplifiedDataFromApi = useMemo(() => {
      return {
        name: props?.item?.recipient?.displayName,
        chatRoomId: props?.item?._id,
        profileImageUrl: props?.item?.recipient?.profile_image?.url,
        id: props?.item?.recipient?._id,
      };
    }, []);

    let lastMessageObject = getRoomLastChatObject(props.lastChatFromRoomList, simplifiedDataFromApi?.chatRoomId);

    return (
      <>
        <TouchableOpacity
          style={[styles.eachChatContainer, props.index === 0 ? {marginTop: 0} : null]}
          onPress={() => {
            if (!props.showSelectorCheckBox) {
              props.navigation.navigate('Chats', {
                chatRoomId: simplifiedDataFromApi?.chatRoomId,
                name: simplifiedDataFromApi?.name,
                profileImageUrl: simplifiedDataFromApi?.profileImageUrl,
                role: props?.item?.recipient?.role,
                id: simplifiedDataFromApi?.id,
                label: props?.item?.label,
              });
            } else {
              dispatch(setMassMessageAddToUserList({_id: simplifiedDataFromApi?.id}));
            }
          }}>
          <View style={{flexDirection: 'row', gap: responsiveWidth(4)}}>
            <View style={[styles.profileImageWrapper, {position: 'relative'}]}>
              <Image
                placeholderContentFit="cover" // Ensures the placeholder covers the entire area
                placeholder={require('../../Assets/Images/DefaultProfile.jpg')} // Placeholder image
                source={{uri: props.item?.recipient?.profile_image?.url}} // Actual image URL
                contentPosition="center" // Centers the content
                contentFit="cover"
                resizeMethod="resize"
                style={styles.profileImage} // Apply styles
              />
            </View>
            <View style={styles.chatOverViewWrapper}>
              <View style={styles.upperHalf}>
                <View style={{flexDirection: 'row', gap: responsiveWidth(2)}}>
                  <Text style={styles.upperHalfUserNameTitle}>{simplifiedDataFromApi.name}</Text>
                  {props?.item?.recipient?.role === 'creator' ? (
                    <View style={{transform: [{translateX: responsiveWidth(0.1)}, {translateY: responsiveWidth(0.1)}]}}>
                      <Verify />
                    </View>
                  ) : null}
                </View>
                <View style={styles.lowerHalf}>
                  <View style={styles.lowerHalfMessage}>
                    <Text style={styles.messages} numberOfLines={1} ellipsizeMode="tail">
                      {lastMessageObject?.length === 0 ? 'Loading...' : !lastMessageObject?.hasAttachment ? lastMessageObject?.message : lastMessageObject?.senderId === props?.currentUserId ? 'You have sent attachment' : 'You have recieved attachment'}
                    </Text>
                  </View>
                  {props?.arrayOfunReadThreadIds?.length > 0 && <View style={[styles.lowerHalfRest, props?.arrayOfunReadThreadIds.findIndex(x => x === props?.item?._id) === -1 ? {backgroundColor: 'transparent'} : {backgroundColor: '#FF7A5C'}]} />}
                </View>
              </View>
            </View>
          </View>

          {props?.item?.label !== 'none' && <View style={[styles.label, {backgroundColor: labelColor[props?.item?.label]}]} />}

          {props.showSelectorCheckBox && <CustomCheckbox checked={target?.selectedUsers?.includes(simplifiedDataFromApi?.id) || target?.label?.includes(props?.item?.label)} onToggle={() => dispatch(setMassMessageAddToUserList({_id: simplifiedDataFromApi?.id}))} />}
        </TouchableOpacity>
      </>
    );
  };

  return (
    <GestureHandlerRootView style={styles.chatRoomContainer}>
      {/* <ChatRoomSortModal /> */}

      <View style={styles.titleMessageWrapper}>{/* <Text style={styles.titleMessage}>Messages</Text> */}</View>

      {loading ? (
        <Loader />
      ) : (
        <View style={styles.chatlistWrapper}>
          <FlatList
            keyboardDismissMode="on-drag"
            data={getFilteredData()}
            keyExtractor={item => item._id}
            renderItem={({item, index}) => (
              <EachChildContainer showSelectorCheckBox={showSelectorCheckBox} item={item} index={index} navigation={navigation} currentUserId={currentUserId} lastChatFromRoomList={showTempRoomList ? tempRoomList : dataFromCache} arrayOfunReadThreadIds={arrayOfunReadThreadIds} />
            )}
            contentContainerStyle={{
              paddingBottom: responsiveWidth(10),
            }}
            showsVerticalScrollIndicator={false}
            style={{marginBottom: responsiveWidth(1)}}
            ItemSeparatorComponent={() => <View style={{height: 1, borderTopWidth: responsiveWidth(0.3), borderColor: '#E9E9E9'}} />}
            onEndReached={fetchNextPage}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() => <ListEndLoader />}
            ListHeaderComponent={() => !notificationAccess && <NotificationHeader />}
            // ListHeaderComponent={() => <Button title="le permission" color={'orange'} onPress={() => roomOperations()} />}
          />
        </View>
      )}

      <SwitcherSheet />
      <LabelModal setIsOnlineFilterEnabled={setIsOnlineFilterEnabled} isOnlineFilterEnabled={isOnlineFilterEnabled} setIsOnline={setIsOnline} isOnline={isOnline} />
      <LabelEditsModal />

      {visibility === 'showMessageFloat' && role === 'creator' ? <FloatingButton onPress={() => console.log('Floating button pressed')} /> : null}

      <CombineSelectorModal />
    </GestureHandlerRootView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  chatRoomContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopColor: '#282828',
  },

  titleMessageWrapper: {
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveWidth(1),
  },

  chatlistWrapper: {},

  eachChatContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: responsiveWidth(5),
    height: responsiveHeight(7.5),
    gap: 10,
    alignSelf: 'center',
    borderColor: '#282828',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    left: responsiveWidth(0.5),
    marginVertical: responsiveWidth(2),
  },

  profileImageWrapper: {
    borderColor: 'purple',
    borderRadius: responsiveWidth(12),
    position: 'relative',
    borderColor: '#282828',
    resizeMode: 'cover',
    overflow: 'hidden',
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: WIDTH_SIZES[2],
  },

  chatOverViewWrapper: {
    flexBasis: '75%',
    justifyContent: 'space-around',
  },

  profileImage: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0553',
  },

  upperHalfUserNameTitle: {
    color: '#353535',
    fontSize: responsiveFontSize(2),
    // letterSpacing: 0.5,
    // marginTop:responsiveWidth(2),
    fontFamily: 'Rubik-Medium',
  },

  lowerHalf: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexBasis: '100%',
    // backgroundColor: 'red',
    // marginTop:responsiveWidth(4),
  },

  lowerHalfRest: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    aspectRatio: 1,
    width: '4%',
    borderRadius: responsiveWidth(50),
    backgroundColor: 'red',
  },
  lowerHalfText: {
    fontSize: responsiveFontSize(1.4),
    color: 'white',
  },

  lowerHalfMessage: {
    flexBasis: '100%',
    // marginLeft: responsiveWidth(),
    paddingHorizontal: responsiveWidth(2),
    flexDirection: 'row',
    // alignItems: "center",
    // borderWidth : 1,
    // marginTop: responsiveWidth(2),
  },

  messages: {
    // paddingHorizontal: responsiveWidth(0.5),
    fontSize: responsiveFontSize(1.7),
    fontFamily: 'Rubik-Regular',
    flexWrap: 'wrap',
    color: 'black',
    borderRadius: responsiveWidth(2),
    right: responsiveWidth(2),
    // bottom:responsiveWidth(3)
  },

  //Temp Bottom Navigation

  bottomNavigatinContainer: {
    width: '100%',
    padding: responsiveWidth(1),
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  bottomNavigationEachChild: {
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: responsiveWidth(8),
  },

  bottomNavigationText: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Rubik-Bold',
    color: '#282828',
  },
  label: {
    position: 'absolute',
    width: WIDTH_SIZES[36] + WIDTH_SIZES[8],
    height: WIDTH_SIZES[16],
    backgroundColor: 'red',
    alignSelf: 'flex-end',
    right: 0,
    bottom: '-40%',
    borderTopLeftRadius: WIDTH_SIZES[18],
    borderWidth: WIDTH_SIZES[1.5],
    borderColor: '#1e1e1e',
  },
});
