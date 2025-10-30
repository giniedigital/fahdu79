import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {Image} from 'expo-image';
import {FONT_SIZES, WIDTH_SIZES} from '../../../../DesiginData/Utility';

const TippedBadge = ({name, amount, profilePic, role}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {profilePic && (
          <View style={styles.avatar}>
            <Image source={{uri: profilePic}} style={{flex: 1}} />
          </View>
        )}
        {role === 'creator' && (
          <Image
            source={require('../../../../Assets/Images/verify.png')} // Replace with your badge image path
            style={styles.badge}
          />
        )}
      </View>

      <Text style={styles.text}>
        {name} Tipped <Text style={styles.bold}>{`${amount} Coins`}</Text>
      </Text>

      {/* <View style={styles.verifyContainer}>
        <Image
          cachePolicy="memory-disk"
          source={require('../../../../Assets/Images/Coins2.png')}
          contentFit="contain"
          style={{ flex: 1 }}
        />
      </View> */}
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
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 8,
  },
  avatar: {
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    borderRadius: WIDTH_SIZES[208], // Matches your previous design
    borderWidth: WIDTH_SIZES[1.5],
    borderColor: '#1E1E1E',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    bottom: WIDTH_SIZES[18],
    right: 0,
    width: WIDTH_SIZES[14], // Adjust size accordingly
    height: WIDTH_SIZES[14],
  },
  text: {
    color: 'white',
    fontSize: FONT_SIZES[14],
    fontFamily: 'Rubik-Regular',
  },
  bold: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: FONT_SIZES[14],
  },
  verifyContainer: {
    height: WIDTH_SIZES[16],
    width: WIDTH_SIZES[16],
    marginLeft: WIDTH_SIZES[4],
  },
});

export default TippedBadge;
