import {StyleSheet, Text, View, Platform, FlatList, TouchableOpacity, Image} from 'react-native';
import React, {memo} from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import TextTicker from 'react-native-text-ticker';
import {nTwins, nTwinsFont, WIDTH_SIZES} from '../../../DesiginData/Utility';
import {BlurView} from 'expo-blur';


const RIGHT_WIDTH = responsiveWidth(28); // Reserve fixed space for coin+amount

const RenderEachItem = memo(({ item }) => {
  const progressWidth =
    item.collected === 0
      ? 0
      : `${item?.amount ? (item.collected / item.amount) * 100 : 0}%`;

  return (
    <View
      style={{
        width: WIDTH_SIZES[345],
        alignSelf: 'center',
        borderWidth: responsiveWidth(0.4),
        borderRadius: responsiveWidth(3.5),
        height: responsiveWidth(13),
        overflow: 'hidden',
        borderColor: '#ffffff60',
        backgroundColor: 'transparent',
      }}>
      <BlurView intensity={30} tint="light" style={{ flex: 1 }}>
        {/* Progress Bar */}
        <View
          style={[
            styles.progress,
            {
              width: progressWidth,
              borderWidth: item.collected === 0 ? 0 : responsiveWidth(0.4),
            },
          ]}
        />

        {/* Row Content */}
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: responsiveWidth(4),
          }}>
          
          {/* Title (flexible space, ellipsized if too long) */}
          <View style={{ flex: 1, paddingRight: responsiveWidth(2) }}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: responsiveFontSize(2),
                  textAlignVertical: 'center',
                  lineHeight: Platform.OS === 'ios' ? 35 : undefined,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item?.title}
            </Text>
          </View>

          {/* Amount + Coin (fixed width, always right aligned) */}
          <View
            style={{
              width: RIGHT_WIDTH,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <Text
              style={[
                styles.text,
                {
                  fontFamily: 'Rubik-Medium',
                  textAlignVertical: 'center',
                  lineHeight: Platform.OS === 'ios' ? 35 : undefined,
                  marginRight: responsiveWidth(1),
                },
              ]}>
              {item?.collected}/{item?.amount}
            </Text>
            <Image
              source={require('../../../Assets/Images/Coins2.png')}
              style={{
                height: responsiveWidth(4.5),
                width: responsiveWidth(4.5),
                resizeMode: 'contain',
              }}
            />
          </View>
        </View>
      </BlurView>
    </View>
  );
});

const GoalsComponent = () => {
  const flashGoals = useSelector(state => state.livechats.data.goals);

  return (
    <View behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{maxHeight: responsiveWidth(40), marginTop: responsiveWidth(6)}}>
      <FlatList pagingEnabled data={flashGoals} renderItem={({item}) => <RenderEachItem item={item} />} contentContainerStyle={{gap: responsiveWidth(3)}} showsVerticalScrollIndicator={false} />
    </View>
  );
};

export default GoalsComponent;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
    fontSize: responsiveFontSize(2),
  },

  progress: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#FFA86B',
    borderWidth: WIDTH_SIZES[2],
    borderColor: '#FF7819',
    borderRadius: responsiveWidth(3.5),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightColor: '#FFA86B',
    ...StyleSheet.absoluteFillObject,
    // borderTopLeftRadius: responsiveWidth(3),
    // borderBottomLeftRadius: responsiveWidth(3),
  },

  blurBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: responsiveWidth(3),
    backgroundColor: '#ffffff30',
    height: '100%',
    width: '100%',
  },
});
