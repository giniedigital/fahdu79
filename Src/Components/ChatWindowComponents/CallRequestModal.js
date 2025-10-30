import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import {useDispatch, useSelector} from 'react-redux';
import {BlurView} from 'expo-blur';
import {Image} from 'expo-image';
import {toggleCallRequestModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {FONT_SIZES, WIDTH_SIZES} from '../../../DesiginData/Utility';
import {navigate} from '../../../Navigation/RootNavigation';
import {useAcceptCallRequestMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {LoginPageErrors} from '../ErrorSnacks';
import dayjs from 'dayjs';

const CallRequestModal = ({roomId, callTriesData, name, profileImageUrl}) => {
  const dispatch = useDispatch();
  const visibility = useSelector(state => state.hideShow.visibility.callRequestModal);
  const token = useSelector(state => state.auth.user.token);

  const [acceptCallRequest] = useAcceptCallRequestMutation();

  const handleClose = () => dispatch(toggleCallRequestModal({show: false}));

  const handleAcceptCallRequest = async () => {
    const {data, error} = await acceptCallRequest({
      token,
      data: {
        roomId,
        userId: callTriesData?.initiator,
        callType: String(callTriesData?.type).toLowerCase(),
      },
    });

    if (data) {
      navigate('callScreen', {roomId, name, profileImageUrl});
    }

    if (error) {
      LoginPageErrors(error?.data?.message);
      setTimeout(() => {
        handleClose();
      }, 1000);
    }
  };

  return (
    visibility && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />

        <Dialog visible={visibility} dialogStyle={styles.dialog} contentStyle={styles.dialogPadding} onTouchOutside={handleClose}>
          <View style={styles.innerRow}>
            <View style={styles.iconBox}>
              <Image source={require('../../../Assets/Images/callIncoming.png')} style={styles.iconImage} contentFit="contain" />
            </View>

            <View style={styles.textSection}>
              <Text style={styles.title}>Call Request</Text>
              <Text style={styles.subtitle}>Now ({callTriesData?.callTries}/3)</Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.acceptBtn} onPress={handleAcceptCallRequest}>
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.denyBtn} onPress={handleClose}>
                <Text style={styles.btnText}>Deny</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{width: '100%', height: WIDTH_SIZES['1.5'], backgroundColor: '#1e1e1e', marginTop: 8}} />
          <View style={styles.bottomRow}>
            <Text style={styles.availabilityText}>{`Request Availability : ${dayjs(callTriesData?.availability).format('D MMMM YYYY, h:mmA')}`}</Text>
          </View>
        </Dialog>
      </View>
    )
  );
};

export default CallRequestModal;

const styles = StyleSheet.create({
  overlay: {
    zIndex: 1,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: WIDTH_SIZES['1.5'],
    borderColor: '#1e1e1e',
    overflow: 'hidden',
    position: 'absolute',
    top: 40,
    width: '100%',
    alignSelf: 'center',
  },

  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  iconBox: {
    width: 41,
    height: 41,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconImage: {
    width: 22,
    height: 22,
    tintColor: '#fff',
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: FONT_SIZES['14'],
    color: '#1e1e1e',
  },
  subtitle: {
    fontFamily: 'Rubik-Regular',
    fontSize: FONT_SIZES['12'],
    color: '#1e1e1e',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  acceptBtn: {
    backgroundColor: '#C5FFD2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: WIDTH_SIZES['8'],
    borderWidth: WIDTH_SIZES[1.5],
    borderColor: '#1e1e1e',
  },
  denyBtn: {
    backgroundColor: '#FF8580',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: WIDTH_SIZES['8'],
    borderWidth: WIDTH_SIZES[1.5],
    borderColor: '#1e1e1e',
  },
  btnText: {
    fontFamily: 'Rubik-SemiBold',
    color: '#1e1e1e',
    fontSize: FONT_SIZES['12'],
  },
  bottomRow: {
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  availabilityText: {
    fontFamily: 'Rubik-Regular',
    fontSize: FONT_SIZES['14'],
    color: '#1e1e1e',
    textAlign: 'center',
  },
  dialogPadding: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 0,
  },
});
