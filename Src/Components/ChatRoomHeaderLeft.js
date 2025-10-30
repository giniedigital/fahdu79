import {Alert, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';

import {useDispatch, useSelector} from 'react-redux';

import DIcon from '../../DesiginData/DIcons';
import SVGs from '../../Assets/svg/newLogo.svg';
import {toggleSwitchBottomSheet} from '../../Redux/Slices/NormalSlices/HideShowSlice';

import {Image} from 'expo-image';

const ChatRoomHeaderLeft = () => {
  const dispatch = useDispatch();
  const {role: loggedInUserRole, onlyBrandsAccess} = useSelector(state => state.auth.user);

  console.log(loggedInUserRole, '++++');

  return (
    <View style={styles.headerLeftWrapper}>
      <Pressable style={styles.headerLeftContentContainer} disabled={loggedInUserRole === 'creator' ? false : true}>
        {Platform.OS === 'ios' ? (
          <View style={styles.iconContainer}>
            <Image source={require('../../Assets/Images/fahduLogoNew.png')} contentFit="contain" style={{flex: 1}} />
          </View>
        ) : (
          <View style={[styles.iconContainer, {left : -19}]}>
            <Image source={require('../../Assets/Images/fahduLogoNew.png')} contentFit="contain" style={{flex: 1}} />
          </View>
        )}
        <View>{loggedInUserRole === 'creator' && <DIcon provider={'FontAwesome5'} name={'angle-down'} style={{display: 'none'}} />}</View>
      </Pressable>
    </View>
  );
};

export default ChatRoomHeaderLeft;

const styles = StyleSheet.create({
  headerLeftWrapper: {
    height: responsiveWidth(12),
    width: '50%',
    justifyContent: 'center',
    marginLeft: 23,
    // backgroundColor : 'green',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerLeftContentContainer: {
    borderColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: responsiveWidth(1),
    // borderWidth : 1,
    width: responsiveWidth(28),
  },

  profileImage: {
    width: '100%',
    resizeMode: 'cover',
    height: '100%',
  },

  status: {
    fontSize: responsiveFontSize(1.6),
    letterSpacing: 0.5,
    color: '#282828',
    fontFamily: 'MabryPro-Regular',
  },

  fahduLogo: {
    fontFamily: 'FahduFont-Logo',
    fontSize: responsiveFontSize(3.3),
    color: '#FFA07A',
  },
  logoImage: {
    width: 900,
    height: 200,
    marginTop: 20,
    flex: 1,
  },
  iconContainer: {
    height: 40,
    width: 35,
    left: 2,
  },
});
