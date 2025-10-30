import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, Linking, Alert, FlatList, Platform, Pressable, Dimensions, TouchableOpacity} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import AnimatedButton from '../../Components/AnimatedButton';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {Image} from 'expo-image';
import {navigate} from '../../../Navigation/RootNavigation';
import {FONT_SIZES, nTwins, WIDTH_SIZES} from '../../../DesiginData/Utility';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {toggleBankDetailsModal, toggleConfirmBankDetails, toggleShowBankDetailsModal, toggleTransactionDetailModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useLazyAlreadyFilledBankDetailsQuery} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import DIcon from '../../../DesiginData/DIcons';

const TransactionDetailsModal = ({visible, transaction}) => {
  const dispatch = useDispatch();

  const [contentHeight, setContentHeight] = useState(0);

  // Calculate modal height based on content
  const calculateModalHeight = () => {
    const headerHeight = 50; // Approximate height of header
    const contentPadding = 32; // Padding inside dialog
    const minHeight = 300; // Minimum height you want
    const maxHeight = Dimensions.get('window').height * 0.8; // Maximum height (80% of screen)

    // Total height calculation
    const totalHeight = headerHeight + contentHeight + contentPadding;

    // Ensure height is between min and max
    return Math.min(Math.max(totalHeight, minHeight), maxHeight);
  };

  const handleContentLayout = event => {
    const {height} = event.nativeEvent.layout;
    setContentHeight(height);
  };

  function Detail({label, value, bold}) {
    return (
      <View style={{marginBottom: 14}}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, bold && {fontWeight: 'bold'}]}>{value}</Text>
      </View>
    );
  }


  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView experimentalBlurMethod intensity={15} style={styles.blurBackground} />
        <Dialog visible={visible} dialogStyle={[styles.dialog, {height: calculateModalHeight() + 50}]} contentStyle={{padding: 0, paddingTop: 0, backgroundColor: '#fff'}} onTouchOutside={() => dispatch(toggleTransactionDetailModal({show: false}))}>
          <View style={{position: 'relative'}}>
            <View style={styles.header}>
              <Text style={styles.title}>Transaction Details</Text>
              <TouchableOpacity onPress={() => dispatch(toggleTransactionDetailModal({show: false}))}>
                {/* <Ionicons name="close" size={24} color="black" /> */}
                <DIcon provider={'Ionicons'} name={'close'} />
              </TouchableOpacity>
            </View>

            <View>
              <View style={[styles.overlayTwo, {width: '100%', height: contentHeight}]} />

              <View
                style={styles.content}
                onLayout={event => {
                  const {height} = event.nativeEvent.layout;
                  setContentHeight(height);
                }}>
                <Detail label="Transaction ID" value={transaction.id} bold />
                <Detail label="Transfer Amount" value={`₹${transaction.amount}`} />
                <Detail label="Transfer Date" value={transaction.date} />
                <Detail label="Transfer Time" value={transaction.time} bold />
                <Detail label="Transfer Account" value={transaction.account} />
                <Detail label="Transfer Category" value={transaction.category} />
                <Detail label="Transfer Status" value={transaction.status} />
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
    borderTopLeftRadius: responsiveWidth(5.33),
    borderTopRightRadius: responsiveWidth(5.33),
    alignSelf: 'center',
    padding: 32,
    backgroundColor: '#fff',
    width: WINDOW_WIDTH,
    borderColor: '#1e1e1e',
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
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
  buttonContainer: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  //Card

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: FONT_SIZES[18],
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
  },

  content: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    borderRadius: 12,
    paddingVertical: WIDTH_SIZES[24],
    paddingHorizontal: WIDTH_SIZES[24],
    marginTop: 10,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: FONT_SIZES[12],
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
  },
  value: {
    fontSize: FONT_SIZES[16],
    marginTop: WIDTH_SIZES[8],
    color: '#1e1e1e',
    fontFamily: 'Rubik-Medium',
  },
  overlayTwo: {
    position: 'absolute',
    top: '3.6%',
    left: '1.6%',
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    zIndex: -1,
    borderWidth: WIDTH_SIZES[1.5],
  },
});

export default TransactionDetailsModal;
