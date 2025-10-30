import {StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useLazyOtherPostListQuery} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {useSelector} from 'react-redux';
import {token as memoizedToken} from '../../../Redux/Slices/NormalSlices/AuthSlice';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import DIcon from '../../../DesiginData/DIcons';
import EmptyComponent from '../PostComponents/EmptyComponent';
import {Tabs} from 'react-native-collapsible-tab-view';
import {Image} from 'expo-image';
import {useHeaderMeasurements} from 'react-native-collapsible-tab-view';

const OtherGridFeedPostComponent = () => {
  const userPosts = useSelector(state => state.profileFeedCache.data.content);
  const navigation = useNavigation();

  const {height: headerHeight} = useHeaderMeasurements();

  const GridPostComponent = useCallback(({item, index}) => {
    const rowIndex = Math.floor(index / 3);

    return (
      <View style={{width: responsiveWidth(33.33)}}>
        {item?.post_content_files ? (
          item?.post_content_files?.[0]?.format === 'image' ? (
            <TouchableOpacity style={[styles.gridEachImageContainer, rowIndex >= 1 ? {marginTop: 2} : null, index % 3 === 1 ? {paddingHorizontal: 2} : null]} onPress={() => navigation.navigate('allPosts', {scrollIndex: index})}>
              {item?.pinned && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: responsiveWidth(10),
                    height: responsiveWidth(10),
                    position: 'absolute',
                    top: '-4%',
                    zIndex: 3,
                    alignSelf: 'flex-end',
                  }}>
                  <DIcon provider={'Entypo'} name={'pin'} size={responsiveWidth(4)} color={'white'} />
                </View>
              )}
              <Image allowDownscaling placeholder={require('../../../Assets/Images/OtherPostGridDefault.jpg')} source={item?.post_content_files?.[0]?.url} contentFit="cover" style={{width: '100%', height: '100%'}} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.gridEachImageContainer, {position: 'relative'}, rowIndex >= 1 ? {marginTop: 2} : null, index % 3 === 1 ? {paddingHorizontal: 2} : null]} onPress={() => navigation.navigate('allPosts', {scrollIndex: index})}>
              {item?.pinned && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: responsiveWidth(10),
                    height: responsiveWidth(10),
                    position: 'absolute',
                    top: '-4%',
                    zIndex: 3,
                    alignSelf: 'flex-end',
                  }}>
                  <DIcon provider={'Entypo'} name={'pin'} size={responsiveWidth(4)} color={'white'} />
                </View>
              )}

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: responsiveWidth(10),
                  height: responsiveWidth(10),
                  position: 'absolute',
                  alignSelf: 'center',
                  top: '35%',
                  zIndex: 3,
                }}>
                <DIcon provider={'AntDesign'} name={'play'} size={responsiveWidth(8)} color={'white'} />
              </View>
              <Image source={!item?.video?.thumbnail?.url ? require('../../../Assets/Images/OtherPostGridDefault.jpg') : {uri: item?.video?.thumbnail?.url}} contentFit="cover" style={{width: '100%', height: '100%'}} />
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity style={[styles.gridEachImageContainer, {position: 'relative'}, rowIndex >= 1 ? {marginTop: 2} : null, index % 3 === 1 ? {paddingHorizontal: 2} : null]} onPress={() => navigation.navigate('allPosts', {scrollIndex: index})}>
            {item?.pinned && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: responsiveWidth(10),
                  height: responsiveWidth(10),
                  position: 'absolute',
                  top: '-4%',
                  zIndex: 3,
                  alignSelf: 'flex-end',
                }}>
                <DIcon provider={'Entypo'} name={'pin'} size={responsiveWidth(4)} color={'white'} />
              </View>
            )}

            <View
              style={[
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: responsiveWidth(10),
                  height: responsiveWidth(10),
                  position: 'absolute',
                  alignSelf: 'center',
                  top: '35%',
                  zIndex: 3,
                },
              ]}>
              <DIcon provider={'SimpleLineIcons'} name={'lock'} color="#fff" size={responsiveWidth(8)} />
            </View>
            <Image allowDownscaling blurRadius={20} placeholder={require('../../../Assets/Images/blur.jpg')} source={item?.image_preview?.[0]?.url} contentFit="cover" style={{width: '100%', height: '100%'}} />
          </TouchableOpacity>
        )}
      </View>
    );
  }, []);

  return (
    <Tabs.ScrollView
      contentContainerStyle={{
        paddingTop: 0,
        flex: 1,
        marginTop: Platform.OS === 'ios' ? -headerHeight - 40 : 4,
        backgroundColor: '#fff',
      }}
      showsVerticalScrollIndicator={false}>
      <Tabs.MasonryFlashList
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <EmptyComponent type={'other'} />}
        data={userPosts}
        estimatedItemSize={120}
        renderItem={GridPostComponent}
        keyExtractor={item => item?._id}
        numColumns={3}
        scrollEnabled={false}
        endFillColor={'#fff'}
        contentContainerStyle={{paddingHorizontal: 0}}
      />
    </Tabs.ScrollView>
  );
};

export default OtherGridFeedPostComponent;

const styles = StyleSheet.create({
  gridView: {
    backgroundColor: '#fff',
  },
  gridEachImageContainer: {
    width: '100%',
    height: 129,
    overflow: 'hidden',
  },
});
