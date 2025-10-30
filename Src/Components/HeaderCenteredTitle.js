import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';

const HeaderCenteredTitle = (props) => {
  return (
    <View style={styles.HeaderCenteredTitleContainer}>
      <Text style = {styles.messagesSelfTitle}>{props.title}</Text>
    </View>
  );
};

export default HeaderCenteredTitle;

const styles = StyleSheet.create({
  HeaderCenteredTitleContainer: {
    width: responsiveWidth(100),
    padding: responsiveWidth(1),
    justifyContent: 'center',
    alignItems : 'center',
    
   },

  messagesSelfTitle : {
    fontFamily : 'Roboto-Italic',
    color : "#282828",
    fontSize : responsiveFontSize(3.5),
    textAlign : 'center',
    fontFamily : 'Lexend-Bold',
  }
});
