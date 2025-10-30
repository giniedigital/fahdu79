import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";


const BioMyProfile = ({userProfileDetails}) => {
  return (
    <View style = {styles.container}>
      <Text style = {styles.bioText}>
        
        {userProfileDetails?.aboutUser}
        
      </Text>
    </View>
  );
};

export default BioMyProfile;

const styles = StyleSheet.create({
    container : {
        marginTop : responsiveWidth(2),
        paddingHorizontal : responsiveWidth(4),

    },
    bioText : {
        fontSize : responsiveFontSize(1.8),
        fontFamily : 'MabryPro-Regular',
        color : '#282828'
    }
});
