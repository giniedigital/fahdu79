import {StyleSheet, Text, View, FlatList, Pressable, Platform, TouchableOpacity, useWindowDimensions} from 'react-native';
import React, {memo, useCallback, useMemo, useState, useRef, useEffect} from 'react';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {Image} from 'expo-image';
import AnimatedButton from '../AnimatedButton';
import {navigate} from '../../../Navigation/RootNavigation';
import {ChatWindowError} from '../ErrorSnacks';
import { WIDTH_SIZES } from '../../../DesiginData/Utility';

const VerificationInformation = ({agreeModal, setAgreeModal}) => {
  const {height} = useWindowDimensions();
  const [showError, setShowError] = useState(false);
  const refRBSheet = useRef();
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (agreeModal) {
      refRBSheet.current.open();
    } else {
      refRBSheet.current.close();
    }
  }, [agreeModal]);

  const [checked, setChecked] = useState(false);

  const handleIAgree = () => {
    if (!checked) {
      setShowError(true);
    } else {
      setShowError(false);
      setAgreeModal(false);
    }
  };

  const InformationText = ({item, index}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.modalInfoText}>{index + 1 + '. '}</Text>
        <Text style={styles.modalInfoText}>{item}</Text>
      </View>
    );
  };

  const onContentLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  return (
    <RBSheet
      ref={refRBSheet}
      useNativeDriver={true}
      customStyles={{
        wrapper: {
          backgroundColor: '#00000090',
        },
        container: {
          height: contentHeight + WIDTH_SIZES[84], // Add some padding or additional height if needed
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 2,
        },
      }}
      closeOnPressBack={false}
      closeOnPressMask={false}
      customModalProps={{
        animationType: 'slide',
        statusBarTranslucent: true,
      }}
      draggable={false}
      customAvoidingViewProps={{
        enabled: false,
      }}>
      <View style={{borderRadius: responsiveWidth(2), paddingTop: responsiveWidth(8), paddingHorizontal: responsiveWidth(6)}} onLayout={onContentLayout}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: responsiveWidth(4)}}>
          <Text style={[{fontFamily: 'Rubik-Bold', fontSize: 21, alignSelf: 'flex-start', color: '#1E1E1E'}]}>Eligibility</Text>

          <Pressable style={styles.iconContainer} onPress={() => navigate('home')}>
            <Image source={require('../../../Assets/Images/Crosss.png')} contentFit="contain" style={{flex: 1}} />
          </Pressable>
        </View>

        <View style={{alignItems: 'center'}}>
          <FlatList
            data={['You should have minimum of 5K followers on Instagram.', 'Your Instagram account should be public.', 'Your Instagram account should not be a\n“Fan Page” or “Meme Page”.']}
            renderItem={({item, index}) => <InformationText item={item} index={index} />}
            scrollEnabled={false}
            contentContainerStyle={{padding: 2}}
            ItemSeparatorComponent={() => <View style={{marginVertical: 6}} />}
          />

          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginVertical: responsiveWidth(4)}} onPress={() => setChecked(!checked)} activeOpacity={0.8}>
            {/* Custom Checkbox */}
            <View
              style={{
                borderColor: '#1e1e1e',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}>
              {checked ? (
                <Pressable style={[{height: 18, width: 18}]} onPress={() => setChecked(prev => !prev)}>
                  <Image source={require('../../../Assets/Images/check.png')} contentFit="contain" style={{flex: 1}} />
                </Pressable>
              ) : (
                <Pressable style={[{height: 18, width: 18}]} onPress={() => setChecked(prev => !prev)}>
                  <Image source={require('../../../Assets/Images/uncheck.png')} contentFit="contain" style={{flex: 1}} />
                </Pressable>
              )}
            </View>

            <Text
              style={{
                fontFamily: 'Rubik-SemiBold',
                color: '#1e1e1e',
                fontSize: responsiveFontSize(1.9),
                fontWeight: 'bold',
              }}>
              Accept All.
            </Text>

            {showError && !checked && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>*Please accept to proceed</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={{width: responsiveWidth(87.5)}}>
            <AnimatedButton title={'I Agree'} showOverlay={true} buttonMargin={0} onPress={handleIAgree} />
          </View>
        </View>
      </View>
    </RBSheet>
  );
};

export default memo(VerificationInformation);

const styles = StyleSheet.create({
  modalInnerWrapper: {
    // height: responsiveWidth(50),
    width: responsiveWidth(80),
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(35),
    borderRadius: responsiveWidth(10),
    borderWidth: 1,
    borderColor: '#282828',
    paddingVertical: responsiveWidth(2),
  },

  eachSortByModalListText: {
    fontSize: responsiveFontSize(2),
    color: '#282828',

    fontFamily: 'MabryPro-Bold',
  },
  eachSortModalList: {
    flexDirection: 'row',
    gap: responsiveWidth(5),
    alignItems: 'center',
    marginVertical: responsiveWidth(3),
  },

  dialog: {
    borderWidth: responsiveWidth(0.5),
    top: responsiveWidth(50),
  },
  iconContainer: {
    // marginRight: responsiveWidth(4),
    height: 12,
    width: 12,
  },
  modalInfoText: {
    fontFamily: 'Rubik-Regular',
    lineHeight: 18,
    color: '#1e1e1e',
    fontSize: responsiveFontSize(1.9),
  },
  errorContainer: {
    flexDirection: 'row',
    borderRadius: responsiveWidth(2),
    marginLeft: 90,
    alignSelf: 'flex-end',
  },
  errorText: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.48),
    color: 'red',
    flexShrink: 1,
  },
});