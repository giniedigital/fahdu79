import {StyleSheet, Text, View, TextInput, ActivityIndicator, TouchableOpacity, Image, Pressable, Platform} from 'react-native';
import React, {useState} from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import DIcon from '../../../DesiginData/DIcons';
import {useSelector, useDispatch} from 'react-redux';

import {increaseTipAmount, decreaseTipAmount, customTipAmount} from '../../../Redux/Slices/NormalSlices/MessageSlices/ChatWindowTipAmountSlice';
import {useLiveStreamTipMutation, useSendPostTipMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {token as memoizedToken} from '../../../Redux/Slices/NormalSlices/AuthSlice';

import {useKeyboard} from '@react-native-community/hooks';
import {ChatWindowError, LoginPageErrors, chatRoomSuccess} from '../ErrorSnacks';

import {autoLogout} from '../../../AutoLogout';
import {toggleSendPostTipModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {padios} from '../../../DesiginData/Utility';
import {useNavigationState} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import Paisa from '../../../Assets/svg/paisa.svg';
import AnimatedButton from '../AnimatedButton';

const PostTipModal = () => {
  const keyboard = useKeyboard();

  const [loading, setLoading] = useState(false);

  const modal = useSelector(state => state.hideShow.visibility.sendPostTipsModal);

  const dispatch = useDispatch();

  const tipAmount = useSelector(state => state.chatWindowTipAmount.data.amount);

  const [sendPostTip] = useSendPostTipMutation();

  const token = useSelector(state => state.auth.user.token);

  const [plusClick, setPlusClick] = useState(false);

  const [minusClick, setMinusClick] = useState(false);

  const [fastPayClick, setFastPayClick] = useState({click: false, id: 0});

  const handleSendTipAmount = () => {
    if (tipAmount > 0) {
      if (tipAmount <= 10000) {
        setLoading(true);
        sendPostTip({token, data: {amount: tipAmount, postId: modal?.postId, type: 'POST'}})
          .then(async e => {
            console.log(e?.error, ':::::::::::', tipAmount);

            if (e?.error?.status === 403) {
              LoginPageErrors(e?.error?.data?.message);
              dispatch(customTipAmount({amount: 0}));
              setLoading(false);
              return;
            }

            if (e?.error?.data?.status_code === 401) {
              autoLogout();
            } else if (e?.error?.data?.message?.search('insufficient') >= 0) {
              ChatWindowError('Insufficient number of coins');
              dispatch(customTipAmount({amount: 0}));
              setLoading(false);
            } else {
              dispatch(customTipAmount({amount: 0}));
              dispatch(toggleSendPostTipModal({info: {postId: '', show: false}}));
              setLoading(false);

              setTimeout(() => {
                chatRoomSuccess(e?.data?.message);
              }, 500);
              console.log(e?.data);
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

    setLoading(false);
  };

  if (modal?.show) {
    return (
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        animationInTiming={150}
        animationOutTiming={150}
        onRequestClose={() => {
          dispatch(customTipAmount({amount: 0}));
          dispatch(toggleSendPostTipModal({info: {postId: '', show: false}}));
        }}
        transparent={true}
        isVisible={modal?.show}
        backdropColor="#00000060"
        onBackButtonPress={() => {
          dispatch(customTipAmount({amount: 0}));
          dispatch(toggleSendPostTipModal({info: {postId: '', show: false}}));
        }}
        onBackdropPress={() => {
          dispatch(customTipAmount({amount: 0}));
          dispatch(toggleSendPostTipModal({info: {postId: '', show: false}}));
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
          <View style={styles.notch} />
          <View style={{right: responsiveWidth(28)}}>
            <Text style={styles.sendTipText}>Send Tip</Text>
          </View>
          <View style={styles.tipContainer}>
            <View style={styles.tipCounterContainer}>
              <View style={styles.sendTipInputContainer}>
                <View style={{marginLeft: responsiveWidth(2)}}>
                  <Paisa />
                </View>
                <TextInput placeholder="0" maxLength={5} value={String(tipAmount)} style={styles.amountInput} onChangeText={x => dispatch(customTipAmount({amount: x.replace(/[^0-9]/g, '')}))} keyboardType="numeric" />

                <Pressable onPressIn={() => setMinusClick(true)} onPressOut={() => setMinusClick(false)} style={{position: 'relative'}} onPress={() => dispatch(decreaseTipAmount())}>
                  <View style={[styles.plusMinusButton, {position: 'absolute', backgroundColor: '#282828', transform: [{translateX: responsiveWidth(0.3)}, {translateY: responsiveWidth(0.3)}]}]} />
                  <View style={[styles.plusMinusButton, {backgroundColor: '#ff6961'}, minusClick && {backgroundColor: '#FFCCCC'}]}>
                    <DIcon provider={'Entypo'} name={'minus'} />
                  </View>
                </Pressable>
                <Pressable onPressIn={() => setPlusClick(true)} onPressOut={() => setPlusClick(false)} style={{position: 'relative'}} onPress={() => dispatch(increaseTipAmount())}>
                  <View style={[styles.plusMinusButton, {position: 'absolute', backgroundColor: '#282828', transform: [{translateX: responsiveWidth(0.3)}, {translateY: responsiveWidth(0.3)}]}]} />
                  <View style={[styles.plusMinusButton, {backgroundColor: '#bafca2'}, plusClick && {backgroundColor: '#CCFFD7'}]}>
                    <DIcon provider={'Entypo'} name={'plus'} />
                  </View>
                </Pressable>
              </View>
            </View>
            <View style={{flexDirection: 'row', gap: responsiveWidth(2.5), marginTop: responsiveWidth(4), right: responsiveWidth(12)}}>
              <Pressable onPressIn={() => setFastPayClick({click: true, id: 0})} onPressOut={() => setFastPayClick({click: false, id: 0})} onPress={() => dispatch(customTipAmount({amount: 10}))}>
                <View
                  style={[
                    fastPayClick.click && fastPayClick.id === 0 && {backgroundColor: '#FFA86B'},
                    {gap: responsiveWidth(2), flexDirection: 'row', borderWidth: responsiveWidth(0.3), width: responsiveWidth(17), alignItems: 'center', justifyContent: 'center', borderRadius: responsiveWidth(4), padding: responsiveWidth(1), width: responsiveWidth(25)},
                  ]}>
                  <Paisa />
                  <Text style={{color: 'black'}}>10</Text>
                </View>
              </Pressable>

              <Pressable onPressIn={() => setFastPayClick({click: true, id: 1})} onPressOut={() => setFastPayClick({click: false, id: 1})} onPress={() => dispatch(customTipAmount({amount: 20}))}>
                <View
                  style={[
                    fastPayClick.click && fastPayClick.id === 1 && {backgroundColor: '#FFA86B'},
                    {gap: responsiveWidth(2), flexDirection: 'row', borderWidth: responsiveWidth(0.3), width: responsiveWidth(17), alignItems: 'center', justifyContent: 'center', borderRadius: responsiveWidth(4), padding: responsiveWidth(1), width: responsiveWidth(25)},
                  ]}>
                  <Paisa />
                  <Text style={{color: 'black'}}>20</Text>
                </View>
              </Pressable>

              <Pressable onPressIn={() => setFastPayClick({click: true, id: 2})} onPressOut={() => setFastPayClick({click: false, id: 2})} onPress={() => dispatch(customTipAmount({amount: 50}))}>
                <View
                  style={[
                    fastPayClick.click && fastPayClick.id === 2 && {backgroundColor: '#FFA86B'},
                    {gap: responsiveWidth(2), flexDirection: 'row', borderWidth: responsiveWidth(0.3), width: responsiveWidth(17), alignItems: 'center', justifyContent: 'center', borderRadius: responsiveWidth(4), padding: responsiveWidth(1), width: responsiveWidth(25)},
                  ]}>
                  <Paisa />
                  <Text style={{color: 'black'}}>50</Text>
                </View>
              </Pressable>

              
            </View>
            {/* <View style={{ position: "relative", alignSelf: "center" }}>
            <Text style={[styles.loginButton, { backgroundColor: "#282828", position: "absolute", alignSelf: "center", transform: [{ translateX: 2 }, { translateY: 2 }] }]} />
            <Pressable onPress={() => handleSendTipAmount()}>{!loading ? <Text style={[styles.loginButton]}>Pay</Text> : <ActivityIndicator size={"small"} color={"#282828"} style={styles.loginButton} />}</Pressable>
          </View> */}

            <View style={{width: 325, alignSelf: 'center'}}>
              <AnimatedButton onPress={() => handleSendTipAmount()} loading={loading} title={'Send'} />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  modalInnerWrapper: {
    width: responsiveWidth(100),
    backgroundColor: '#fffdf6',
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
    marginTop: responsiveWidth(5),
  },
  loginButton: {
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#FFA86B',
    borderRadius: responsiveWidth(3),
    color: '#282828',
    textAlign: 'center',
    fontFamily: 'Rubik-Medium',
    // elevation: 1,
    fontWeight: '600',
    width: responsiveWidth(80),
    height: responsiveWidth(12),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderTopColor: '#282828',
    borderLeftColor: '#282828',
    // elevation: 1,
    fontSize: responsiveFontSize(2),
    // borderBottomWidth: responsiveWidth(0.6),
    // borderRightWidth: responsiveWidth(0.6),
    // borderTopWidth:responsiveWidth(.3),
    // borderLeftWidth:responsiveWidth(.3),
    borderWidth: responsiveWidth(0.5),
    padding: padios(responsiveWidth(2.6)),
    overflow: 'hidden',
    marginTop: responsiveWidth(4),
  },
  fahduCoinTextTitle: {
    fontFamily: 'MabryPro-Regular',
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
    borderWidth: 1,
    height: responsiveWidth(9),
    width: responsiveWidth(9),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(2),
    borderColor: '#282828',
  },
  sendTipInputContainer: {
    borderWidth: 1,
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
    fontFamily: 'MabryPro-Regular',
    fontSize: responsiveFontSize(2.2),
    padding: Platform.OS === 'ios' ? responsiveWidth(3) : responsiveWidth(0),
  },
});
export default PostTipModal;
