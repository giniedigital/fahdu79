import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, Pressable, Platform, Image, Dimensions} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import AnimatedButton from '../../Components/AnimatedButton';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {useDispatch, useSelector} from 'react-redux';
import {toggleBankDetailsModal, toggleConfirmBankDetails, toggleShowBankDetailsModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {FONT_SIZES, WIDTH_SIZES} from '../../../DesiginData/Utility';
import {useLazyGetShowBankDetailsQuery} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';

const ShowBankDetails = ({visible}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [getShowBankDetails] = useLazyGetShowBankDetailsQuery();
  const [bankDetails, setBankDetails] = useState({});
  const [contentHeight, setContentHeight] = useState(0);
  
  const token = useSelector(state => state.auth.user.token);
  
  // Height calculations
  const buttonHeight = 50; // Approximate height of the button
  const padding = 32; // Dialog padding
  const minModalHeight = 400; // Minimum height you want for the modal
  const maxModalHeight = Dimensions.get('window').height * 0.8; // Maximum height (80% of screen)

  const getBankDetails = async () => {
    const {data, error} = await getShowBankDetails({token});
    if (data?.statusCode === 200) {
      setBankDetails(data?.data);
    }
  };

  useEffect(() => {
    getBankDetails();
  }, []);

  const handleEditDetails = () => {
    dispatch(toggleShowBankDetailsModal({show: false}));
    setTimeout(() => {
      dispatch(toggleBankDetailsModal({show: true}));
    }, 500);
  };

  const handleContentLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  const calculateModalHeight = () => {
    const totalHeight = contentHeight + buttonHeight + padding * 2;
    return Math.min(Math.max(totalHeight, minModalHeight), maxModalHeight);
  };

  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />
        <Dialog 
          visible={visible} 
          dialogStyle={[
            styles.dialog,
            {height: calculateModalHeight() + 50}
          ]} 
          contentStyle={{padding: 0, backgroundColor: '#fff'}} 
          onTouchOutside={() => dispatch(toggleShowBankDetailsModal({show: false}))}
        >
          <View style={styles.dialogContainer} onLayout={handleContentLayout}>
            {/* Header with Title & Edit Icon */}
            <View style={styles.header}>
              <Text style={styles.heading}>Bank Details</Text>
              <Pressable onPress={handleEditDetails}>
                <Image source={require('../../../Assets/Images/ChangeProfile.png')} style={styles.editIcon} />
              </Pressable>
            </View>

            {/* Bank Details List */}
            {[
              {label: 'Beneficiary Name', value: bankDetails?.beneficiaryName},
              {label: 'Account Number', value: bankDetails?.accountNo},
              {label: 'IFSC Code', value: bankDetails?.IFSC},
              {label: 'PAN', value: bankDetails?.PAN},
            ].map((item, index) => (
              <View style={styles.detailItem} key={index}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.valueBold}>{item.value || 'Not provided'}</Text>
              </View>
            ))}

            <View style={styles.buttonWrapper}>
              <AnimatedButton 
                title={'Confirm'} 
                buttonMargin={0} 
                onPress={() => dispatch(toggleShowBankDetailsModal({show: false}))} 
              />
            </View>

            {/* Note */}
            <Text style={styles.note}>
              <Text style={styles.bold}>Note:</Text> Kindly ensure the accuracy of the details you submit, as once submitted, these details will not be changed.
            </Text>

            {/* Contact Info */}
            <Text style={styles.contact}>
              For further enquiry email at <Text style={styles.email}>contact@fahdu.com</Text>
            </Text>
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
  dialogContainer: {
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(4),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: responsiveHeight(2),
  },
  heading: {
    fontSize: FONT_SIZES[20],
    fontFamily: 'Rubik-Bold',
    color: '#1e1e1e',
  },
  editIcon: {
    width: 21,
    height: 21,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: WIDTH_SIZES[16],
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
  },
  valueBold: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-SemiBold',
    color: '#1e1e1e',
  },
  buttonWrapper: {
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
  },
  note: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    marginTop: WIDTH_SIZES[20] + WIDTH_SIZES[2],
  },
  bold: {
    fontFamily: 'Rubik-SemiBold',
  },
  contact: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    marginTop: responsiveHeight(2),
  },
  email: {
    color: '#FFA86B',
    fontFamily: 'Rubik-SemiBold',
  },
});

export default ShowBankDetails;