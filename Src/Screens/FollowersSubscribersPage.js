import {StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, Platform} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {useLazyGetFSDQuery, useLazyGetFSQuery, useLazyIsValidFollowQuery} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import LinearGradient from 'react-native-linear-gradient';
import DIcon from '../../DesiginData/DIcons';
import {Image} from 'expo-image';
import {navigate} from '../../Navigation/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FONT_SIZES, WIDTH_SIZES} from '../../DesiginData/Utility';

const EachList = ({item, index, followersLength, handleGoToOthersProfile}) => {
  console.log(':::::', item?.userDetails?.displayName);

  if (item?.userDetails?.displayName !== undefined) {
    return (
      // <>
      //   <Pressable style={styles.eachListContainer} android_ripple={{color: 'white'}} onPress={() => handleGoToOthersProfile(item?.userDetails?.displayName, item?.userDetails?._id, item?.userDetails?.role)}>
      //     <View style={styles.imageContainer}>
      //       <Image placeholderContentFit="cover" placeholder={require('../../Assets/Images/DefaultProfile.jpg')} source={{uri: item?.userDetails?.profile_image?.url}} resizeMethod="resize" contentFit="cover" style={styles.profileImage} />
      //       {item?.userDetails?.role === 'creator' ? (
      //         <View style={{position: 'absolute', transform: [{translateX: responsiveWidth(8.4)}, {translateY: responsiveWidth(-5)}]}}>
      //           <DIcon provider={'MaterialIcons'} name={'verified'} color="#FFA07A" size={responsiveWidth(4.5)} />
      //         </View>
      //       ) : null}
      //     </View>

      //     <View style={styles.detailContainer}>
      //       <Text style={styles.name}>{item?.userDetails?.fullName}</Text>
      //       <Text style={styles.userName}>@{item?.userDetails?.displayName}</Text>
      //     </View>
      //   </Pressable>
      //   <LinearGradient colors={['#FFFDF650', '#43423D50', '#FFFDF650']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.linearGradient}>
      //     <View style={index === followersLength - 1 ? {height: 0} : {height: 1}} />
      //   </LinearGradient>
      // </>
      <Pressable style={styles.listItem} onPress={() => handleGoToOthersProfile(item?.userDetails?.displayName, item?.userDetails?._id, item?.userDetails?.role)}>
        <View style={styles.imageContainer}>
          <Image source={{uri: item?.userDetails?.profile_image?.url}} style={styles.profileImage} placeholderContentFit="contain" placeholder={require('../../Assets/Images/DefaultProfile.jpg')} contentFit="cover" />
        </View>

        <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: responsiveWidth(0.8)}}>
            <Text style={styles.name}>{item?.userDetails?.fullName}</Text>
            {item?.userDetails?.role === 'creator' && (
              <View style={styles.verifyContainer}>
                <Image cachePolicy="memory-disk" source={require('../../Assets/Images/verify.png')} contentFit="contain" style={{flex: 1}} />
              </View>
            )}
          </View>
          <Text style={styles.username}>{item?.userDetails?.displayName}</Text>
        </View>
      </Pressable>
    );
  }
};

const FollowersSubscribersPage = ({route, navigation}) => {
  const [getFS] = useLazyGetFSQuery();

  const [getFSD] = useLazyGetFSDQuery();

  const [isValidFollow] = useLazyIsValidFollowQuery();

  const [isActive, setIsActive] = useState(true);

  const [followers, setFollowers] = useState([]);

  const [subscriberss, setSubscribers] = useState([]);

  const handleGoToOthersProfile = useCallback(async (userName, userId, role) => {
    const doFollowing = await isValidFollow({token: route?.params?.token, userName}, false);
    if (doFollowing) {
      navigation.navigate('othersProfile', {userName, userId, isFollowing: doFollowing?.data?.data?.follow, role});
    }
  }, []);

  useEffect(() => {
    const followers = async () => {
      const foll = await getFS({token: route?.params?.token, listType: 'followers', active: true});

      setFollowers(foll?.data?.data?.followers);
    };

    const subscribers = async () => {
      const subs = await getFS({token: route?.params?.token, listType: 'subscribers', active: isActive});

      setSubscribers(subs?.data?.data?.subscribers);
    };

    const followed = async () => {
      const foll = await getFSD({token: route?.params?.token, listType: 'followed'});

      setFollowers(foll?.data?.data?.followed);
    };

    const subscribed = async () => {
      const subs = await getFSD({token: route?.params?.token, listType: 'subscribed', active: isActive});
      setSubscribers(subs?.data?.data?.subscribed);
    };

    if (route?.params?.role === 'user') {
      if (route?.params?.title === 'Followed') {
        followed();
      } else {
        subscribed();
      }
    } else {
      if (route?.params?.title === 'Followers') {
        followers();
      } else if (route?.params?.title === 'Subscribed') {
        subscribed();
      } else {
        subscribers();
      }
    }
  }, [route?.params?.title, isActive, route?.params?.token, route?.params?.role]);

  if (route?.params?.count === 0) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <Pressable style={styles.signupPressable} onPress={() => navigate('discover')}>
          <Text style={styles.signupText}>Not found.{'\n'}</Text>
        </Pressable>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {route?.params?.title === 'Subscribers' || route?.params?.title === 'Subscribed' ? (
          <View style={{borderWidth: responsiveWidth(0.5), borderRadius: responsiveWidth(3.73), width: responsiveWidth(92), alignSelf: 'center', overflow: 'hidden', backgroundColor: '#fff'}}>
            <View style={styles.FollowersSubScribersToggle}>
              <TouchableOpacity onPress={() => setIsActive(!isActive)} style={[styles.Followers, isActive === true ? {backgroundColor: '#FFA86B', borderWidth: responsiveWidth(0.3), borderRadius: responsiveWidth(2.5)} : null]}>
                <Text style={{fontFamily: 'Rubik-SemiBold', fontSize: FONT_SIZES[14], color: '#282828'}} key={'1Followers'}>
                  Active
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsActive(!isActive)} style={[styles.SubScribers, isActive === false ? {backgroundColor: '#FFA86B', borderWidth: responsiveWidth(0.3), borderRadius: responsiveWidth(2.5)} : null]}>
                <Text key={'2SubScribers'} style={{fontFamily: 'Rubik-SemiBold', fontSize: FONT_SIZES[14], color: '#282828'}}>
                  In active
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {route?.params?.title === 'Followers' || route?.params?.title === 'Followed' ? (
          <FlatList
            ItemSeparatorComponent={() => <View style={{height: WIDTH_SIZES[1.5], backgroundColor: '#E9E9E9', width: '100%'}} />}
            data={followers}
            renderItem={({item, index}) => <EachList item={item} index={index} followersLength={followers?.length} handleGoToOthersProfile={handleGoToOthersProfile} />}
          />
        ) : (
          <FlatList
            ItemSeparatorComponent={() => <View style={{height: WIDTH_SIZES[1.5], backgroundColor: '#E9E9E9', width: '100%'}} />}
            data={subscriberss}
            renderItem={({item, index}) => <EachList handleGoToOthersProfile={handleGoToOthersProfile} item={item} index={index} followersLength={subscriberss?.length} />}
          />
        )}
      </View>
    );
  }
};

