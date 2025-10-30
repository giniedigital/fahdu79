import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { WIDTH_SIZES } from '../../../../DesiginData/Utility';

const CreatorChatBadge = ({ name, message, profilePic }) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        
        <View style ={styles.avatar}>
        <Image source={{ uri: profilePic }} style={{flex : 1}} />
        </View>


        <Image 
          source={require('../../../../Assets/Images/verify.png')} 
          style={styles.verifiedBadge} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text  style={styles.name}>{name}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    borderWidth: WIDTH_SIZES[2],
    borderColor: '#1e1e1e',
    maxWidth: '65%',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#1e1e1e',
    overflow : 'hidden'
  },
  verifiedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: WIDTH_SIZES[18],
    height: WIDTH_SIZES[18],
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    color: '#1e1e1e',
    marginBottom: 2,
    includeFontPadding : false
  },
  message: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
    includeFontPadding : false
  },
});

export default CreatorChatBadge;
