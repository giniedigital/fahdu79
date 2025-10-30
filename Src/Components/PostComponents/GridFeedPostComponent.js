import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import EmptyComponent from './EmptyComponent';
import DIcon from '../../../DesiginData/DIcons';
import {Tabs, useHeaderMeasurements} from 'react-native-collapsible-tab-view';
import {Image} from 'expo-image';
import {navigate} from '../../../Navigation/RootNavigation';

const GridFeedPostComponent = ({navigation}) => {
  const userPosts = useSelector(state => state.myProfileFeedCache.data.content);

  const {height: headerHeight} = useHeaderMeasurements();

  const GridPostComponent = useCallback(({item, index}) => {
    const rowIndex = Math.floor(index / 3);

    return item?.post_content_files?.[0]?.format === 'image' ? (
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={[styles.gridEachImageContainer, index % 3 === 1 ? {width: '97.5%'} : null, rowIndex >= 1 ? {marginTop: 2} : null]} onPress={() => navigate('allmyposts', {scrollIndex: index})}>
          <Image allowDownscaling placeholder={require('../../../Assets/Images/GridPostPlaceholder.jpg')} source={item?.post_content_files?.[0]?.url} contentFit="cover" style={{width: '100%', height: '100%'}} />

          {item?.pinned && (
            <View style={{justifyContent: 'center', alignItems: 'center', width: responsiveWidth(10), height: responsiveWidth(10), position: 'absolute', top: '-4%', zIndex: 3, alignSelf: 'flex-end'}}>
              <DIcon provider={'Entypo'} name={'pin'} size={responsiveWidth(4)} color={'white'} />
            </View>
          )}
          {item?.for_subscribers && (
            <View style={styles.subsonly}>
              <Text style={{fontFamily: 'MabryPro-Medium', color: '#fff', fontSize: responsiveFontSize(1.5)}}>PREMIUM</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    ) : (
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={[styles.gridEachImageContainer, {position: 'relative'}]} onPress={() => navigate('allmyposts', {scrollIndex: index})}>
          {item?.pinned && (
            <View style={{justifyContent: 'center', alignItems: 'center', width: responsiveWidth(10), height: responsiveWidth(10), position: 'absolute', top: '-4%', zIndex: 3, alignSelf: 'flex-end'}}>
              <DIcon provider={'Entypo'} name={'pin'} size={responsiveWidth(4)} color={'white'} />
            </View>
          )}

          <View style={{justifyContent: 'center', alignItems: 'center', width: responsiveWidth(10), height: responsiveWidth(10), position: 'absolute', top: '35%', zIndex: 3, alignSelf: 'center'}}>
            <DIcon provider={'AntDesign'} name={'play'} size={responsiveWidth(8)} color={'white'} />
          </View>
          <Image allowDownscaling placeholder={require('../../../Assets/Images/GridPostPlaceholder.jpg')} source={item?.video?.thumbnail?.url} contentFit="cover" style={{width: '100%', height: '100%'}} />

          {item?.for_subscribers && (
            <View style={styles.subsonly}>
              <Text style={{fontFamily: 'MabryPro-Medium', color: '#fff', fontSize: responsiveFontSize(1.5)}}>PREMIUM</Text>
            </View>
          )}
        </TouchableOpacity>
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
        ListEmptyComponent={() => <EmptyComponent />}
        data={userPosts}
        estimatedItemSize={120}
        renderItem={GridPostComponent}
        keyExtractor={item => item?._id}
        numColumns={3}
        scrollEnabled={false}
        endFillColor={'#fff'}
        contentContainerStyle={{paddingHorizontal: 0, paddingLeft: 0, paddingRight: 0, padding: 0}}
      />
    </Tabs.ScrollView>
  );
};

export default GridFeedPostComponent;

const styles = StyleSheet.create({
  gridView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gridEachImageContainer: {
    width: '100%',
    height: 129,
    overflow: 'hidden',
    position: 'relative',
  },
  subsonly: {
    position: 'absolute',
    // borderWidth : 1,
    alignSelf: 'center',
    backgroundColor: '#00000080',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marginHorizontal: {
    marginHorizontal: 8,
  },
});
