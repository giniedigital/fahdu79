import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Button, FlatList, Keyboard, Platform, StyleSheet, ToastAndroid, View} from 'react-native';

import {useGetInitialChatsQuery, useGetLatestChatQuery, useLazyGetInitialChatsQuery, useLazyGetLatestChatQuery, useLazyGetOldChatsQuery, useSetSeenToServerMutation} from '../../Redux/Slices/QuerySlices/roomListSliceApi';

import {responsiveWidth} from 'react-native-responsive-dimensions';
import {LeftChatBubble, RightChatBubble} from '../Components/ChatWindowComponents/ChatWindowElements';

import {useSendMessageMutation} from '../../Redux/Slices/QuerySlices/roomListSliceApi';

import {useSelector, useDispatch} from 'react-redux';
import {userIdCreateSelector} from '../../Redux/Slices/NormalSlices/AuthSlice';

import {deleteCachedMessages, pushSentMessageResponse, saveThread, updateThread} from '../../Redux/Slices/NormalSlices/MessageSlices/ThreadSlices';

import ChatWindowInput from '../Components/ChatWindowComponents/ChatWindowInput';
import ChatWindowClipModal from '../Components/ChatWindowComponents/ChatWindowClipModal';
import ChatWindowPreviewModal from '../Components/ChatWindowComponents/ChatWindowPreviewModal';
import ChatWindowVideoModal from '../Components/ChatWindowComponents/ChatWindowVideoModal';
import {setChatWindowSenderUserDetails} from '../../Redux/Slices/NormalSlices/MessageSlices/ChatWindowSenderDetailSlice';
import ChatWindowPaymentModal from '../Components/ChatWindowComponents/ChatWindowPaymentModal';
import ChatWindowFullSizedImageModal from '../Components/ChatWindowComponents/ChatWindowFullSizedImageModal';
import {setClickedNotification, toggleCallRequestModal, toggleNewMessageRecieved} from '../../Redux/Slices/NormalSlices/HideShowSlice';
import {useFocusEffect, useIsFocused, useRoute} from '@react-navigation/native';
import ChatWindowInformationModal from '../Components/ChatWindowComponents/ChatWindowInformationModal';
import ChatWindowTipModal from '../Components/ChatWindowComponents/ChatWindowTipModal';

import {setCurrentScreen, setsecondUser} from '../../Redux/Slices/NormalSlices/SecondUserSlice';
import {screens} from '../../DesiginData/Data';
import {removeRoomList, updateCacheRoomList} from '../../Redux/Slices/NormalSlices/RoomListSlice';
import {firebase} from '@react-native-firebase/messaging';

//For Logging out user when not authorized via server;
import {authLogout} from '../../Redux/Slices/NormalSlices/AuthSlice';
import {emptyUnreadRoomList, removeRoomIds} from '../../Redux/Slices/NormalSlices/UnReadThreadSlice';
import {saveFeeDetails} from '../../Redux/Slices/NormalSlices/MessageSlices/ChatWindowFeeDetailsSlice';
import {setCurrentChattingRoom} from '../../Redux/Slices/NormalSlices/MessageSlices/ChatWindowCurrentChattingRoom';
import {Text} from 'react-native-svg';
import {ChatWindowError, ChatWindowFollowError} from '../Components/ErrorSnacks';
import {signOutGoogle} from '../../OAuth';
import {useFollowUserMutation, useLazyCallTriesStatusQuery, useUnFollowUserMutation} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {soundObj} from '../../Sound';
import {autoLogout} from '../../AutoLogout';
import MediaLoadingModal from '../Components/ChatWindowComponents/MediaLoadingModal';
import ChatWindowPreviewSheet from '../Components/ChatWindowComponents/ChatWindowPreviewSheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {WIDTH_SIZES} from '../../DesiginData/Utility';
import ChatWindowFeeSetup from '../Components/ChatWindowComponents/ChatWindowFeeSetup';
import ChatWindowLabelModal from '../Components/ChatWindowLabelModal';
import CallMethodSelector from '../Components/ChatWindowComponents/CallMethodSelector';
import CallRequestModal from '../Components/ChatWindowComponents/CallRequestModal';
import CallPricesModal from '../Components/ChatWindowComponents/CallPricesModal';
import TimeRequestModal from '../Components/Calling/TimeRequestModal';

const Loader = () => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <ActivityIndicator color={'#282828'} size={'large'} />
    </View>
  );
};

let timer;

