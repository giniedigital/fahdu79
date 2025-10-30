import React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import {BlurView} from 'expo-blur';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import AnimatedButton from '../../Components/AnimatedButton';
import {toggleEmailVerificationModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {useDispatch} from 'react-redux';
import {FONT_SIZES, nTwins, WIDTH_SIZES} from '../../../DesiginData/Utility';
import DatePicker from 'react-native-date-picker';
import {useState} from 'react';
import dayjs from 'dayjs'; // optional for formatting

const TimeRequestModal = ({visible = false }) => {
  const dispatch = useDispatch();

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />
        <Dialog visible={visible} dialogStyle={styles.dialog} contentStyle={{padding: 0, paddingTop: 0}} onTouchOutside={() => dispatch(toggleEmailVerificationModal({show: false}))}>
          <View style={styles.content}>
            <Text style={styles.title}>Call Back Availability Date & Time</Text>

            {/* Date Time Picker Field */}
            <TouchableOpacity style={styles.dateTimeInput} onPress={() => setOpen(true)}>
              <Text style={[styles.placeholderText, formattedDate && {color: '#1e1e1e'}]}>{formattedDate ? dayjs(date).format('DD MMM YYYY, hh:mm A') : 'Select date & time'}</Text>
              <Feather name="calendar" size={20} color="#000" />
            </TouchableOpacity>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <View style={{width: '48%'}}>
                <AnimatedButton title={'Save'} buttonMargin={0} showOverlay={false} style={[styles.button, styles.saveButton]} />
              </View>
              <View style={{width: '48%'}}>
                <AnimatedButton title={'Cancel'} buttonMargin={0} showOverlay={false} style={[styles.button, styles.cancelButton]} />
              </View>
            </View>
          </View>
        </Dialog>
        <DatePicker
          modal
          open={open}
          date={date}
          mode="datetime"
          minimumDate={new Date()}
          onConfirm={selectedDate => {
            setOpen(false);
            setDate(selectedDate);
            setFormattedDate(selectedDate.toISOString()); // ISO format for return
            console.log('ISO Date:', selectedDate.toISOString());
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  dialog: {
    borderRadius: responsiveWidth(5.33),
    alignSelf: 'center',
    backgroundColor: '#fff',
    width: nTwins(88, 92),
    padding: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveHeight(3),
  },
  title: {
    fontFamily: 'Rubik-Bold',
    fontSize: FONT_SIZES['16'],
    color: '#1e1e1e',
    textAlign: 'center',
  },
  dateTimeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#1e1e1e',
    borderWidth: WIDTH_SIZES['1.5'],
    borderRadius: WIDTH_SIZES['14'],
    paddingVertical: 16,
    paddingHorizontal: 15,
    width: '100%',
  },
  placeholderText: {
    color: '#aaa',
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.8),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    height: responsiveHeight(5.91),
    backgroundColor: '#fff', // Default white, override as needed
  },
  saveButton: {
    backgroundColor: '#FFB377',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#1e1e1e',
  },
});

export default TimeRequestModal;
