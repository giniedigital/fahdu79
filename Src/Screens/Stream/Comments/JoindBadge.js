import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { Image } from 'expo-image';
import { FONT_SIZES, WIDTH_SIZES } from '../../../../DesiginData/Utility';

const JoindBadge = ({ name, profilePic, role }) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {/* Wrap the avatar Image in a container */}
        <View style={styles.avatarWrapper}>
          {profilePic && <Image source={{ uri: profilePic }} style={styles.avatar} />}
        </View>
        {/* Badge positioned relative to the avatarWrapper */}
        {role === "creator" && (

            <Image
              source={require('../../../../Assets/Images/verify.png')} // Replace with your badge image path
              style={styles.badge}

            />

        )}
      </View>

      <Text style={styles.text}>
        <Text style={styles.bold}>{name} Joined</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E80',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: WIDTH_SIZES[20],
    borderWidth: WIDTH_SIZES[2],
    borderColor: '#1E1E1E99',
    height: 43,
    alignSelf: 'flex-start', // Ensures it only takes required width
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 8,
  },
  avatarWrapper: {
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    borderRadius: WIDTH_SIZES[208], // Matches your previous design
    borderWidth: WIDTH_SIZES[1.5],
    borderColor: '#1E1E1E',
    overflow: 'hidden', // Ensure the avatar is clipped within the rounded corners
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    bottom: 16, // Adjust positioning as needed
    right: 0,
    width: WIDTH_SIZES[14], // Adjust size accordingly
    height: WIDTH_SIZES[14],
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeImage: {
    width: '100%', // Cover the entire badge container
    height: '100%',
  },
  text: {
    color: 'white',
    fontSize: FONT_SIZES[14],
    fontFamily: 'Rubik-Regular',
    flexShrink: 1, // Prevents unnecessary stretching
  },
  bold: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: FONT_SIZES[14],
  },
});

export default JoindBadge;