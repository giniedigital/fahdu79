import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Pressable, Platform, Linking} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { openSettings } from 'react-native-permissions';


const NotificationHeader = () => {
  const [hide, setHide] = useState(false);

  const onClose = x => {
    console.log(x);
    setHide(x)
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'ios') {
        // For iOS, use openSettings from react-native-permissions
        openSettings().catch(() => console.warn('Cannot open settings'));
      } else {
        // For Android, open notification settings using Linking
        Linking.openSettings().catch(() => console.warn('Cannot open settings'));
      }
  };
  

  if (!hide) {
    return (
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Ionicons name="notifications-off-outline" size={24} color="black" />
        </View>
        <Pressable style={styles.textWrapper} onPress={requestNotificationPermission}>
          <Text style={styles.title}>Turn On Notifications</Text>
          <Text style={styles.subtitle}>Don't miss any updates or messages!</Text>
        </Pressable>
        <TouchableOpacity onPress={() => onClose(true)} style={styles.closeButton}>
          <Ionicons name="close" size={22} color="black" />
        </TouchableOpacity>
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 10,
    // marginVertical: responsiveWidth(2),
    marginBottom : responsiveWidth(2)
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFA86B', // Yellow background
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Rubik-Medium',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: '#555',
  },
  closeButton: {
    padding: 8,
  },
});

export default NotificationHeader;
