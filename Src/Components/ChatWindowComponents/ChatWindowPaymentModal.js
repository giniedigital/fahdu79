import React, {useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform, Image, Pressable} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {navigate} from '../../../Navigation/RootNavigation';
import {useDispatch, useSelector} from 'react-redux';
import {toggleAreYou} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {FONT_SIZES} from '../../../DesiginData/Utility';
import {toggleChatWindowPaymentModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {usePaymentMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {resetUnlockPremiumTempData} from '../../../Redux/Slices/NormalSlices/MessageSlices/ChatWindowUnlockPremiumTempDataSlice';
import {memoizedThreadSelector} from '../../../Redux/Slices/NormalSlices/MessageSlices/ThreadSlices';
import {updatePremiumAttachmentThread} from '../../../Redux/Slices/NormalSlices/MessageSlices/ThreadSlices';
import {LoginPageErrors} from '../ErrorSnacks';

const ChatWindowPaymentModal = ({token, chatRoomId: roomId}) => {
  const visible = useSelector(state => state.hideShow.visibility.chatWindowPaymentModal);
  const tempData = useSelector(state => state.chatWindowUnlockPremiumTempData.data);

  const dispatch = useDispatch();

  const [payment] = usePaymentMutation();

  const handlePaymentModalClose = useCallback(() => {
    dispatch(toggleChatWindowPaymentModal());
    dispatch(resetUnlockPremiumTempData());
  }, []);

  // const chatThreadFromCache = useSelector(memoizedThreadSelector(roomId)).messages;

  const handlePayment = useCallback(() => {
    payment({token, conversationId: tempData?.conversationId, roomId})
      .then(e => {
        console.log(e?.error?.data?.statusCode, e?.error?.data);

        if (e?.error?.data?.statusCode !== 400) {
          dispatch(resetUnlockPremiumTempData());
          dispatch(updatePremiumAttachmentThread({chatRoomId: roomId, conversationId: tempData?.conversationId, paid_by_reciever: true, url: e?.data?.data?.link}));
          dispatch(toggleChatWindowPaymentModal());
        } else {
          LoginPageErrors('Insufficient Balance');
        }
      })
      .catch(e => {
        console.log('Payment Catch', e);
      });
  }, [tempData]);

  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />
        <Dialog visible={visible} dialogStyle={styles.dialog} contentStyle={{padding: 0, paddingTop: 0}}>
          <View style={styles.content}>
            <View style={styles.yesNoContainer}>
              <Text style={styles.textYesNo} numberOfLines={1}>
                Unlock the Media
              </Text>

              <View style={styles.buttonContainer}>
                <Pressable onPress={handlePaymentModalClose} style={({pressed}) => [styles.button, styles.noButton, {backgroundColor: pressed ? 'black' : styles.noButton.backgroundColor || 'transparent'}]}>
                  {({pressed}) => <Text style={[styles.buttonText, {color: pressed ? 'white' : styles.buttonText.color || 'black'}]}>Cancel</Text>}
                </Pressable>

                <Pressable onPress={handlePayment} style={({pressed}) => [styles.button, styles.yesButton, {backgroundColor: pressed ? 'black' : styles.yesButton.backgroundColor || 'transparent'}]}>
                  {({pressed}) => (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={[styles.buttonText, {color: pressed ? 'white' : styles.buttonText.color || 'black'}]}>
                        Pay{' '}
                        <Text
                          style={{
                            fontFamily: 'Rubik-Bold',
                            fontSize: FONT_SIZES[16],
                            color: pressed ? 'white' : styles.buttonText.color || 'black',
                          }}>
                          {tempData.amount}
                        </Text>
                      </Text>
                      <Image
                        source={require('../../../Assets/Images/Coins2.png')}
                        style={{
                          height: responsiveWidth(4.5),
                          width: responsiveWidth(4.5),
                          resizeMode: 'contain',
                          alignSelf: 'center',
                          marginLeft: responsiveWidth(1),
                        }}
                      />
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Dialog>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: responsiveWidth(5.33),
    borderWidth: 2,
    borderStyle: 'dashed',
    alignSelf: 'center',
    padding: 32,
    backgroundColor: '#fff',
    width: responsiveWidth(88), // Adjusted for consistency
    height: responsiveWidth(44), // Adjusted for consistency
    borderColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
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
  yesNoContainer: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  textYesNo: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: FONT_SIZES[16], // Adjust font size if needed
    textAlign: 'center',
    color: '#1e1e1e',
    width: '100%', // Ensure the text container takes full width
    flexShrink: 1, // Prevent text from wrapping
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Platform.OS === 'ios' ? 4 : 0,
    width: '100%',
    marginTop: Platform.OS === 'ios' ? 16 : 12,
  },
  button: {
    width: responsiveWidth(34.5), // Adjusted for consistency
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Platform.OS === 'android' ? 6 : 8,
    borderWidth: 1.5,
    borderColor: '#1E1E1E',
  },
  yesButton: {
    backgroundColor: '#ffa86b',
    flexDirection: 'row',
  },
  noButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14,
    color: '#1e1e1e',
  },
});

export default ChatWindowPaymentModal;
