import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';

import {useSelector} from 'react-redux';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import DIcon from '../../../DesiginData/DIcons';
import {Image} from 'expo-image';
import {Tabs} from 'react-native-collapsible-tab-view';
import {useLazyContactInfoQuery} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {token} from '../../../Redux/Slices/NormalSlices/AuthSlice';
import {navigate} from '../../../Navigation/RootNavigation';
import {useMessageNavigation} from '../../Hook/useMessageNavigation';

const OtherProfileFeedPost = ({contactDescription}) => {
  console.log({contactDescription});

  const {profileDetails} = useSelector(state => state.profileFeedCache.data);
  const token = useSelector(state => state.auth.user.token);

  const chatRoomObject = useSelector(state => state.roomList.data.none);

  const goChat = useMessageNavigation(token, profileDetails, chatRoomObject);

  const data = [
    {
      id: '1',
      type: 'Chat',
      description: 'Spark insightful convos with creators',
      url: require('../../../Assets/Images/profileMessage.png'),
      buttonText: 'Chat',
    },

    {
      id: '2',
      type: 'Live Stream',
      description: 'Time to interact and experience exclusive content!',
      url: require('../../../Assets/Images/live.png'),
      buttonText: 'Join',
    },

    {
      id: '3',
      type: 'Audio Call',
      description: 'Discuss your passions over phone calls.',
      url: require('../../../Assets/Images/profileCall.png'),
      buttonText: 'Call',
    },
    {
      id: '4',
      type: 'Video Call',
      description: 'Connect face-to-face with creators in real-time!',
      url: require('../../../Assets/Images/profileVideo.png'),
      buttonText: 'Call',
    },
  ];

  const handleButtonPress = index => {
    if (index === 0) {
      goChat();
    } else {
      console.log('index ', index);
    }

  };

  const card = ({item, index}) => {
    // sample data (you can replace with API values)
    const sampleFeatures = ['Full access to the content of the subscription tier', 'Cancel your subscription at any time'];

    console.log(item?.descriptions, 'IO');

    return (
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.subheading}>{item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase()}</Text>

        {/* Subtitle / Description */}
        <Text style={styles.description}>{data[index]?.description}</Text>

        {/* Features */}
        <View style={styles.featureList}>
          {sampleFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <DIcon provider="FontAwesome" name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.featureText}>{item?.descriptions?.[index] || feature}</Text>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View style={styles.priceRow}>
          <View style={styles.priceBox}>
            <Text style={styles.priceValue}>{item?.followerFee || 0}</Text>
            <Image source={require('../../../Assets/Images/Coins2.png')} style={styles.coinIcon} contentFit="contain" />
            <Text style={styles.priceLabel}>/{`${index === 0 ? 'Msg.' : 'min'}`} Foll</Text>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.priceValue}>{item?.subscriptionFee || 0}</Text>
            <Image source={require('../../../Assets/Images/Coins2.png')} style={styles.coinIcon} contentFit="contain" />
            <Text style={styles.priceLabel}>/{`${index === 0 ? 'Msg.' : 'min'}`} Subs.</Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.callButton} onPress={() => handleButtonPress(index)}>
          <View style={{height: 22, width: 22}}>
            <Image source={data[index]?.url} contentFit="contain" style={{flex: 1}} />
          </View>
          <Text style={styles.callButtonText}>{data[index]?.buttonText + ' Now'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Tabs.FlatList
      data={contactDescription}
      keyExtractor={item => item.id}
      renderItem={card}
      contentContainerStyle={styles.listContainer}
      style={{backgroundColor: '#fff'}}
      ItemSeparatorComponent={() => <View style={{marginVertical: 12}} />}
      ListHeaderComponent={() => {
        return (
          <>
            <View style={styles.containerCategory}>
              <Text style={styles.title}>{profileDetails?.categoryHeader || 'Fahdu Creator'}</Text>
              <Text style={styles.description}>
                {profileDetails?.categoryDescription ||
                  'As a versatile Dance Creator and Choreographer, I design dynamic routines that blend traditional and modern styles across various genres. I lead teams to deliver impactful performances and incorporate diverse cultural elements. I am committed to mentoring dancersand fostering their growth.'}
              </Text>
            </View>
            <View style={{width: '100%', height: 6, backgroundColor: '#ededed', marginBottom: 24, marginTop: 0}} />
            <Text style={[styles.title, {marginLeft: 24, marginBottom: 16}]}>Contact Info</Text>
          </>
        );
      }}
    />
  );
};

export default OtherProfileFeedPost;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: responsiveWidth(2),
    // margin: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  containerCategory: {
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 18,
    color: '#1e1e1e',
    marginBottom: 8,
    fontFamily: 'Rubik-SemiBold',
  },
  description: {
    fontSize: 14,
    color: '#1e1e1e',
    lineHeight: 19,
    marginBottom: 8,
    fontFamily: 'Rubik-Regular',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    fontFamily: 'Rubik-Bold',
  },
  listContainer: {
    paddingBottom: 16,
  },

  card: {
    borderWidth: 2,
    borderColor: '#1e1e1e',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    backgroundColor: '#fff',
  },

  subheading: {
    fontSize: 16,
    fontFamily: 'Rubik-SemiBold',
    color: '#1e1e1e',
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: '#1e1e1e',
    marginBottom: 12,
    fontFamily: 'Rubik-Regular',
  },

  featureList: {
    marginBottom: 16,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  featureText: {
    marginLeft: 8,
    fontSize: 13,
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap', // ✅ allows wrapping on small screens
    gap: 8, // ✅ adds consistent spacing between boxes
  },

  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3EB',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#1e1e1e',
    flexWrap: 'wrap',
    flex: 1, // ✅ ensures both boxes share space equally
  },

  priceValue: {
    fontSize: 12,
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    marginRight: 4,
  },

  coinIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },

  priceLabel: {
    fontSize: 12,
    fontFamily: 'Rubik-Regular',
    color: '#1e1e1e',
  },

  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA86B',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1e1e1e',
  },

  callButtonText: {
    fontSize: 14,
    fontFamily: 'Rubik-SemiBold',
    color: '#1e1e1e',
    marginLeft: 8,
  },
});
