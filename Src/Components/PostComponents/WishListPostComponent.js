import {StyleSheet, Text, View, FlatList, Pressable, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useLazyGetWishListQuery} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {useSelector} from 'react-redux';
import {token as memoizedToken} from '../../../Redux/Slices/NormalSlices/AuthSlice';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import ProgressBar from 'react-native-progress/Bar';
import {useDispatch} from 'react-redux';
import AddWishListButton from '../MyProfile/AddWishListButton';
import EmptyComponent from './EmptyComponent';
import {Tabs} from 'react-native-collapsible-tab-view';

import {Image} from 'expo-image';

const WishListPostComponent = ({wishlistId}) => {
  const flatListRef = useRef(null);

  console.log('789', wishlistId);

  const [getWishList] = useLazyGetWishListQuery({refetchOnFocus: true});
  const token = useSelector(state => state.auth.user.token);
  const [wishList, setWishList] = useState([]);
  const [loading, setLoading] = useState(false);
  const userInformation = useSelector(state => state.auth.user);
  const previewModalShow = useSelector(state => state.hideShow.visibility.wishListPreviewModal);
  const wishListBottomSheetVisibility = useSelector(state => state.hideShow.visibility.wishListSheet);

  const suspended = useSelector(state => state.auth.user.suspended);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      async function wishListCall() {
        let list = await getWishList({token, userId: userInformation?.currentUserId}, false);
        setWishList(list?.data?.data?.items);
        setLoading(false);
      }

      if (!previewModalShow) {
        wishListCall();
      }
    }, [previewModalShow]),
  );

  const scrollToWishlist = urlOrId => {
    console.log(urlOrId, '9090');

    const index = wishList.findIndex(item => item._id === urlOrId);
    if (index !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({index, animated: true});
      }, 1000);
    }
  };

  useEffect(() => {
    if (wishList?.length > 0) {
      scrollToWishlist(wishlistId);
    }
  }, [wishlistId, wishList]);

  const WishListCard = useCallback(({item, setDonateData, pressDisabled}) => {
    console.log(item?._id, 'olol');

    return (
      <Pressable disabled={true} style={styles.cardWrapper} android_ripple={{color: '#f3f3f3'}}>
        <View style={styles.imageContainer}>
          <Image allowDownscaling placeholder={require('../../../Assets/Images/WishlistDefault.jpg')} source={{uri: item?.images[0]?.url}} resizeMethod="resize" style={styles.image} placeholderContentFit="cover" />
        </View>
        <Text style={styles.wishtitle}>{item?.title}</Text>

        <Text style={styles.description}>{item?.description}</Text>

        <View style={styles.cardBottomView}>
          <View style={styles.cardBottomViewUpper}>
            <Text style={styles.smallTexts}>Fund Raised</Text>
            <Text style={[styles.smallTexts, {flexDirection: 'row'}]}>
              {item?.totalCollected}/{item?.listedCoinsRequired}
              <Image source={require('../../../Assets/Images/Coin.png')} style={{height: responsiveWidth(3.5), width: responsiveWidth(3.5), resizeMode: 'contain', alignSelf: 'center', marginRight: responsiveWidth(1)}} />
            </Text>
          </View>

          <View style={{width: '100%', paddingHorizontal: responsiveWidth(2), marginTop: responsiveWidth(4)}}>
            <ProgressBar borderWidth={0} height={responsiveWidth(3)} unfilledColor={'#f2f2f2'} width={responsiveWidth(82)} progress={item?.totalCollected / item?.listedCoinsRequired} color={'#e0383e'} />
          </View>
        </View>
      </Pressable>
    );
  }, []);

  if (loading) {
    return (
      <View style={[{backgroundColor: '#fff', paddingTop: responsiveWidth(1), flex: 1}]}>
        <ActivityIndicator size={'small'} color={'#ffa07a'} style={{alignSelf: 'center', marginTop: responsiveWidth(2)}} />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Tabs.FlatList
        ref={flatListRef}
        ListHeaderComponent={() => !suspended && <AddWishListButton />}
        data={wishList}
        renderItem={({item, index}) => <WishListCard item={item} pressDisabled={true} />}
        numColumns={1}
        keyExtractor={item => item?._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: responsiveWidth(6)}}
      />
    </View>
  );
};

export default WishListPostComponent;

const styles = StyleSheet.create({
  cardWrapper: {
    borderWidth: 2,
    overflow: 'hidden',
    marginTop: responsiveWidth(4),
    borderRadius: responsiveWidth(2),
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%', // Ensure the container takes the full width
    height: responsiveWidth(60), // Fixed height for the container
    marginBottom: responsiveWidth(4),
    overflow: 'hidden', // Ensure the image doesn't overflow the container
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensure the image covers the entire container
  },
  wishtitle: {
    fontFamily: 'Rubik-Bold',
    color: '#282828',
    textAlign: 'left',
    fontSize: responsiveFontSize(2.2),
    marginTop: responsiveWidth(4),
    marginLeft: responsiveWidth(2),
  },
  description: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.8),
    marginLeft: responsiveWidth(2),
    marginTop: responsiveWidth(2),
    color: '#282828',
  },
  cardBottomView: {
    // borderWidth : 1,
    marginTop: responsiveWidth(4),
    height: responsiveWidth(16),
  },
  cardBottomViewUpper: {
    // borderWidth : 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(2),
  },
  smallTexts: {
    fontSize: responsiveFontSize(1.6),
    color: '#282828',
    fontFamily: 'Rubik-Bold',
  },
});
