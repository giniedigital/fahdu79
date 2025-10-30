import {StyleSheet, Text, View, Animated, TouchableOpacity, FlatList, Image, TextInput, Switch, Platform, Pressable, ActivityIndicator} from 'react-native';
import React, {useCallback, useState} from 'react';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import DIcon from '../../../DesiginData/DIcons';
import {useSelector, useDispatch} from 'react-redux';
import {toggleChatWindowTipModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {increaseTipAmount, decreaseTipAmount, customTipAmount} from '../../../Redux/Slices/NormalSlices/MessageSlices/ChatWindowTipAmountSlice';
import {useSendTipMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {authLogout, token as memoizedToken} from '../../../Redux/Slices/NormalSlices/AuthSlice';
import {deleteCachedMessages, pushSentMessageResponse} from '../../../Redux/Slices/NormalSlices/MessageSlices/ThreadSlices';
import {removeRoomList, updateCacheRoomList} from '../../../Redux/Slices/NormalSlices/RoomListSlice';
import {useKeyboard} from '@react-native-community/hooks';
import {ChatWindowError} from '../ErrorSnacks';
import {emptyUnreadRoomList} from '../../../Redux/Slices/NormalSlices/UnReadThreadSlice';
import {signOutGoogle} from '../../../OAuth';
import {padios, WIDTH_SIZES} from '../../../DesiginData/Utility';
import Paisa from '../../../Assets/svg/paisa.svg';
import AnimatedButton from '../AnimatedButton';

const ChatWindowTipModal = ({chatRoomId}) => {
  console.log('XXX', chatRoomId);

  const keyboard = useKeyboard();
  const [loading, setLoading] = useState(false);
  const showModal = useSelector(state => state.hideShow.visibility.chatWindowTipModal);
  const dispatch = useDispatch();
  const tipAmount = useSelector(state => state.chatWindowTipAmount.data.amount);
  const [sendTip] = useSendTipMutation();
  const token = useSelector(state => state.auth.user.token);

  const handleSendTipAmount = () => {
    if (tipAmount > 0) {
      if (tipAmount <= 10000) {
        setLoading(true);
        sendTip({token, tipAmount, chatRoomId})
          .then(async e => {
            console.log(e?.error, ':::::::::::', tipAmount);

            if (e?.error?.data?.status_code === 401) {
              dispatch(authLogout());
              dispatch(deleteCachedMessages());
              dispatch(removeRoomList());
              dispatch(emptyUnreadRoomList());
              dispatch(removeRoomList());

              await signOutGoogle();
            } else if (e?.error?.data?.message?.search('insufficient') >= 0) {
              ChatWindowError('Insufficient number of coins');
              dispatch(customTipAmount({amount: 0}));
              setLoading(false);
            } else {
              dispatch(updateCacheRoomList({chatRoomId: e?.data?.data?.room_id, createdAt: e?.data?.data?.createdAt, message: e?.data?.data?.message, hasAttachment: false, senderId: e?.data?.data?.sender_id}));
              dispatch(pushSentMessageResponse({chatRoomId: e?.data?.data?.room_id, sentMessageResponse: e?.data?.data}));
              dispatch(customTipAmount({amount: 0}));
              dispatch(toggleChatWindowTipModal());
              setLoading(false);
            }
          })
          .catch(e => {
            console.log('There was error while sending tip', e);
            ChatWindowError('There was error while sending tip');
            dispatch(customTipAmount({amount: 0}));
            setLoading(false);
          });
      } else {
        ChatWindowError('The max tip amount is 10,000');
      }
    } else {
      ChatWindowError('Please Add More Coins');
    }
  };

  return (
    showModal && (
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        animationInTiming={150}
        animationOutTiming={150}
        onRequestClose={() => {
          dispatch(customTipAmount({amount: 0}));
          dispatch(toggleChatWindowTipModal());
        }}
        transparent={true}
        isVisible={showModal}
        backdropColor="#00000060"
        onBackButtonPress={() => {
          dispatch(customTipAmount({amount: 0}));
          dispatch(toggleChatWindowTipModal());
        }}
        onBackdropPress={() => {
          dispatch(customTipAmount({amount: 0}));
          dispatch(toggleChatWindowTipModal());
        }}
        style={{
          flex: 1,
        }}>
        <View
          style={[
            styles.modalInnerWrapper,
            keyboard.keyboardShown
              ? {
                  height: Platform.OS === 'ios' ? responsiveWidth(150) + keyboard.keyboardHeight : responsiveWidth(95) + keyboard.keyboardHeight,
                }
              : {height: responsiveWidth(95)},
          ]}>
          <View style={{width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 28}}>
            <Text style={styles.sendTipText}>Send Tip</Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(customTipAmount({amount: 0}));
                dispatch(toggleChatWindowTipModal());
              }}>
              <Image cachePolicy="memory-disk" source={require('../../../Assets/Images/crossIcon.png')} contentFit="contain" style={{height: 18, width: 18}} />
            </TouchableOpacity>
          </View>
          <View style={styles.tipContainer}>
            <View style={styles.tipCounterContainer}>
              <View style={styles.sendTipInputContainer}>
                <View style={{marginLeft: responsiveWidth(2)}}>
                  <Paisa />
                </View>
                <TextInput placeholder="0" maxLength={5} value={String(tipAmount)} style={styles.amountInput} onChangeText={x => dispatch(customTipAmount({amount: x.replace(/[^0-9]/g, '')}))} keyboardType="numeric" />

                <TouchableOpacity style={{position: 'relative'}} onPress={() => dispatch(decreaseTipAmount())}>
                  <View style={[styles.plusMinusButton, {position: 'absolute', backgroundColor: '#282828', transform: [{translateX: responsiveWidth(0.3)}, {translateY: responsiveWidth(0.3)}]}]} />
                  <View style={[styles.plusMinusButton, {backgroundColor: '#ff6961'}]}>
                    <DIcon provider={'Entypo'} name={'minus'} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{position: 'relative'}} onPress={() => dispatch(increaseTipAmount())}>
                  <View style={[styles.plusMinusButton, {position: 'absolute', backgroundColor: '#282828', transform: [{translateX: responsiveWidth(0.3)}, {translateY: responsiveWidth(0.3)}]}]} />
                  <View style={[styles.plusMinusButton, {backgroundColor: '#bafca2'}]}>
                    <DIcon provider={'Entypo'} name={'plus'} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection: 'row', gap: responsiveWidth(2.5), marginTop: responsiveWidth(4), right: responsiveWidth(12)}}>
              {/* <Pressable onPress={() => dispatch(customTipAmount({amount: 10}))}>
                <View style={{gap: responsiveWidth(2), flexDirection: 'row', borderWidth: responsiveWidth(0.3), width: responsiveWidth(17), alignItems: 'center', justifyContent: 'center', borderRadius: responsiveWidth(4), padding: responsiveWidth(1), width: responsiveWidth(25)}}>
                  <Paisa />
                  <Text style={{color: 'black'}}>10</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => dispatch(customTipAmount({amount: 20}))}>
                <View style={{gap: responsiveWidth(2), flexDirection: 'row', borderWidth: responsiveWidth(0.3), width: responsiveWidth(17), alignItems: 'center', justifyContent: 'center', borderRadius: responsiveWidth(4), padding: responsiveWidth(1), width: responsiveWidth(25)}}>
                  <Paisa />
                  <Text style={{color: 'black'}}>20</Text>
                </View>
              </Pressable>

              <Pressable onPress={() => dispatch(customTipAmount({amount: 50}))}>
                <View style={{gap: responsiveWidth(2), flexDirection: 'row', borderWidth: responsiveWidth(0.3), width: responsiveWidth(17), alignItems: 'center', justifyContent: 'center', borderRadius: responsiveWidth(4), padding: responsiveWidth(1), width: responsiveWidth(25)}}>
                  <Paisa />
                  <Text style={{color: 'black'}}>50</Text>
                </View>
              </Pressable> */}

              {[10, 20, 50].map(amount => (
                <Pressable
                  key={amount}
                  onPress={() => dispatch(customTipAmount({amount}))}
                  style={({pressed}) => ({
                    flexDirection: 'row',
                    gap: responsiveWidth(2),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: responsiveWidth(0.3),
                    borderRadius: responsiveWidth(4),
                    padding: responsiveWidth(1),
                    width: responsiveWidth(25),
                    backgroundColor: pressed ? '#FFA86B' : 'transparent',
                  })}>
                  <Paisa />
                  <Text style={{color: 'black'}}>{amount}</Text>
                </Pressable>
              ))}
            </View>
            {/* <View style={{ position: "relative", alignSelf: "center" }}>
            <Text style={[styles.loginButton, { backgroundColor: "#282828", position: "absolute", alignSelf: "center", transform: [{ translateX: 2 }, { translateY: 2 }] }]} />
            <Pressable onPress={() => handleSendTipAmount()}>{!loading ? <Text style={[styles.loginButton]}>Pay</Text> : <ActivityIndicator size={"small"} color={"#282828"} style={styles.loginButton} />}</Pressable>
          </View> */}

            <View style={{width: responsiveWidth(78), alignSelf: 'center'}}>
              <AnimatedButton title={'Send'} onPress={handleSendTipAmount} loading={loading} />
            </View>
          </View>
        </View>
      </Modal>
    )
  );
};

