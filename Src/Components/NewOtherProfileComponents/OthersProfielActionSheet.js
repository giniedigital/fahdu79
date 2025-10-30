// import { StyleSheet, View, TouchableOpacity, Text, Image, Pressable, BackHandler } from "react-native";
// import React, { useMemo, useCallback, useRef, useState, useEffect } from "react";
// import { responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
// import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
// import DIcon from "../../../DesiginData/DIcons";
// import { FlatList } from "react-native-gesture-handler";
// import { homeBottomSheetList, homeBottomSheetListRoleUser, profileActionList } from "../../../DesiginData/Data";
// import LinearGradient from "react-native-linear-gradient";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleOtherProfileActionSheet } from "../../../Redux/Slices/NormalSlices/HideShowSlice";

// import { token as memoizedToken } from "../../../Redux/Slices/NormalSlices/AuthSlice";
// import { LoginPageErrors, chatRoomSuccess } from "../ErrorSnacks";

import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Linking, Alert, TouchableOpacity, Pressable} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import Feather from 'react-native-vector-icons/Feather';
import AnimatedButton from '../../Components/AnimatedButton';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {Image} from 'expo-image';
import {useDispatch, useSelector} from 'react-redux';
import {FONT_SIZES, nTwins, WIDTH_SIZES} from '../../../DesiginData/Utility';
import {chatRoomSuccess, LoginPageErrors} from '../ErrorSnacks';
import {navigate} from '../../../Navigation/RootNavigation';
import {unFollowProfileCache, unSubscribeProfileCache} from '../../../Redux/Slices/NormalSlices/Posts/ProfileFeedCacheSlice';
import {useBlockUserMutation, useUnFollowUserMutation, useUnSubscribeMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {toggleOtherProfileActionModal, toggleRefreshOtherProfile} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {FlatList, TouchableWithoutFeedback} from 'react-native-gesture-handler';

const OthersProfileActionSheet = ({toCallApiInfo}) => {
  const thisUserInfo = useSelector(state => state.otherProfileUserInfo);

  const doSubscribed = useSelector(state => state.hideShow.visibility.otherProfileActionSheet.subscribed);

  console.log(doSubscribed, '_+_+_+_+_+');

  const [profileActionList, setProfileActionList] = useState([
    {
      id: 1,
      title: 'Unfollow',
      provider: 'Feather',
      iconName: 'user-minus',
    },

    {
      id: 4,
      title: 'UnSubscribe',
      provider: 'MaterialIcons',
      iconName: 'unsubscribe',
    },
  ]);

  const loggedInUserRole = useSelector(state => state.auth.user.role);
  const [unFollowUser] = useUnFollowUserMutation();
  const [unSubscribe] = useUnSubscribeMutation();
  const [blockUser] = useBlockUserMutation();

  const dispatcher = useDispatch();

  const token = useSelector(state => state.auth.user.token);

  const visible = useSelector(state => state.hideShow.visibility.otherProfileActionModal);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doSubscribed) {
      setProfileActionList([
        {
          id: 1,
          title: 'Unfollow',
          provider: 'Feather',
          iconName: 'user-minus',
        },
        {
          id: 3,
          title: 'Block user',
          provider: 'Entypo',
          iconName: 'block',
        },
      ]);
    } else {
      setProfileActionList([
        {
          id: 1,
          title: 'Unfollow',
          provider: 'Feather',
          iconName: 'user-minus',
        },
        {
          id: 4,
          title: 'UnSubscribe',
          provider: 'MaterialIcons',
          iconName: 'unsubscribe',
        },
        {
          id: 3,
          title: 'Block user',
          provider: 'Entypo',
          iconName: 'block',
        },
      ]);
    }
  }, [doSubscribed]);

  const handleEachOptions = useCallback(
    async id => {
      console.log(id);

      if (id === 1) {
        let {data, error} = await unFollowUser({token, displayName: toCallApiInfo?.userName});

        if (data) {
          LoginPageErrors(`You have unfollowed ${toCallApiInfo?.userName}`);
          dispatcher(unFollowProfileCache());
          dispatcher(toggleOtherProfileActionModal({show: false}));
        }

        if (error) {
          LoginPageErrors(error?.data?.message);
        }
      }

      if (id === 4) {
        let {data, error} = await unSubscribe({token, data: {displayName: toCallApiInfo?.userName}});

        if (data) {
          LoginPageErrors(`You have unsubscribed ${toCallApiInfo?.userName}`);
          dispatcher(unSubscribeProfileCache());
          dispatcher(toggleOtherProfileActionModal({show: false}));
        }

        if (error) {
          LoginPageErrors(error?.data?.message);
        }
      }

      if (id === 3) {
        let {data, error} = await blockUser({token, data: {id: toCallApiInfo?.userId}});

        console.log(data?.data);

        if (data) {
          dispatcher(toggleOtherProfileActionModal({show: false}));
          chatRoomSuccess('We have blocked the user for you!');
          navigate('home');
        }

        console.log(error);
      }
    },
    [toCallApiInfo, token],
  );

  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} experimentalBlurMethod="dimezisBlurView" onTouchStart={() => dispatcher(toggleOtherProfileActionModal({show: false}))} />

        <Dialog visible={visible} dialogStyle={styles.dialog} contentStyle={{padding: 0, paddingTop: 0}} onTouchOutside={() => dispatcher(toggleOtherProfileActionModal({show: false}))}>
          <FlatList
            data={profileActionList}
            renderItem={({item, index}) => (
              <Pressable onPress={() => handleEachOptions(item.id)} style={({pressed}) => [styles.eachSortModalList, pressed && styles.highlightedOption]}>
                <Text style={styles.eachSortByModalListText}>{item.title}</Text>
              </Pressable>
            )}
            scrollEnabled={false}
          />
        </Dialog>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: responsiveWidth(5.33),
    // borderWidth: 2,
    // borderStyle: 'dashed',
    alignSelf: 'center',
    backgroundColor: '#fff',
    width: nTwins(88, 92),
    height: nTwins(44, 60),
    borderColor: '#1e1e1e',
    marginTop: responsiveWidth(130),
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  stars: {flexDirection: 'row', justifyContent: 'center', marginVertical: WIDTH_SIZES[10], marginBottom: WIDTH_SIZES[18]},

  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: responsiveFontSize(2.46),
    textAlign: 'center',
    lineHeight: responsiveWidth(6.93),
    marginVertical: 16,
    textTransform: 'capitalize',
    color: '#1e1e1e',
    width: responsiveWidth(75),
  },
  iconContainer: {
    height: 35,
    width: 46.4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  headingTitle: {
    fontSize: FONT_SIZES[20],
    fontFamily: 'Rubik-SemiBold',
    color: '#1e1e1e',
    textAlign: 'center',
  },

  eachSortModalList: {
    paddingVertical: responsiveWidth(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightedOption: {
    backgroundColor: '#FFE5DC',
    borderColor: '#FFA86B',
    borderTopWidth: WIDTH_SIZES[1.5],
    borderBottomWidth: WIDTH_SIZES[1.5],
  },
  eachSortByModalListText: {
    fontSize: FONT_SIZES[16],
    fontFamily: 'Rubik-SemiBold',
    color: '#1e1e1e',
  },
});

export default OthersProfileActionSheet;