export default FollowersSubscribersPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopColor: '#282828',
  },

  eachListContainer: {
    flexDirection: 'row',
    gap: responsiveWidth(4),
    paddingLeft: responsiveWidth(4),
    paddingVertical: responsiveWidth(3),
  },

  imageContainer: {
    borderColor: 'purple',
    borderRadius: responsiveWidth(15),
    position: 'relative',
    borderColor: '#282828',
    resizeMode: 'cover',
    height: responsiveWidth(12),
    width: responsiveWidth(12),
    justifyContent: 'center',
    overflow: 'hidden',
  },

  profileImage: {
    flex: 1,
    borderRadius: responsiveWidth(12),
    borderWidth: 1,
    borderColor: '#282828',
    width: '100%',
    resizeMode: 'cover',
  },

  name: {
    fontFamily: 'MabryPro-Medium',
    fontSize: responsiveFontSize(1.8),
    color: '#282828',
  },

  userName: {
    fontFamily: 'Rubik-Medium',
    fontSize: responsiveFontSize(1.7),
    color: '#282828',
  },

  detailContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  choiceContainer: {
    paddingLeft: responsiveWidth(4),
    flexDirection: 'row',
    marginTop: responsiveWidth(2),
  },

  button: {
    backgroundColor: '#fff',
    padding: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    fontFamily: 'MabryPro-Regular',
    color: '#282828',
    borderWidth: 1,
  },

  buttonSelected: {
    backgroundColor: '#ffa07a',
    padding: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    fontFamily: 'MabryPro-Regular',
    color: '#282828',
    borderWidth: 1,
  },

  loginButton: {
    padding: Platform.OS === 'ios' ? responsiveWidth(4) : null,
    backgroundColor: 'rgba(255, 168, 107, 1)',
    borderRadius: responsiveWidth(4),
    color: '#282828',
    textAlign: 'center',
    fontFamily: 'Rubik-Medium',
    fontWeight: '600',
    width: responsiveWidth(85),
    height: responsiveWidth(14),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderWidth: responsiveWidth(0.5),
    borderTopColor: '#282828',
    borderLeftColor: '#282828',
    fontSize: responsiveFontSize(2.4),
    overflow: 'hidden',
  },
  signupText: {
    textAlign: 'center',
    fontFamily: 'Rubik-Medium',
    color: 'black',
    fontSize: responsiveFontSize(2.2),
  },
  signupLink: {
    color: '#FF7F50',
    fontSize: responsiveFontSize(1.8),
  },
  signupPressable: {
    width: '68%',
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveWidth(4.3),
    paddingHorizontal: responsiveWidth(6.7),
  },

  name: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: responsiveFontSize(2),
    color: 'black',
  },
  username: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.5),
    color: '#1e1e1e',
    textAlign: 'left',
  },
  verifyContainer: {
    width: 15,
    height: 14.32,
  },
  imageContainer: {
    width: responsiveWidth(13.3),
    height: responsiveWidth(13.3),
    borderRadius: responsiveWidth(105),
    marginRight: responsiveWidth(1.5),
    borderWidth: 1.5,
    overflow: 'hidden', // Clip the image if it exceeds the container
    alignItems: 'center', // Center the image horizontally
    justifyContent: 'center', // Center the image vertically
  },
  profileImage: {
    width: '100%', // Fill the container width
    height: '100%', // Fill the container height
    resizeMode: 'cover', // Ensure the image covers the container while maintaining aspect ratio
  },

  FollowersSubScribersToggle: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: responsiveWidth(2.8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(2),
    backgroundColor: '#f3f3f3',
    height: 54,
    padding: responsiveWidth(1),
    width: '100%',
  },
  Followers: {
    flexBasis: '48.2%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SubScribers: {
    flexBasis: '48.2%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
