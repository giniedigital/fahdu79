import {StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import React, {useCallback} from 'react';
import DIcon from '../../../DesiginData/DIcons';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {useSelector, useDispatch} from 'react-redux';

import {toggleChatRoomModal, toggleManageRevenueDashboard} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {WIDTH_SIZES} from '../../../DesiginData/Utility';

const ManageRevenueDashboardHeaderRight = () => {
  const dispatch = useDispatch();

  const handleShowManageRevenueDashboardSheet = useCallback(() => {
    dispatch(toggleChatRoomModal());
  }, []);

  return (
    <TouchableOpacity style={styles.filterContainer} onPress={handleShowManageRevenueDashboardSheet}>
      <Image source={require('../../../Assets/Images/hamBurgerNew.png')} style={{height: WIDTH_SIZES[16], width: WIDTH_SIZES[16], resizeMode: 'contain', alignSelf: 'center'}} />
    </TouchableOpacity>
  );
};

export default ManageRevenueDashboardHeaderRight;

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: responsiveWidth(1),
  },
  text: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'MabryPro-Bold',
    color: '#282828',
  },
});
