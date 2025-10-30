import {StyleSheet, View, TextInput, Touchable, TouchableOpacity, Text, Pressable, Platform, Alert} from 'react-native';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {clearSearchString, insertSearchString} from '../../../Redux/Slices/NormalSlices/MessageSlices/ChatRoomSearchValueSlice';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FONT_SIZES, nTwins, nTwinsFont, selectionTwin, WIDTH_SIZES} from '../../../DesiginData/Utility';
import DIcon from '../../../DesiginData/DIcons';
import ChatRoomAudienceSort from '../ChatRoomAudienceSort';
import {toggleChatRoomModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import Filter from '../../../Assets/svg/filter.svg';
import ManageRevenueDashboardHeaderRight from '../ManageRevenueComponents/ManageRevenueDashboardHeaderRight';

const ChatRoomHeader = () => {
  const [searchString, setSearchString] = useState('');

  const [focus, setFocus] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    let debounceSearch = setTimeout(() => {
      dispatch(insertSearchString({searchString}));
    }, 300);

    return () => {
      clearTimeout(debounceSearch);
    };
  }, [searchString]);

  const handleClearText = useCallback(() => {
    if (searchString?.length > 0) {
      dispatch(clearSearchString());
      setSearchString('');
    }
  }, [searchString]);

  const role = useSelector(state => state.auth.user.role);

  return (
    <View style={styles.container}>
      <View style={{width: '100%', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', marginTop: Platform.OS === 'ios' ? responsiveWidth(12) : responsiveWidth(2), justifyContent: 'space-between'}}>
        <Text style={styles.header}>Chats</Text>
        {role === 'creator' && <ManageRevenueDashboardHeaderRight />}
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: responsiveWidth(3)}}>
        <View style={[{flexDirection: 'row', backgroundColor: 'white', width: '100%', borderRadius: responsiveWidth(4), borderWidth: WIDTH_SIZES[1.5], borderColor: '#1e1e1e'}, focus && {backgroundColor: '#FFF9F5'}]}>
          <TextInput
            selectionColor={selectionTwin()}
            selectionHandleColor={'#ffa86b'}
            cursorColor={'#1e1e1e'}
            placeholderTextColor="#B2B2B2"
            placeholder="Search here..."
            value={searchString}
            style={[styles.textInputStyle, styles.textStyle, focus ? {backgroundColor: '#FFF9F5'} : {backgroundColor: '#fff'}]}
            onChangeText={str => setSearchString(str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, '').trim())}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
          <TouchableOpacity style={[{alignItems: 'center', justifyContent: 'center', left: Platform.OS === 'ios' ? responsiveWidth(8) : responsiveWidth(8)}, focus && {backgroundColor: '#FFF9F5'}]} onPress={() => handleClearText()}>
            <DIcon provider={'Feather'} name={searchString?.length > 0 ? 'x' : 'search'} size={nTwins(6, 4.4)} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{borderColor: 'blue', alignSelf: 'center', justifyContent: 'center', marginTop: responsiveWidth(3)}}>
        <ChatRoomAudienceSort />
      </View>
    </View>
  );
};

export default ChatRoomHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(4),
    backgroundColor: '#fff',
  },
  header: {
    fontFamily: 'Rubik-Bold',
    fontSize: FONT_SIZES[22],
    color: '#1e1e1e',
  },
  filterWrapper: {
    borderRadius: responsiveWidth(2.5),
    paddingVertical: responsiveWidth(1.8),
    paddingHorizontal: responsiveWidth(3),
    // marginRight: responsiveWidth(2),
  },
  wrapper: {
    borderWidth: 0,
    width: responsiveWidth(30),
    height: nTwins(12, 10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
    marginRight: nTwins(2, -5),
  },
  sortModalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
    // overflow: "hidden",
    // bottom: responsiveWidth(14),
    // left: responsiveWidth(9),
    borderWidth: responsiveWidth(0.4),
    height: responsiveWidth(13),
    width: responsiveWidth(13),
    borderRadius: responsiveWidth(4),
  },

  textInputStyle: {
    paddingLeft: nTwins(4, 4),
    backgroundColor: 'white',
    fontFamily: 'Rubik-Regular',
    width: '80%',
    marginTop: nTwins(0, 0.6),
    borderRadius: responsiveWidth(4),
    height: Platform.OS === 'ios' ? responsiveWidth(12) : null,
  },

  textStyle: {
    fontSize: nTwinsFont(1.8, 1.8),
    fontFamily: 'Rubik-Regular',
    color: '#282828',
  },
});
