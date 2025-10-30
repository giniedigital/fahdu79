import {StyleSheet, View} from 'react-native';
import React from 'react';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {Image} from 'expo-image';

const iconsObject = {
  messages: require('./../Assets/svg/Tabsvgs/messages.png'),
  messagesFocus: require('./../Assets/svg/Tabsvgs/messagesfocus.png'),
  createpostbottomtab: require('./../Assets/svg/Tabsvgs/add.png'),
  createpostbottomtabFocus: require('./../Assets/svg/Tabsvgs/add.png'),
  home: require('./../Assets/svg/Tabsvgs/home.png'),
  homeFocus: require('./../Assets/svg/Tabsvgs/homefocus.png'),
  dashboard: require('../Assets/Images/dashboard.png'),
  dashboardFocus: require('../Assets/Images/dashboardFocus.png'),
  profile: require('../Assets/Images/Coin.png'),
  profileFocus: require('../Assets/Images/Coin.png'),
  discover: require('./../Assets/svg/Tabsvgs/discover.png'),
  discoverFocus: require('./../Assets/svg/Tabsvgs/discoverfocus.png'),
  notifications: require('./../Assets/Images/notifications.png'),
  notificationsFocus: require('./../Assets/Images/notificationsfocus.png'),
};

const BottomNavigationIcons = props => {
  const userProfileUrl = useSelector(state => state.auth.user.currentUserProfilePicture);

  let iconName = iconsObject[props.iconName] || null;

  // Special cases for profile and create post button
  if (props.iconName === 'profile' || props.iconName === 'profileFocus') {
    iconName = 'url';
  } else if (props.iconName === 'createpostbottomtab' || props.iconName === 'createpostbottomtabFocus') {
    iconName = 'same';
  }

  return (
    <View style={styles.iconContainer}>
      {iconName === 'url' ? (
        <View style={{height: responsiveWidth(6), width: responsiveWidth(6), borderRadius: responsiveWidth(5), overflow: 'hidden', borderWidth: 1.5}}>
          <Image source={{uri: userProfileUrl}} placeholder={require('../Assets/Images/DefaultProfile.jpg')} contentFit="contain" style={{flex: 1}} />
        </View>
      ) : iconName === 'same' ? (
        <Image source={iconsObject.createpostbottomtabFocus} style={styles.createPostIcon} />
      ) : (
        <Image source={iconName} style={styles.defaultIcon} />
      )}
    </View>
  );
};

export default BottomNavigationIcons;

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    padding: 20,
  },

  createPostIcon: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    resizeMode: 'contain',
    // marginBottom: responsiveWidth(4),
  },
  defaultIcon: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    resizeMode: 'contain',
  },
});
