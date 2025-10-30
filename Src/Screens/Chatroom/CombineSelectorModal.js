import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, Pressable, Platform, Image, Dimensions} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {useDispatch, useSelector} from 'react-redux';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {toggleChatRoomLabelEdit, toggleCombineSelectorModal, toggleFloatingViews, toggleShowChatRoomSelector} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {sortByLabel} from '../../../Redux/Slices/NormalSlices/RoomListSlice';
import {setLabel, setSelectedSort} from '../../../Redux/Slices/NormalSlices/SortSelectedSlice';
import CustomCheckbox from '../../Components/CustomCheckbox';
import {FONT_SIZES, WIDTH_SIZES} from '../../../DesiginData/Utility';
import AnimatedButton from '../../Components/AnimatedButton';
import {useLazyGetAllLabelNameQuery} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {setMassMessageLabel, setMassMessageTargetOnlinleOffline} from '../../../Redux/Slices/NormalSlices/MessageSlices/MassMessage';
import {navigate} from '../../../Navigation/RootNavigation';
import {useLabelList} from '../../Hook/useLabelList';

const CombineSelectorModal = ({setIsOnlineFilterEnabled, isOnlineFilterEnabled, setIsOnline, isOnline}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const token = useSelector(state => state.auth.user.token);
  const [contentHeight, setContentHeight] = useState(0);

  const visible = useSelector(state => state.hideShow.visibility.combineSelectorModal);

  const lable = useSelector(state => state.massMessage.data.target.label);

  const status = useSelector(state => state.massMessage.data.status);

  const {labelList, getAllLabelNamesHandler} = useLabelList(token);

  console.log(status, 'P');

  const [getAllLabelNames] = useLazyGetAllLabelNameQuery();

  // const [labelList, setLabelList] = useState([
  //   {
  //     id: 1,
  //     name: 'Purple',
  //     color: '#BBBBFE',
  //     iconName: 'back-in-time',
  //     labelName: 'LABEL1',
  //   },
  //   {
  //     id: 2,
  //     name: 'Yellow',
  //     color: '#FBF7A6',
  //     iconName: 'arrow-down',
  //     labelName: 'LABEL2',
  //   },
  //   {
  //     id: 3,
  //     name: 'Green',
  //     iconName: 'mail-unread-outline',
  //     color: '#98FF98',
  //     labelName: 'LABEL3',
  //   },
  // ]);

  // Height calculations
  const buttonHeight = 50;
  const padding = 32;
  const minModalHeight = 400;
  const maxModalHeight = Dimensions.get('window').height * 0.8;

  const handleContentLayout = event => {
    const {height} = event.nativeEvent.layout;
    setContentHeight(height);
  };

  const calculateModalHeight = () => {
    const totalHeight = contentHeight + buttonHeight + padding * 2;
    return Math.min(Math.max(totalHeight, minModalHeight), maxModalHeight);
  };

  const handlePress = () => {
    console.log('hello');

    dispatch(toggleCombineSelectorModal({show: false}));

    setTimeout(() => {
      dispatch(toggleChatRoomLabelEdit({show: true}));
    }, 500);
  };

  const handleRandomSelection = () => {
    dispatch(toggleShowChatRoomSelector({show: true}));

    // setTimeout(() => {
    dispatch(toggleCombineSelectorModal({show: false}));

    setTimeout(() => {
      dispatch(toggleFloatingViews({show: 'showSelected'}));
    }, 500);
  };

  const handleSelection = () => {
    // dispatch(toggleShowChatRoomSelector({show : true}))

    dispatch(toggleCombineSelectorModal({show: false}));

    setTimeout(() => {
      // dispatch(toggleFloatingViews({show : "showSelected"}))

      navigate('massMessageMedia');
    }, 500);
  };

  useEffect(() => {
    if (visible) {
      console.log('VISIBLE', visible);
      getAllLabelNamesHandler();
    }
  }, [visible]);

  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />
        <Dialog visible={visible} dialogStyle={[styles.dialog, {height: calculateModalHeight() + 300}]} contentStyle={{padding: 0, backgroundColor: '#fff'}} onTouchOutside={() => dispatch(toggleCombineSelectorModal({show: false}))}>
          <View style={[styles.section, {paddingVertical: 0, paddingBottom: WIDTH_SIZES[16], paddingTop: 0}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: WIDTH_SIZES[16]}}>
              <Text style={[styles.heading, {marginBottom: 0}]}>LABELS</Text>
            </View>

            <View style={styles.row}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 9}}>
                <View style={[styles.icon, {backgroundColor: '#BBBBFE'}]} />
                <Text style={styles.label}>{labelList[0]?.name}</Text>
              </View>

              <CustomCheckbox checked={lable.includes(labelList[0]?.labelName)} onToggle={() => dispatch(setMassMessageLabel({label: labelList[0]?.labelName}))} />
            </View>
            <View style={styles.row}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 9}}>
                <View style={[styles.icon, {backgroundColor: '#FBF7A6'}]} />
                <Text style={styles.label}>{labelList[1]?.name}</Text>
              </View>

              <CustomCheckbox checked={lable.includes(labelList[1]?.labelName)} onToggle={() => dispatch(setMassMessageLabel({label: labelList[1]?.labelName}))} />
            </View>
            <View style={styles.rowLast}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 9}}>
                <View style={[styles.icon, {backgroundColor: '#98FF98'}]} />
                <Text style={styles.label}>{labelList[2]?.name}</Text>
              </View>

              <CustomCheckbox checked={lable.includes(labelList[2]?.labelName)} onToggle={() => dispatch(setMassMessageLabel({label: labelList[2]?.labelName}))} />
            </View>
          </View>

          {/* Status */}
          <View style={[styles.section, {borderBottomWidth: 0}]}>
            <Text style={styles.heading}>STATUS</Text>

            <View style={styles.row}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 9}}>
                <View style={[styles.icon, {backgroundColor: '#2FD159'}]} />
                <Text style={styles.label}>Online</Text>
              </View>

              <CustomCheckbox checked={status.online} onToggle={() => dispatch(setMassMessageTargetOnlinleOffline({status: {online: true, offline: false}}))} />
            </View>

            <View style={styles.rowLast}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 9}}>
                <View style={[styles.icon, {backgroundColor: '#FF4539'}]} />
                <Text style={styles.label}>Offline</Text>
              </View>

              <CustomCheckbox checked={status.offline} onToggle={() => dispatch(setMassMessageTargetOnlinleOffline({status: {online: false, offline: true}}))} />
            </View>
          </View>

          {/* <View style={{width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: WIDTH_SIZES[32]}}>
            <View style={{flexBasis: '44%'}}>
              <AnimatedButton title={'Reset'} onPress={() => handleReset()} buttonMargin={Platform.OS === 'android' ? 0 : 0} style={{backgroundColor: '#fff'}} showOverlay={false} />
            </View>
            <View style={{flexBasis: '44%'}}>
              <AnimatedButton title={'Done'} onPress={() => handleDone()} buttonMargin={Platform.OS === 'android' ? 0 : 0} loading={loading} showOverlay={false} />
            </View>
          </View> */}

          <View style={{paddingHorizontal: WIDTH_SIZES[32]}}>
            <AnimatedButton title={'Select Random Audience'} showOverlay={false} style={{backgroundColor: '#fff', alignSelf: 'center'}} onPress={handleRandomSelection} highlightOnPress={true} highlightColor="#FFF3EB" />
          </View>

          <View style={{paddingHorizontal: WIDTH_SIZES[32]}}>
            <AnimatedButton title={'Done'} style={{alignSelf: 'center'}} showOverlay={false} onPress={handleSelection} highlightOnPress={true} highlightColor="#FFC399" />
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

export default CombineSelectorModal;
