import {StyleSheet, Text, View, Image, Dimensions, Pressable, Platform, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Carousel from 'react-native-reanimated-carousel';
// import {LinearGradient} from 'expo-linear-gradient'; // If using Expo
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';

import LinearGradient from 'react-native-linear-gradient';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {navigate} from '../../Navigation/RootNavigation';
import {useLazyDiscoverRecomendCreatorsQuery, useLazyRecommendedCreatorsQuery} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import DiscoverFlatlist from '../Components/DiscoverFlatlist';
import {discoverRecommendDataColor, discoverScrollData} from '../../DesiginData/Data';
import {getResponsiveFontSize} from '../../DesiginData/Utility';
import { useIsFocused } from '@react-navigation/native';
const {width} = Dimensions.get('window');


const DiscoverScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const token = useSelector(state => state.auth.user.token);

  const [creatorsList, setCreatorsList] = useState([]);

  const [discoverRecomend] = useLazyDiscoverRecomendCreatorsQuery({refetchOnFocus: true});


  const isScreenFocused = useIsFocused()

  async function getTrendingCreatorsList(type) {
    let trendingCreatorsList = await discoverRecomend({token, type}, false);
    if (trendingCreatorsList?.data?.statusCode === 200) {
      setCreatorsList(trendingCreatorsList?.data?.data);
    }
  }

  useEffect(() => {
    getTrendingCreatorsList();
  }, []);

  const handlePress = data => {
    getTrendingCreatorsList(data?.title);
  };

  useEffect(() => {
    if (discoverScrollData.length > 0) {
      const activeItem = discoverScrollData[activeIndex];
      handlePress(activeItem);
    }
  }, [activeIndex]);

  return (
    <View style={styles.discoverContainer}>
      <View style={{flexDirection: 'row', justifyContent: 'center', height: responsiveHeight(39), alignSelf: 'center', alignItems: 'flex-start'}}>
        <Carousel
          onProgressChange={(_, absoluteProgress) => {
            setActiveIndex(Math.round(absoluteProgress));
          }}
          loop
          width={width}
          height={responsiveWidth(83)}
          autoPlay={isScreenFocused}
          autoPlayInterval={5000}
          data={discoverScrollData}
          pagingEnabled
          modeConfig={{snapDirection: 'left', stackInterval: 20}}
          snapEnabled
          mode="parallax"
          scrollAnimationDuration={2000}
          style={{marginBottom: 0, marginTop: 0}}
          renderItem={({item, index}) => (
            <TouchableOpacity activeOpacity={0.8} onPress={() => handlePress(item)}>
              {index === activeIndex && (
                <View
                  style={{
                    position: 'absolute',
                    borderRadius: responsiveWidth(6),
                    width: '75%',
                    height: '99%',
                    alignSelf: 'center',
                    borderWidth: responsiveWidth(0.4),
                    backgroundColor: discoverRecommendDataColor[item.id].color, // Dark overlay
                    left: '15%',
                    top: '2.8%',
                  }}
                />
              )}
              <View
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 5},
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 5,
                  position: 'relative',
                  borderWidth: responsiveWidth(0.4),
                  height: responsiveHeight(42),
                  width: index === activeIndex ? responsiveWidth(76) : responsiveWidth(116),
                  alignSelf: 'center',
                }}>
                <Image source={item.imageUri} style={{width: '100%', height: '100%'}} resizeMode="cover" />

                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.9)']}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    padding: 20,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={item.iconUri} style={{width: 30, height: 30, resizeMode: 'contain'}} />
                    <Text style={{color: '#fff', fontSize: 19, fontFamily: 'Rubik-SemiBold', lineHeight: 24, marginLeft: 10, marginTop: 4}}>{item.title}</Text>
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={{alignItems: 'center', marginTop: responsiveWidth(4.27)}}>
        <AnimatedDotsCarousel
          length={11} // Total items
          currentIndex={activeIndex}
          maxIndicators={11} // Ensure 5 dots are displayed
          interpolateOpacityAndColor={true}
          activeIndicatorConfig={{
            color: '#FFA86B',
            margin: 3,
            opacity: 1,
            size: 12,
            borderWidth: responsiveWidth(0.4),
          }}
          inactiveIndicatorConfig={{
            color: '#ccc',
            margin: 3,
            opacity: 0.5,
            size: 8,
          }}
          decreasingDots={[
            {
              config: {color: '#ccc', margin: 3, opacity: 0.5, size: 7},
              quantity: 2, // Two dots before the active one
            },
            {
              config: {color: '#ccc', margin: 3, opacity: 0.3, size: 6},
              quantity: 2, // Two dots after the active one
            },
          ]}
        />
      </View>

      <FlatList
        data={creatorsList.slice(0, 4)}
        renderItem={({item, index}) => <DiscoverFlatlist item={item} index={index} />}
        ListEmptyComponent={<Text style={styles.noDataText}>No recommendations available</Text>}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{marginVertical: responsiveHeight(0.4)}} />}
        scrollEnabled
        contentContainerStyle={{flexGrow: 1}}
        style={{
          paddingHorizontal: responsiveWidth(2.4),
          width: '100%',
          height: '90%',
          marginTop: responsiveWidth(6.93),
        }}
        ListHeaderComponent={<Text style={styles.recommendationText}>Our Recommendations</Text>}
      />
    </View>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  discoverContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  recommendationText: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Rubik-SemiBold',
    // marginVertical : responsiveWidth(4),
    paddingBottom: responsiveWidth(3),
    color: '#1e1e1e',
    paddingLeft: responsiveWidth(4),
  },
  verifyContainer: {
    width: 15,
    height: 14.32,
  },
});
