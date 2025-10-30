import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { useSelector } from "react-redux";

import { useNavigation } from "@react-navigation/native";
import DIcon from "../../../DesiginData/DIcons";
import { nTwins } from "../../../DesiginData/Utility";

const HeaderLeftOtherProfile = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.headerLeftWrapper}>
      <View style={styles.headerLeftContentContainer}>
        <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => navigation.goBack()}>
        <DIcon provider={"Ionicons"} name={"chevron-back"} color={"#282828"} size={responsiveWidth(8)} style = {{alignSelf : 'center', marginLeft : responsiveWidth(2)}} onPress = {() => navigation.goBack()}/>
        </TouchableOpacity>
        <View style={styles.headerInformation}>
          <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
            Profile
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HeaderLeftOtherProfile;

const styles = StyleSheet.create({
  headerLeftWrapper: {
    height: responsiveWidth(12),
    width: "68%",
    marginRight: responsiveWidth(36),
    justifyContent: "center",
    paddingLeft: responsiveWidth(1),
    // borderWidth : 1
  },
  headerLeftContentContainer: {
    height: "100%",
    borderColor: "blue",
    flexDirection: "row",
    gap: responsiveWidth(4),
    alignItems : 'center',
  },
 
  headerInformation: {
    // borderWidth: 1,
    width: "80%",
    justifyContent: "center",
  },
  userName: {
    fontFamily: "Lexend-Bold",
    color: "#282828",
    fontSize: responsiveFontSize(2.4),
    marginLeft : responsiveWidth(2)
  },
  status: {
    fontSize: responsiveFontSize(1.6),
    letterSpacing: 0.5,
    color: "#282828",
    fontFamily: "MabryPro-Regular",
  },
});
