import {StyleSheet, View, TouchableOpacity, Text, Pressable, ActivityIndicator} from 'react-native';
import React, {useMemo, useCallback, useRef, useState} from 'react';
import {responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import BottomSheet from '@gorhom/bottom-sheet';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {toggleDateTimePicker} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {padios} from '../../../DesiginData/Utility';
import {Image} from 'expo-image';
import AnimatedButton from '../AnimatedButton';

const DateTimePickerSheet = ({date, setDate, type}) => {
  const bottomSheetRef = useRef(null);

  const dispatch = useDispatch();

  const dateTimeVisibility = useSelector(state => state.hideShow.visibility.dateTimePicker);

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      dispatch(toggleDateTimePicker({show: -1}));
    } else if (index === 1) {
      dispatch(toggleDateTimePicker({show: 1}));
    }
  }, []);

  // const today = new Date();
  // const minDate = new Date(
  //   today.getFullYear() - 16, // Subtract 16 years
  //   today.getMonth(),
  //   today.getDate(),
  // );


    // Calculate the maximum date (16 years ago from today)
    const currentDate = new Date();
    const maxDate = new Date(
      currentDate.getFullYear() - 16, // Subtract 16 years
      currentDate.getMonth(),
      currentDate.getDate()
    );

  return (
    <BottomSheet handleIndicatorStyle={{display: 'none'}} snapPoints={snapPoints} ref={bottomSheetRef} index={dateTimeVisibility} onChange={handleSheetChanges} enablePanDownToClose={true} backgroundStyle={{backgroundColor: '#fff'}}>
      <View style={styles.contentContainer}>
        <View style={styles.mainContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.heading}>{type === 'dob' ? 'Date of Birth' : 'Schedule your post'}</Text>

            <Text style={styles.description}>Choose the date below.</Text>
          </View>
          <TouchableOpacity style={{height: 12, width: 12}} onPress={() => bottomSheetRef.current.close()}>
            <Image source={require('../../../Assets/Images/Crosss.png')} contentFit="contain" style={{flex: 1}} />
          </TouchableOpacity>
        </View>

    
        <DatePicker
        date={date}
        maximumDate={type === 'dob' ? maxDate : null} // Conditional maximum date
        onDateChange={setDate}
        style={{ alignSelf: 'center', width: 420 }}
        mode={type === 'dob' ? 'date' : 'datetime'} // Conditional mode
        textColor="#282828"
        theme="light"
        androidVariant="iosClone"
      />
        <View style={{width: responsiveWidth(87.5), alignSelf: 'center'}}>
          <AnimatedButton title={'Proceed'} showOverlay={true} buttonMargin={0} onPress={() => bottomSheetRef.current.close()} />
        </View>
      </View>
    </BottomSheet>
  );
};

export default DateTimePickerSheet;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#fff',
    height: '100%',
    paddingHorizontal: responsiveWidth(2),
  },
  title: {
    fontFamily: 'Lexend-Medium',
    textAlign: 'center',
    color: '#FF9E99',
    fontSize: responsiveFontSize(2.2),
  },
  notePoints: {
    fontFamily: 'MabryPro-Medium',
    color: '#282828',
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontFamily: 'Lexend-Medium',
    textAlign: 'center',
    color: '#FF9E99',
    fontSize: responsiveFontSize(2.5),
  },

  titleTwo: {
    fontFamily: 'MabryPro-Regular',
    textAlign: 'center',
    color: '#282828',
    fontSize: responsiveFontSize(2),
    marginVertical: responsiveWidth(4),
  },
  sendTipInputContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    borderRadius: responsiveWidth(2),
    borderColor: '#282828',
    marginTop: responsiveWidth(4),
    alignSelf: 'center',
  },
  amountInput: {
    flexBasis: '70%',
    color: '#282828',
    fontFamily: 'MabryPro-Regular',
    fontSize: responsiveFontSize(2.2),
  },

  loginButton: {
    borderWidth: 1,
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#ffa07a',
    marginTop: responsiveWidth(4),
    borderRadius: responsiveWidth(2),
    color: '#282828',
    textAlign: 'center',
    fontFamily: 'Lexend-Medium',
    elevation: 1,
    fontWeight: '600',
    width: responsiveWidth(35),
    height: responsiveWidth(12),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderTopColor: '#282828',
    borderLeftColor: '#282828',
    elevation: 1,
    fontSize: responsiveFontSize(2.8),
  },
  loginButton: {
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#ffa07a',
    borderRadius: responsiveWidth(2),
    color: '#282828',
    textAlign: 'center',
    fontFamily: 'MabryPro-Bold',
    elevation: 1,
    fontWeight: '600',
    width: responsiveWidth(32),
    height: responsiveWidth(10),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderTopColor: '#282828',
    borderLeftColor: '#282828',
    elevation: 1,
    fontSize: responsiveFontSize(2.4),
    padding: padios(responsiveWidth(2.6)),
    overflow: 'hidden',
    marginTop: responsiveWidth(1),
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  textContainer: {
    flex: 1, // Allows text to take remaining space
  },
  heading: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 18,
    color: '#1e1e1e',
  },
  description: {
    fontFamily: 'Rubik-Regular',
    fontSize: 12,
    color: '#1e1e1e',
    marginTop: 5,
  },
  closeButton: {
    padding: 8, // Gives some touchable area around the icon
  },
});
