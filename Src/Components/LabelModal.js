import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, Pressable, Platform, Image, Dimensions, TouchableOpacity} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import AnimatedButton from '../Components/AnimatedButton';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {useDispatch, useSelector} from 'react-redux';
import {toggleBankDetailsModal, toggleChatRoomLabelEdit, toggleChatRoomModal, toggleConfirmBankDetails, toggleLabelModal, toggleShowBankDetailsModal} from '../../Redux/Slices/NormalSlices/HideShowSlice';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {FONT_SIZES, WIDTH_SIZES} from '../../DesiginData/Utility';
import CustomCheckbox from './CustomCheckbox';
import {resetLabel, setLabel, setSelectedSort} from '../../Redux/Slices/NormalSlices/SortSelectedSlice';
import {sortByLabel} from '../../Redux/Slices/NormalSlices/RoomListSlice';
import {useLabelList} from '../Hook/useLabelList';

const LabelModal = ({setIsOnlineFilterEnabled, isOnlineFilterEnabled, setIsOnline, isOnline}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const token = useSelector(state => state.auth.user.token);
  const [contentHeight, setContentHeight] = useState(0);

  const visible = useSelector(state => state.hideShow.visibility.chatRoomSortModal);

  const lable = useSelector(state => state.sortBy.selected.label);

  const {labelList, getAllLabelNamesHandler} = useLabelList(token);

  console.log(labelList, 'LABLELIST');

  // Height calculations
  const buttonHeight = 50; // Approximate height of the button
  const padding = 32; // Dialog padding
  const minModalHeight = 400; // Minimum height you want for the modal
  const maxModalHeight = Dimensions.get('window').height * 0.8; // Maximum height (80% of screen)

  const handleContentLayout = event => {
    const {height} = event.nativeEvent.layout;
    setContentHeight(height);
  };

  const calculateModalHeight = () => {
    const totalHeight = contentHeight + buttonHeight + padding * 2;
    return Math.min(Math.max(totalHeight, minModalHeight), maxModalHeight);
  };

  const [filters, setFilters] = useState({
    followers: true,
    yellow: false,
    green: false,
    recent: true,
    old: false,
    new: false,
    online: false,
    offline: false,
  });

  /**
   * @UPDATE___STATE
   */

  const [updatesFilter, setUpdateFilter] = useState({
    recent: false,
    old: false,
    new: false,
  });

  const [currentUpdateId, setCurrentUpdateId] = useState(0);

  const current = useSelector(state => state.sortBy.selected.sort);

  function toggleUpdatedCheckbox(key) {
    setCurrentUpdateId(key);

    setUpdateFilter({
      recent: key === 1 ? true : false,
      old: key === 2 ? true : false,
      new: key === 3 ? true : false,
    });
  }

  useEffect(() => {
    setCurrentUpdateId(current);

    setUpdateFilter({
      recent: current === 1 ? true : false,
      old: current === 2 ? true : false,
      new: current === 3 ? true : false,
    });
  }, []);

  /**
   * @ONLINE_OFFLINE_STATE
   */

  const [onlineState, setOnlineState] = useState({
    all: false,
    online: false,
    offline: false,
  });

  const [currentStatusId, setCurrentStatusId] = useState(0);

  function toggleUpdateStatus(key) {
    setCurrentStatusId(key);

    console.log(key);

    setOnlineState({
      all: key === 1 ? true : false,
      online: key === 2 ? true : false,
      offline: key === 3 ? true : false,
    });
  }

  useEffect(() => {
    if (isOnlineFilterEnabled) {
      setOnlineState({
        all: false,
        online: isOnline ? true : false,
        offline: isOnline ? false : true,
      });
    } else {
      setOnlineState({
        all: true,
        online: false,
        offline: false,
      });
    }
  }, []);

  useEffect(() => {
    if (visible) {
      console.log('VISIBLE', visible);
      getAllLabelNamesHandler();
    }
  }, [visible]);

  const handleDone = () => {
    console.log('updateing labgel', currentUpdateId);

    dispatch(setSelectedSort({sortNumber: currentUpdateId}));

    dispatch(toggleChatRoomModal());

    if (currentStatusId === 1) {
      setIsOnlineFilterEnabled(false);
    }

    if (currentStatusId === 2 || currentStatusId === 3) {
      setIsOnlineFilterEnabled(true);
      setIsOnline(currentStatusId === 2 ? true : false);
    }

    dispatch(sortByLabel({data: lable}));
  };

  const handleReset = () => {
    console.log('Reset');
    setUpdateFilter({
      recent: true,
      old: false,
      new: false,
    });

    setOnlineState({
      all: true,
      online: false,
      offline: false,
    });

    dispatch(resetLabel());
  };

  const handlePress = () => {
    console.log('hello');

    dispatch(toggleChatRoomModal());

    setTimeout(() => {
      dispatch(toggleChatRoomLabelEdit({show: true}));
    }, 500);
  };

  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />
        <Dialog visible={visible} dialogStyle={[styles.dialog, {height: calculateModalHeight() + 300}]} contentStyle={{padding: 0, backgroundColor: '#fff'}} onTouchOutside={() => dispatch(toggleChatRoomModal())}>
          <View style={[styles.section, {paddingVertical: 0, paddingBottom: WIDTH_SIZES[16], paddingTop: 0}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: WIDTH_SIZES[16]}}>
              <Text style={[styles.heading, {marginBottom: 0}]}>LABELS</Text>
              <TouchableOpacity onPress={handlePress}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* <View style={styles.row}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 9}}>
                <View style={[styles.icon, {backgroundColor: '#BBBBFE'}]} />
                <Text style={styles.label}>Purple</Text>
              </View>

              <CustomCheckbox checked={lable === 'LABEL1'} onToggle={() => dispatch(setLabel({label: 'LABEL1'}))} />
            </View>
            <View style={styles.row}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 9}}>
                <View style={[styles.icon, {backgroundColor: '#FBF7A6'}]} />
                <Text style={styles.label}>Yellow</Text>
              </View>

              <CustomCheckbox checked={lable === 'LABEL2'} onToggle={() => dispatch(setLabel({label: 'LABEL2'}))} />
            </View>
            <View style={styles.rowLast}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 9}}>
                <View style={[styles.icon, {backgroundColor: '#98FF98'}]} />
                <Text style={styles.label}>Green</Text>
              </View>

              <CustomCheckbox checked={lable === 'LABEL3'} onToggle={() => dispatch(setLabel({label: 'LABEL3'}))} />
            </View> */}

            {labelList.map((label, index) => (
              <View
                key={label.id}
                style={[
                  styles.row,
                  index === labelList.length - 1 && styles.rowLast, // optional last-row styling
                ]}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 9}}>
                  <View style={[styles.icon, {backgroundColor: label.color}]} />
                  <Text style={styles.label}>{label.name}</Text>
                </View>

                <CustomCheckbox checked={lable === label.labelName} onToggle={() => dispatch(setLabel({label: label.labelName}))} />
              </View>
            ))}
          </View>

          {/* Updates */}
          <View style={styles.section}>
            <Text style={styles.heading}>UPDATES</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Recent</Text>
              <CustomCheckbox checked={updatesFilter.recent} onToggle={() => toggleUpdatedCheckbox(1)} />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Old</Text>
              <CustomCheckbox checked={updatesFilter.old} onToggle={() => toggleUpdatedCheckbox(2)} />
            </View>
            <View style={styles.rowLast}>
              <Text style={styles.label}>New</Text>
              <CustomCheckbox checked={updatesFilter.new} onToggle={() => toggleUpdatedCheckbox(3)} />
            </View>
          </View>

          {/* Status */}
          <View style={[styles.section, {borderBottomWidth: 0}]}>
            <Text style={styles.heading}>STATUS</Text>

            <View style={styles.row}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 9}}>
                <View style={[styles.icon, {backgroundColor: '#48CAE4'}]} />
                <Text style={styles.label}>All</Text>
              </View>

              <CustomCheckbox checked={onlineState.all} onToggle={() => toggleUpdateStatus(1)} />
            </View>

            <View style={styles.row}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 9}}>
                <View style={[styles.icon, {backgroundColor: '#2FD159'}]} />
                <Text style={styles.label}>Online</Text>
              </View>

              <CustomCheckbox checked={onlineState.online} onToggle={() => toggleUpdateStatus(2)} />
            </View>

            <View style={styles.rowLast}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 9}}>
                <View style={[styles.icon, {backgroundColor: '#FF4539'}]} />
                <Text style={styles.label}>Offline</Text>
              </View>

              <CustomCheckbox checked={onlineState.offline} onToggle={() => toggleUpdateStatus(3)} />
            </View>
          </View>

          <View style={{width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: WIDTH_SIZES[32]}}>
            <View style={{flexBasis: '44%'}}>
              <AnimatedButton title={'Reset'} onPress={() => handleReset()} buttonMargin={Platform.OS === 'android' ? 0 : 0} style={{backgroundColor: '#fff'}} showOverlay={false} highlightOnPress={true} highlightColor="#FFF3EB" />
            </View>
            <View style={{flexBasis: '44%'}}>
              <AnimatedButton title={'Done'} onPress={() => handleDone()} buttonMargin={Platform.OS === 'android' ? 0 : 0} loading={loading} showOverlay={false} highlightOnPress={true} highlightColor="#FFC399" />
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
    paddingTop: 32,
    backgroundColor: '#fff',
    width: WINDOW_WIDTH,
    position: 'absolute',
    bottom: -30,
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

  //new
  section: {
    borderBottomWidth: WIDTH_SIZES[1.5],
    paddingHorizontal: WIDTH_SIZES[32],
    borderBottomColor: '#E9E9E9',
    paddingVertical: WIDTH_SIZES[16],
  },
  heading: {
    fontFamily: 'Rubik-Medium',
    color: '#D9D9D9',
    marginBottom: WIDTH_SIZES[16],
    fontSize: FONT_SIZES[14],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 17,
  },
  rowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    fontSize: FONT_SIZES[14],
  },
  edit: {
    fontFamily: 'Rubik-Regular',
    color: '#1E1E1E',
    textDecorationLine: 'underline',
    fontSize: FONT_SIZES[12],
  },
  icon: {
    height: WIDTH_SIZES[14],
    width: WIDTH_SIZES[14],
    borderWidth: WIDTH_SIZES[1.5],
    borderColor: '#1e1e1e',
    borderRadius: responsiveWidth(30),
  },
});

export default LabelModal;
