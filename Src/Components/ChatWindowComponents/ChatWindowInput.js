import {StyleSheet, View, TextInput, TouchableOpacity, Keyboard, ActivityIndicator, Platform, Linking, Pressable, Text, Touchable} from 'react-native';
import DIcon from '../../../DesiginData/DIcons';
import React, {useEffect, useState, useCallback, useLayoutEffect} from 'react';

import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {toggleCallMethodSelector, toggleChatWindowClipModal, toggleChatWindowTipModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {afterImageClipSelected} from './ChatWindowClipModal';
import {FONT_SIZES, nTwins, selectionTwin, twins, WIDTH_SIZES} from '../../../DesiginData/Utility';

import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Clip from '../../../Assets/svg/clip.svg';
import Cam from '../../../Assets/svg/chatCam.svg';
import Paisa from '../../../Assets/svg/paisa.svg';
import {Image} from 'expo-image';
import SendButton from '../SendButton';
import {confirmPasswordReset} from '@react-native-firebase/auth';

const ChatWindowInput = ({onChangeText, onButtonSendButtonClick, disableSendButton}) => {
  const userRole = useSelector(state => state.auth.user.role);

  const secondUserRole = useSelector(state => state.secondUser.screen.role);

  console.log(userRole, secondUserRole, '::::::::::::::::::::::');

  //Redux-------------

  const dispatch = useDispatch();

  //----------------Redux
  const [keyboardPadding, setkeyboardPadding] = useState(4);
  const [value, setValue] = useState('');
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);

  useLayoutEffect(() => {
    const keyBoardShown = Keyboard.addListener('keyboardDidShow', () => {
      setkeyboardPadding(responsiveWidth(2)), setIsKeyboardShown(true);
    });

    const keyBoardHide = Keyboard.addListener('keyboardDidHide', () => {
      setkeyboardPadding(responsiveWidth(2)), setIsKeyboardShown(false);
    });

    return () => {
      keyBoardShown.remove();
      keyBoardHide.remove();
    };
  }, []);

  const handleTextChange = useCallback(v => {
    setValue(v);
    onChangeText(v);
  }, []);

  const handleOnclick = useCallback(() => {
    onButtonSendButtonClick();
    setValue('');
  });

  const handleClipClick = useCallback(() => {
    dispatch(toggleChatWindowClipModal());
  });

  const sendTipHandler = () => {
    dispatch(toggleChatWindowTipModal());
  };

  const handleOpenCamera = () => {
    // if(Platform.OS === "ios") {

    request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then(result => {
      if (result === RESULTS.BLOCKED) {
        Linking.openSettings();
      } else {
        afterImageClipSelected(dispatch, 'camera');
      }
    });
  };

  const handleOpenCalling = () => {
    console.log('hello');

    dispatch(toggleCallMethodSelector({show: true}));
  };

  return (
    <View style={[styles.chatInputContainer, {paddingVertical: keyboardPadding}]}>
      <View style={[styles.attachmentAndTextInputWrapper, userRole === 'creator' ? {paddingHorizontal: responsiveWidth(3)} : {paddingRight: responsiveWidth(3)}, Platform.OS === 'ios' ? {height: responsiveWidth(12)} : {}]}>
        {userRole === 'creator' && (
          <TouchableOpacity style={{width: 20, height: 20}} onPress={() => dispatch(toggleChatWindowClipModal())}>
            <Image cachePolicy="memory-disk" source={require('../../../Assets/Images/messageClip.png')} contentFit="contain" style={{flex: 1}} />
          </TouchableOpacity>
        )}

        <TextInput
          selectionColor={selectionTwin()}
          selectionHandleColor={'#ffa86b'}
          cursorColor={'#1e1e1e'}
          placeholderTextColor="#B2B2B2"
          placeholder="Type Something.."
          style={[styles.textInput, Platform.OS === 'ios' ? {padding: responsiveWidth(1), fontSize: responsiveFontSize(1.8)} : {}]}
          multiline
          keyboardAppearance="light"
          onChangeText={v => handleTextChange(v)}
          value={value}
          autoCorrect={false}
          maxLength={500}
        />

        <View style={{flexDirection: 'row'}}>
          <View style={{marginRight: responsiveWidth(2), justifyContent: 'center'}}>
            {(userRole === 'creator' && secondUserRole === 'creator') || (userRole !== 'creator' && secondUserRole === 'creator') ? (
              <Pressable style={{width: 20, height: 20, marginTop: 1}} onPress={() => sendTipHandler()}>
                <Image cachePolicy="memory-disk" source={require('../../../Assets/Images/Coins2.png')} contentFit="contain" style={{flex: 1}} />
              </Pressable>
            ) : null}
          </View>
          {isKeyboardShown ? (
            // <TouchableOpacity
            //   onPress={handleOnclick}
            //   disabled={disableSendButton}
            //   style={[
            //     userRole === 'creator' && secondUserRole !== 'creator' ? {marginLeft: responsiveWidth(5)} : null,
            //     disableSendButton && {opacity: 0.5}, // Dim the button when disabled
            //   ]}>
            //   <Text style={{color: '#1e1e1e', fontFamily: 'Rubik-SemiBold', fontSize: FONT_SIZES[16]}}>Send</Text>
            // </TouchableOpacity>

            <SendButton handleOnclick={handleOnclick} disableSendButton={disableSendButton} userRole={userRole} secondUserRole={secondUserRole} />
          ) : (
            userRole === 'creator' &&
            secondUserRole !== 'admin' &&
            secondUserRole !== 'user' && (
              <Pressable style={{width: 20, height: 20}} onPress={() => handleOpenCamera()} disabled={disableSendButton}>
                <Image cachePolicy="memory-disk" source={require('../../../Assets/Images/camera.png')} contentFit="contain" style={{flex: 1}} />
              </Pressable>
            )
          )}
          {/* 
          {!isKeyboardShown && secondUserRole !== 'admin' && (
            <Pressable style={{width: 19, height: 19, marginLeft: 8}} onPress={() => handleOpenCalling()} disabled={disableSendButton}>
              <Image cachePolicy="memory-disk" source={require('../../../Assets/Images/chatCall.png')} contentFit="contain" style={{flex: 1}} />
            </Pressable>
          )} */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    alignItems: 'center',
    gap: 1,
    marginBottom: 4,
    alignSelf: 'center',
    width: responsiveWidth(95),
    // backgroundColor : 'red'
    // right:responsiveWidth(10)
  },
  attachmentAndTextInputWrapper: {
    borderWidth: WIDTH_SIZES[1.5],
    borderColor: '#282828',
    flexBasis: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F5',
    borderRadius: WIDTH_SIZES[14],
    width: responsiveWidth(95),
  },
  textInput: {
    flex: 1,
    paddingLeft: responsiveWidth(3),
    fontFamily: 'MabryPro-Regular',
    color: '#1e1e1e',
    fontSize: FONT_SIZES[14],
    // width: '70%',
  },
  marginLeftSendButton: {
    marginLeft: responsiveWidth(5),
  },
});

export default ChatWindowInput;
