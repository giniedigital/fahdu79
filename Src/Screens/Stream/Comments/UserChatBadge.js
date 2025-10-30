import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { FONT_SIZES, WIDTH_SIZES } from '../../../../DesiginData/Utility';

const UserChatBadge = ({ name, message, profilePic }) => {
  return (
    <View style={styles.container}>
      <View style = {styles.avatar}>
      <Image source={{ uri: profilePic }} style={{flex : 1}} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1E1E1E50', // Dark transparent background
    padding: 12,
    borderRadius: WIDTH_SIZES[12],
    borderWidth: WIDTH_SIZES[1.5],
    borderColor: '#1E1E1E60',
    maxWidth: '65%', // Prevents stretching
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: WIDTH_SIZES[14],
    borderWidth: WIDTH_SIZES[2],
    borderColor: '#1e1e1e',
    marginRight: 10,
    overflow : 'hidden'
  },
  textContainer: {
    flex: 1, // Ensures proper text wrapping
  },
  name: {
    fontSize: FONT_SIZES[14],
    fontFamily: 'Rubik-SemiBold',
    color: 'white',
    marginBottom: 2,
  },
  message: {
    fontSize: FONT_SIZES[12],
    fontFamily: 'Rubik-Regular',
    color: '#fff',
    lineHeight : 14,
    marginTop : WIDTH_SIZES[4]
  },
});

export default UserChatBadge;
