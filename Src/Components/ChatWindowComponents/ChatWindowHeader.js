import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import React from 'react';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const ChatWindowHeader = ({headerMarginTop, keyBoardShown}) => {
  console.log(headerMarginTop);
  return (
    <View
      style={[
        styles.headerComponentWrapper,
        {marginTop: keyBoardShown ? headerMarginTop : 0},
        // {marginTop: 300},
      ]}>
      <Text>HeaderComponent</Text>
    </View>
  );
};

export default ChatWindowHeader;

const styles = StyleSheet.create({
  headerComponentWrapper: {
    borderWidth: 1,
    borderColor: 'red',
    padding: responsiveWidth(9),
    width: '100%',
    position: 'absolute',
    top: 25,
    backgroundColor: 'red',
    zIndex: 1,
  },
});