const styles = StyleSheet.create({
  modalInnerWrapper: {
    width: responsiveWidth(100),
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderTopLeftRadius: responsiveWidth(3),
    borderTopRightRadius: responsiveWidth(3),
    padding: responsiveWidth(4),
    paddingTop: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(4),
    alignItems: 'center',
    marginLeft: responsiveWidth(1),
    marginTop: responsiveWidth(150),
  },
  previewModalImageWrapper: {
    flexBasis: '35%',
    width: '100%',
  },
  previewModalInputWrapper: {
    flexBasis: '15%',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: responsiveWidth(2),
  },
  notch: {
    borderTopColor: '#000',
    borderTopWidth: responsiveWidth(0.8),
    width: responsiveWidth(10),
    borderRadius: responsiveWidth(1),
  },
  sendTipText: {
    textAlign: 'center',
    fontFamily: 'Rubik-Bold',
    color: 'black',
    fontSize: responsiveFontSize(2.3),
    // marginTop: responsiveWidth(5),
  },

  fahduCoinTextTitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(2.5),
    color: '#282828',
    textAlign: 'center',
    marginVertical: responsiveWidth(2),
  },
  tipContainer: {
    marginTop: responsiveWidth(1),
    width: responsiveWidth(55),
  },
  tipCounterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveWidth(4),
  },
  plusMinusButton: {
    borderWidth: WIDTH_SIZES[1.5],
    height: responsiveWidth(9),
    width: responsiveWidth(9),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(2),
    borderColor: '#282828',
  },
  sendTipInputContainer: {
    borderWidth: WIDTH_SIZES[1.5],
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: responsiveWidth(80),
    borderRadius: responsiveWidth(2),
    borderColor: '#282828',
    right: responsiveWidth(12),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(3),
  },
  amountInput: {
    flexBasis: '50%',
    color: '#282828',
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(2.2),
    padding: Platform.OS === 'ios' ? responsiveWidth(3) : responsiveWidth(0),
  },
});
export default ChatWindowTipModal;