const ChatWindow = ({route, navigation}) => {
  const messageInputRef = useRef(null);

  const flatlistThreadListRef = useRef();

  //!<!--------------States Start>

  const [shouldSkip, setShouldSkip] = useState(true);

  const [loading, setLoading] = useState(false);

  const [fullVideoModalUri, setFullVideoModalUri] = useState(null);

  //!<!-------------States Finish>

  const {chatRoomId, name, profileImageUrl, role, id, label} = route.params.params || route.params;

  const chatThreadFromCache = useSelector(state => state.thread.threadStore[chatRoomId]);

  const token = useSelector(state => state.auth.user.token);

  const currentUserId = useSelector(state => state.auth.user.currentUserId);

  const [setSeenToServer] = useSetSeenToServerMutation();

  const newMessageStatus = useSelector(state => state.hideShow.visibility.newMessageRecieved);

  const [fullSizeImageUrl, setFullSizeImageUri] = useState(undefined);

  const [disableSendButton, setDisableSendButton] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState(false);

  //pagination

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [isMounted, setIsMounted] = useState(false);

  const [followUser] = useFollowUserMutation();

  const [unFollowUser] = useUnFollowUserMutation();

  const [getInitialChats] = useLazyGetInitialChatsQuery();

  const [viewMargin, setViewMargin] = useState(0);

  const [isOldChatsFinished, setIsOldChatsFinished] = useState(false);

  const [callTriesData, setCallTriesData] = useState({});

  const [callTriesStatus] = useLazyCallTriesStatusQuery();

  useFocusEffect(
    useCallback(() => {
      setLoadingMessage(true);
    }, [route, navigation]),
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setsecondUser({role}));
    }, [role]),
  );

  console.log('RoooooomId', chatRoomId);

  useEffect(() => {
    async function fetchCallStatus() {
      const {data, error} = await callTriesStatus({token, roomId: chatRoomId});

      console.log(data, error, 'opopop');

      if (data) {
        console.log('Data', data?.data?.initiator, currentUserId);

        // LOG  Data {"data": {"callTries": 1, "initiatedAt": "2025-06-02T10:31:49.607Z", "initiator": "67fde0e702f40aeb67610439", "type": "VIDEO"}, "message": "Call request found", "statusCode": 200}
        setCallTriesData(data?.data);

        if (data?.data?.callTries > -1 && data?.data?.callTries < 3 && data?.data?.initiator !== currentUserId) {
          dispatch(toggleCallRequestModal({show: true}));
        }
      }

      if (error) {
        console.log('Error', error);
      }
    }

    fetchCallStatus();
  }, [token, chatRoomId]);

  useEffect(() => {
    let showIosKeyboard = Keyboard.addListener('keyboardWillShow', x => {
      setViewMargin(x.endCoordinates.height - responsiveWidth(2));
    });

    let hideIosKeyboard = Keyboard.addListener('keyboardWillHide', x => {
      setViewMargin(0);
    });

    return () => {
      showIosKeyboard.remove();
      hideIosKeyboard.remove();
    };
    ``;
  }, []);

  // !<!---------Use Queries------------>

  const {data: responseDataServerThreads, isSuccess: isSuccessServerThreads, isFetching: isFetchingServerThreads, error: errorServerThreads} = useGetInitialChatsQuery({token, chatRoomId, page: currentPage}, {skip: shouldSkip});

  //todo:-> aut key values jo abhi use nai hue hai wo iss liye rakha hai taaki baad mein use karr saku
  const [trigger, {error: errorLatestMessage}] = useLazyGetLatestChatQuery();

  const [sendMessage] = useSendMessageMutation();

  const arr = Object.assign([]);
  let arr2 = Object.assign([]);

  const onChangeText = useCallback(value => (messageInputRef.current = value), []);
  const onButtonSendButtonClick = useCallback(
    dispatch => {
      console.log(messageInputRef.current);
      ``;

      setDisableSendButton(true);

      const attachment = {
        url: '',
        type: '',
        format: '',
        is_charagble: false,
        charge_amount: 0,
        paid_by_reciever: false,
        preview: '',
      };

      sendMessage({token, message: messageInputRef?.current, roomId: chatRoomId, attachment})
        .then(async e => {
          if (e?.data?.statusCode === 200) {
            setDisableSendButton(false);
            messageInputRef.current = '';
            arr.push(e.data.data);
            dispatch(pushSentMessageResponse({chatRoomId, sentMessageResponse: arr?.shift()}));
            dispatch(updateCacheRoomList({chatRoomId, createdAt: e?.data?.data?.createdAt, message: e?.data?.data?.message, hasAttachment: false, senderId: e?.data?.data?.sender?._id})); //To Sort & Update Chat RoomList
            soundObj.play();
          } else if (e?.error?.data?.status_code === 401) {
            console.log('Status Code not 200');
            autoLogout();
            ChatWindowError('Please Login Again');
            await signOutGoogle();
          } else {
            console.log('Sending message error', e?.error?.data);

            if (e?.error?.data?.message?.search('Follow') >= 0) {
              ChatWindowFollowError(e?.error?.data?.message, followUser, token, name);
            } else if (e?.error?.data?.message?.search('insufficient') >= 0) {
              ChatWindowError('Insufficient Balance');
            } else {
              ChatWindowError("Can't reach server");
            }
            setDisableSendButton(false);
          }
        })
        .catch(e => console.log('There was error while sending message', e));
    },
    [navigation, route],
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentChattingRoom({chatRoomId}));

    dispatch(setChatWindowSenderUserDetails({name: name, profileImageUrl: profileImageUrl, role, id}));
  }, [route, navigation]);

  let __id = chatThreadFromCache?.messages[chatThreadFromCache?.messages?.length - 1]?._id;

  useFocusEffect(
    useCallback(() => {
      //remove unRead From RoomList
      dispatch(removeRoomIds({chatRoomId}));

      if (!chatThreadFromCache) {
        setShouldSkip(false);

        setLoading(true);

        if (isSuccessServerThreads) {
          dispatch(saveThread({chatRoomId, threadDetails: responseDataServerThreads}));
          dispatch(saveFeeDetails({chatRoomId, feeDetails: responseDataServerThreads?.feeDetails}));
          setLoading(false);
        }

        if (errorServerThreads) {
          // console.log(red(`Fetching Error @ChatWindow : LN 91, `), );

          if (errorServerThreads?.data?.status_code === 401) {
            console.log('Fetch chat 401');
            dispatch(authLogout());
            dispatch(deleteCachedMessages());
            dispatch(removeRoomList());
            dispatch(emptyUnreadRoomList());
          }
        }
      } else {
        console.log('elese block');

        async function fetchFreshLatestChats(token, chatRoomId) {
          const {data: responseLatestMessage} = await trigger({token, chatRoomId, _id: __id}, false);

          if (responseLatestMessage?.messages?.length > 0) {
            console.log('There are some message');

            setLoadingMessage(false);

            arr2.push(responseLatestMessage?.messages);

            dispatch(updateThread({chatRoomId, newMessage: arr2.shift()}));

            let latestMessage = responseLatestMessage?.messages?.at(-1);

            dispatch(updateCacheRoomList({chatRoomId, createdAt: latestMessage?.createdAt, message: latestMessage?.message, hasAttachment: latestMessage?.attachment?.url === '' ? false : true, senderId: latestMessage?.sender_id})); //To Sort Chat RoomList

            setSeenToServer({token, roomId: chatRoomId})
              .then(s => console.log('Sent seen to server', s))
              .catch(e => console.log('There was error in setting seen to server', e));
          } else {
            console.log('No new message found !');
            setLoadingMessage(false);
          }
        }

        fetchFreshLatestChats(token, chatRoomId).then(() => setLoading(false));

        if (errorLatestMessage) {
          if (errorLatestMessage?.data?.status_code === 401) {
            dispatch(authLogout());
            dispatch(deleteCachedMessages());
            dispatch(removeRoomList());
            dispatch(emptyUnreadRoomList());
            dispatch(removeRoomList());
            ChatWindowError('Please Login Again');
            signOutGoogle();
          }
        }
      }
    }, [chatThreadFromCache, isFetchingServerThreads, isSuccessServerThreads, errorServerThreads, route, navigation]),
  );

  function fetchFreshLatestChats(token, chatRoomId) {
    trigger({token, chatRoomId, _id: __id}, false)
      .then(responseLatestMessage => {
        console.log(JSON.stringify(responseLatestMessage));

        dispatch(toggleNewMessageRecieved());
        if (responseLatestMessage?.data?.messages?.length > 0) {
          if (responseLatestMessage?.data?.messages[0]._id !== __id) {
            dispatch(updateThread({chatRoomId, newMessage: responseLatestMessage?.data?.messages}));
            let latestMessage = responseLatestMessage?.data?.messages?.at(-1);
            dispatch(updateCacheRoomList({chatRoomId, createdAt: latestMessage?.createdAt, message: latestMessage?.message, hasAttachment: latestMessage?.attachment?.url === '' ? false : true, senderId: responseLatestMessage?.data?.messages[0]?.sender_id})); //To Sort Chat RoomList
          } else console.log('Encountered same.');
        } else {
        }
        setSeenToServer({token, roomId: chatRoomId});
      })
      .catch(e => {
        console.log('Error While fetching latest message', e);
        ChatWindowError(e?.message);
      });
  }

  useEffect(() => {
    if (newMessageStatus === true) {
      fetchFreshLatestChats(token, chatRoomId);
    } else {
      console.log('');
    }
  }, [newMessageStatus, __id, route, navigation]);

  useEffect(() => {
    dispatch(setClickedNotification({click: false}));
  }, [route, navigation]);

  const endReached = useCallback(() => {
    if (chatThreadFromCache?.messages?.length > 2) {
      clearTimeout(timer);

      timer = setTimeout(async () => {
        if (currentPage > totalPages) {
          console.log('Finish');
          setIsOldChatsFinished(true);
          return;
        }

        if (totalPages > currentPage) {
          setCurrentPage(currentPage + 1);
        }

        if (totalPages === 1 && currentPage === 1) {
          setCurrentPage(currentPage + 1);
        }
      }, 1000);
    } else {
      setIsOldChatsFinished(true);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    const getMeOldChats = async () => {
      const {data, error} = await getInitialChats({token, chatRoomId, page: currentPage});

      dispatch(saveThread({chatRoomId, threadDetails: data}));
      dispatch(saveFeeDetails({chatRoomId, feeDetails: data?.feeDetails}));

      if (data) {
        setTotalPages(Number(Math.ceil(Number(data?.metadata[0]?.total) / Number(data?.metadata[0]?.limit))));
      }
    };

    if (!isMounted) {
      setIsMounted(true);
    } else {
      console.log('Calling...');
      getMeOldChats();
    }
  }, [currentPage, chatRoomId, token]);

  return (
    <GestureHandlerRootView style={[styles.wrapper, Platform.OS === 'ios' ? {paddingBottom: viewMargin} : {}]}>
      {/* <ChatWindowPreviewModal chatRoomId={chatRoomId} name = {name}/> */}
      <ChatWindowVideoModal fullVideoModalUri={fullVideoModalUri} />
      <ChatWindowInformationModal chatRoomId={chatRoomId} followUser={followUser} unFollowUser={unFollowUser} role={role} />

      {loading ? (
        <Loader />
      ) : (
        <FlatList
          removeClippedSubviews={false}
          ref={flatlistThreadListRef}
          data={chatThreadFromCache ? [...chatThreadFromCache?.messages]?.reverse() : []}
          renderItem={({item}) => (
            <>
              {currentUserId === item?.sender_id ? (
                <RightChatBubble displayThread={item} setFullVideoModalUri={setFullVideoModalUri} setFullSizeImageUri={setFullSizeImageUri} />
              ) : (
                <LeftChatBubble displayThread={item} setFullVideoModalUri={setFullVideoModalUri} setFullSizeImageUri={setFullSizeImageUri} chatRoomId={chatRoomId} token={token} />
              )}
            </>
          )}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          keyExtractor={item => {
            return item._id;
          }}
          inverted
          ListHeaderComponent={() => (loadingMessage ? <ActivityIndicator color={'red'} size={'small'} /> : null)}
          ListFooterComponent={() => !isOldChatsFinished && <ActivityIndicator size={'large'} color={'#e7e8ea'} />}
          onEndReached={endReached}
          onEndReachedThreshold={0.3}
          keyboardDismissMode="on-drag"
        />
      )}

      <ChatWindowFullSizedImageModal uri={fullSizeImageUrl} />
      <ChatWindowClipModal />
      <ChatWindowTipModal chatRoomId={chatRoomId} />
      <ChatWindowInput onChangeText={onChangeText} onButtonSendButtonClick={() => onButtonSendButtonClick(dispatch)} disableSendButton={disableSendButton} />
      <ChatWindowPaymentModal token={token} chatRoomId={chatRoomId} />
      <MediaLoadingModal />
      <ChatWindowPreviewSheet chatRoomId={chatRoomId} name={name} />
      <ChatWindowFeeSetup />
      <ChatWindowLabelModal roomId={chatRoomId} label={label} />
      <CallMethodSelector />
      {/* <CallRequestModal roomId={chatRoomId} callTriesData={callTriesData} name={name} profileImageUrl={profileImageUrl} /> */}
      {/* <CallPricesModal userId={id} roomId={chatRoomId} /> */}
      {/* <TimeRequestModal /> */}
    </GestureHandlerRootView>
  );
};

export default ChatWindow;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
    borderTopColor: '#282828',
    paddingHorizontal: WIDTH_SIZES[24] - 1.1,
  },
  leftChat: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginVertical: 6,
  },
  rightChat: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 6,
  },
  chatContainerLeft: {
    width: responsiveWidth(70),
    borderWidth: 1,
    padding: 5,
    flexDirection: 'column',
    borderColor: 'red',
  },
  chatContainerRight: {
    width: responsiveWidth(70),
    borderWidth: 1,
    padding: 5,
    flexDirection: 'column',
    borderColor: 'red',
  },
});
