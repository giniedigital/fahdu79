import {StyleSheet, Text, View, TextInput, ActivityIndicator, TouchableOpacity, Image, Pressable, Platform, FlatList} from 'react-native';
import React, {useState} from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import {useSelector, useDispatch} from 'react-redux';
import {useKeyboard} from '@react-native-community/hooks';
import {useNavigationState} from '@react-navigation/native';
import DIcon from '../../../DesiginData/DIcons';
import {customTipAmount, decreaseTipAmount, increaseTipAmount} from '../../../Redux/Slices/NormalSlices/MessageSlices/ChatWindowTipAmountSlice';
import {useLiveStreamTipMutation, useTipForGoalMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {token as memoizedToken} from '../../../Redux/Slices/NormalSlices/AuthSlice';
import {ChatWindowError, chatRoomSuccess} from '../../Components/ErrorSnacks';
import {autoLogout} from '../../../AutoLogout';
import {FONT_SIZES, padios, WIDTH_SIZES} from '../../../DesiginData/Utility';
import {toggleLiveStreamTipModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import axios from 'axios';
import {updateWallet} from '../../../Redux/Slices/NormalSlices/Wallet/WalletSlice';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Paisa from '../../../Assets/svg/paisa.svg';
import AnimatedButton from '../../Components/AnimatedButton';

const LiveStreamTip = ({roomId}) => {
  const keyboard = useKeyboard();

  const [loading, setLoading] = useState(false);

  const modal = useSelector(state => state.hideShow.visibility.liveStreamTipModal);

  const dispatch = useDispatch();

  const tipAmount = useSelector(state => state.chatWindowTipAmount.data.amount);

  const [liveStreamTip] = useLiveStreamTipMutation();

  const [tipForGoal] = useTipForGoalMutation();

  const token = useSelector(state => state.auth.user.token);

  const flashGoals = useSelector(state => state.livechats.data.goals);

  const fetchCoins = async () => {
    try {
      let {data} = await axios.get('https://api.fahdu.in/api/wallet/get-coins', {
        headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
        timeout: 10000,
      });

      dispatch(updateWallet({coins: data?.data}));
    } catch (e) {
      console.log('Get Coin Error ', e);
    }
  };

  const handleSendTipAmount = () => {
    if (tipAmount > 0) {
      if (tipAmount <= 10000) {
        setLoading(true);
        // { amount: 2, title: "Russian", roomId: "83c3a194-ec4a-4842-9049-1490eecd6f26" }
        if (flashGoals?.length > 0) {
          tipForGoal({token, data: {amount: tipAmount, title: flashGoals[0].title, roomId}})
            .then(async e => {
              console.log(e?.error, ':::::::::::', tipAmount);

              if (e?.error?.data?.status_code === 401) {
                autoLogout();
              } else if (e?.error?.data?.message?.search('insufficient') >= 0) {
                ChatWindowError('Insufficient number of coins');
                dispatch(customTipAmount({amount: 0}));
                setLoading(false);
              } else {
                dispatch(customTipAmount({amount: 0}));
                dispatch(toggleLiveStreamTipModal({info: {roomId: '', show: false}}));
                setLoading(false);

                setTimeout(() => {
                  chatRoomSuccess(e?.data?.message);
                  fetchCoins();
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
          liveStreamTip({token, data: {amount: tipAmount, roomId: modal?.roomId, type: 'LIVESTREAM'}})
            .then(async e => {
              console.log(e?.error, ':::::::::::', tipAmount);

              if (e?.error?.data?.status_code === 401) {
                autoLogout();
              } else if (e?.error?.data?.message?.search('insufficient') >= 0) {
                ChatWindowError('Insufficient number of coins');
                dispatch(customTipAmount({amount: 0}));
                setLoading(false);
              } else {
                dispatch(customTipAmount({amount: 0}));
                dispatch(toggleLiveStreamTipModal({info: {roomId: '', show: false}}));
                setLoading(false);

                setTimeout(() => {
                  chatRoomSuccess(e?.data?.message);
                  fetchCoins();
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
        }
      } else {
        ChatWindowError('The max tip amount is 10,000');
      }
    } else {
      ChatWindowError('Please Add More Coins');
    }
  };

  if (modal?.show) {
    return (
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <Modal
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          animationInTiming={150}
          animationOutTiming={150}
          onRequestClose={() => {
            dispatch(customTipAmount({amount: 0}));
            dispatch(toggleLiveStreamTipModal({info: {roomId: '', show: false}}));
          }}
          avoidKeyboard
          transparent={true}
          isVisible={modal?.show}
          backdropColor="#00000060"
          onBackButtonPress={() => {
            dispatch(customTipAmount({amount: 0}));
            dispatch(toggleLiveStreamTipModal({info: {roomId: '', show: false}}));
          }}
          onBackdropPress={() => {
            dispatch(customTipAmount({amount: 0}));
            dispatch(toggleLiveStreamTipModal({info: {roomId: '', show: false}}));
          }}
          style={{
            flex: 1,
            width: '100%',
          }}>
          <View
            style={[
              styles.modalOuterWrapper,

              keyboard.keyboardShown
                ? {
                    height: Platform.OS === 'ios' ? responsiveWidth(100) + keyboard.keyboardHeight : responsiveWidth(95) + keyboard.keyboardHeight,
                  }
                : {height: responsiveWidth(95)},
            ]}>
            <View style={[styles.modalInnerWrapper]}>
              <View style={styles.tipContainer}>
                <View style={{width: responsiveWidth(80), justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
                  <Text style={styles.fahduCoinTextTitle}>Send Tip</Text>
                  <Pressable
                    onPress={() => {
                      dispatch(customTipAmount({amount: 0}));
                      dispatch(toggleLiveStreamTipModal({info: {roomId: '', show: false}}));
                    }}>
                    <DIcon name={'cross'} provider={'Entypo'} />
                  </Pressable>
                </View>

                <View style={styles.sendTipInputContainer}>
                  <Paisa />
                  <TextInput placeholder="0" maxLength={5} value={String(tipAmount)} style={styles.amountInput} onChangeText={x => dispatch(customTipAmount({amount: x.replace(/[^0-9]/g, '')}))} keyboardType="numeric" />

                  <View style={{flexDirection: 'row', gap: responsiveWidth(WIDTH_SIZES[2])}}>
                    <Pressable style={{position: 'relative'}} onPress={() => dispatch(decreaseTipAmount())}>
                      {({pressed}) => (
                        <View
                          style={[
                            styles.plusMinusButton,
                            {
                              backgroundColor: pressed ? '#FFCCCC' : '#FF8080',
                              borderWidth: WIDTH_SIZES[2],
                            },
                          ]}>
                          <DIcon provider={'Entypo'} name={'minus'} />
                        </View>
                      )}
                    </Pressable>

                    <Pressable onPress={() => dispatch(increaseTipAmount())}>
                      {({pressed}) => (
                        <View
                          style={[
                            styles.plusMinusButton,
                            {
                              backgroundColor: pressed ? '#CCFFD7' : '#A4FFB8',
                            },
                          ]}>
                          <DIcon provider={'Entypo'} name={'plus'} />
                        </View>
                      )}
                    </Pressable>
                  </View>
                </View>

                {/* <FlatList
                data={[10, 20, 100]}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity style={{}} onPress={() => dispatch(customTipAmount({ amount: item }))}>
                      <View style={{}}>
                        <View style={[{ borderWidth: responsiveWidth(.5), width: responsiveWidth(15), backgroundColor: "white", height: responsiveWidth(10), right: responsiveWidth(1), zIndex: 2 }]}>
                          <Text style={{ fontFamily: "rubik-Bold", color: "#282828" }}>{item}</Text>
                        </View>
                      </View>

                    </TouchableOpacity>
                  );
                }}
                style={{}}
                horizontal
                ItemSeparatorComponent={() => <View style={{ width: responsiveWidth(4) }} />}
                contentContainerStyle={{ padding: responsiveWidth(2), borderWidth: 1, }}
              /> */}
                {/* <View style={{flexDirection: 'row', gap: responsiveWidth(1), marginTop: responsiveWidth(4), right: responsiveWidth(9)}}>
                <Pressable onPress={() => dispatch(customTipAmount({amount: 10}))}>
                  <View
                    style={{gap: responsiveWidth(2), flexDirection: 'row', borderWidth: responsiveWidth(0.3), width: responsiveWidth(17), alignItems: 'center', justifyContent: 'center', borderRadius: responsiveWidth(4), padding: responsiveWidth(1), width: responsiveWidth(25)}}>
                    <Paisa />
                    <Text style={{color: 'black'}}>10</Text>
                  </View>
                </Pressable>

                <Pressable onPress={() => dispatch(customTipAmount({amount: 20}))}>
                  <View
                    style={{gap: responsiveWidth(2), flexDirection: 'row', borderWidth: responsiveWidth(0.3), width: responsiveWidth(17), alignItems: 'center', justifyContent: 'center', borderRadius: responsiveWidth(4), padding: responsiveWidth(1), width: responsiveWidth(25)}}>
                    <Paisa />
                    <Text style={{color: 'black'}}>20</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => dispatch(customTipAmount({amount: 50}))}>
                  <View
                    style={{gap: responsiveWidth(2), flexDirection: 'row', borderWidth: responsiveWidth(0.3), width: responsiveWidth(17), alignItems: 'center', justifyContent: 'center', borderRadius: responsiveWidth(4), padding: responsiveWidth(1), width: responsiveWidth(25)}}>
                    <Paisa />
                    <Text style={{color: 'black'}}>50</Text>
                  </View>
                </Pressable>
              </View> */}

                <View style={{flexDirection: 'row', gap: 8, marginTop: 16, height: 38, alignSelf: 'center'}}>
                  {[10, 20, 50].map(amount => (
                    <Pressable key={amount} onPress={() => dispatch(customTipAmount({amount}))}>
                      {({pressed}) => (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: WIDTH_SIZES[2],
                            borderColor: '#000',
                            borderRadius: WIDTH_SIZES[36],
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            width: Platform.OS === 'ios' ? 104 : 90,
                            height: 40,
                            backgroundColor: pressed ? '#FFA86B' : '#fff', // background toggle
                          }}>
                          <Image source={require('../../../Assets/Images/Coins2.png')} style={{width: 14, height: 14, marginRight: 8}} />
                          <Text
                            style={{
                              color: '#1e1e1e',
                              fontSize: FONT_SIZES[14],
                              fontFamily: 'Rubik-Medium',
                            }}>
                            {amount}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
                {/* 
              <View style={{marginTop: responsiveWidth(8.5), borderRadius: responsiveWidth(2.5), borderBottomWidth: responsiveWidth(0.6), width: responsiveWidth(75), right: responsiveWidth(8), borderRightWidth: responsiveWidth(1.2)}}>
                <View style={{alignSelf: 'center'}}>
                  <Pressable onPress={() => handleSendTipAmount()}>{!loading ? <Text style={[styles.loginButton]}>PAY</Text> : <ActivityIndicator size={'small'} color={'#282828'} style={styles.loginButton} />}</Pressable>
                </View>
              </View> */}

                <View style={{width: responsiveWidth(80), alignSelf: 'center'}}>
                  <AnimatedButton loading={loading} title={'Pay'} onPress={handleSendTipAmount} buttonMargin={4} />
                </View>

                {/* <Text style={[styles.fahduCoinTextTitle, { marginTop: responsiveWidth(5), fontFamily: "MabryPro-Medium" }]}>Quick Tip</Text> */}
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  modalOuterWrapper: {
    backgroundColor: '#Fff',
    padding: responsiveWidth(8.53),
    right: 20,
    marginTop: responsiveWidth(150),
    borderTopLeftRadius: WIDTH_SIZES[20],
    borderTopRightRadius: WIDTH_SIZES[20],
    width: '100%',
    alignSelf: 'center',
  },
  modalInnerWrapper: {
    width: responsiveWidth(99),
    backgroundColor: '#fff',
    alignSelf: 'center',
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
    fontFamily: 'Lexend-Bold',
    color: '#ffa07a',
    fontSize: responsiveFontSize(3),
  },

  fahduCoinTextTitle: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: FONT_SIZES[20],
    color: '#1e1e1e',
  },
  tipContainer: {
    marginTop: responsiveWidth(1),
    width: responsiveWidth(55),
    alignSelf: 'center',
    // right: responsiveWidth(2),
  },
  tipCounterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveWidth(4),
    width: responsiveWidth(80),
  },
  plusMinusButton: {
    borderWidth: 1,
    height: responsiveWidth(10),
    width: responsiveWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: WIDTH_SIZES[2],
    borderRadius: responsiveWidth(2),
    borderColor: '#1e1e1e',
  },
  sendTipInputContainer: {
    borderWidth: WIDTH_SIZES[2],
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: responsiveWidth(15),
    alignItems: 'center',
    width: responsiveWidth(80),
    borderRadius: responsiveWidth(4),
    borderColor: '#282828',
    alignSelf: 'center',
    marginTop: WIDTH_SIZES[16],
  },
  amountInput: {
    flexBasis: '50%',
    right: responsiveWidth(3),
    color: '#282828',
    fontFamily: 'MabryPro-Regular',
    fontSize: responsiveFontSize(2.2),
    padding: Platform.OS === 'ios' ? responsiveWidth(3) : responsiveWidth(1),
  },
});
export default LiveStreamTip;
