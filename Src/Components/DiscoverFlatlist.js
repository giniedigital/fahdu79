import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {Image} from 'expo-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {nTwins, WIDTH_SIZES} from '../../DesiginData/Utility';
import {discoverListColor, discoverRecommendDataColor} from '../../DesiginData/Data';
import {navigate} from '../../Navigation/RootNavigation';
import DIcon from '../../DesiginData/DIcons';

const DiscoverFlatlist = ({item, index}) => {
  const [containerDimensions, setContainerDimensions] = useState({width: 0, height: 0});

  const handleGoToOthersProfile = (displayName, userId) => {
    navigate('othersProfile', {
      userName: displayName,
      userId: userId,
      role: 'creator',
    });
  };


  console.log(item, "Discover flatlist user Ids")

  const onContainerLayout = event => {
    const {width, height} = event.nativeEvent.layout;
    setContainerDimensions({width, height});
  };

  return (
    <>
      {/* Overlay */}
      {/* <View
        style={[
          styles.overlayList,
          {
            backgroundColor: discoverListColor[item.niche[0]],
            width: containerDimensions.width, // Set overlay width equal to Pressable container
            height: containerDimensions.height, // Set overlay height equal to Pressable container
            left: '5.2%', // Slightly to the right
            top: '5.5%', // Slightly to the bottom
          },
        ]}
      /> */}

      {/* Pressable Container */}
      <Pressable style={({pressed}) => [styles.recommendationCard, {backgroundColor: pressed ? '#FFEDE0' : 'transparent'}]} onPress={() => handleGoToOthersProfile(item?.displayName, item?._id)} onLayout={onContainerLayout}>
        <View style={styles.profileImage}>
          <Image style={{flex: 1, width: '100%'}} placeholderContentFit="cover" contentFit="cover" placeholder={require('../../Assets/Images/DefaultProfile.jpg')} source={{uri: item?.profile_image?.url}} />
        </View>
        <View style={styles.profileInfo}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: responsiveWidth(0.8)}}>
            <Text style={styles.profileName}>{item?.displayName}</Text>
            <View style={styles.verifyContainer}>
              <Image cachePolicy="memory-disk" source={require('../../Assets/Images/verify.png')} contentFit="contain" style={{flex: 1}} />
            </View>
          </View>
          {/* <Text style={styles.profileCategory}>{item.niche[0]}</Text> */}
        </View>
        <View style={styles.iconContainer} onPress={() => cSetShowPassword(prev => !prev)}>
          <Image source={require('../../Assets/Images/ArrowDiscover.png')} contentFit="contain" style={{flex: 1}} />
        </View>
      </Pressable>
    </>
  );
};

export default DiscoverFlatlist;

const styles = StyleSheet.create({
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(3.73),
    // padding: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    borderWidth: WIDTH_SIZES['2'],
    borderLeftWidth: 0,
    width: responsiveWidth(88),
    alignSelf: 'center',
    height: 56,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: responsiveWidth(2.63),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: WIDTH_SIZES['2'],
  },
  profileInfo: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
  },
  profileName: {
    fontSize: responsiveFontSize(1.97),
    color: '#1e1e1e',
    fontFamily: 'Rubik-SemiBold',
    backgroundColor: 'transparent',
  },
  profileCategory: {
    color: '#1E1E1E',
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.23),
  },

  overlayList: {
    borderRadius: responsiveWidth(4.27),
    backgroundColor: 'red',
    position: 'absolute',
    paddingHorizontal: responsiveWidth(5),
    borderWidth: responsiveWidth(0.4),
  },
  iconContainer: {
    marginRight: responsiveWidth(4),
    height: 19,
    width: 19,
  },
  verifyContainer: {
    width: 15,
    height: 14.32,
  },
});
