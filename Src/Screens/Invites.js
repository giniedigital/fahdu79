import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import { navigate } from "../../Navigation/RootNavigation";

const Invites = ({ route }) => {
  return (
    <View style={styles.chatRoomContainer}>
      <Image source={route?.params?.data?.profile_image?.url ? { uri: route?.params?.data?.profile_image?.url } : require("../../Assets/Images/DefaultProfile.jpg")} style={{ height: responsiveWidth(25), width: responsiveWidth(25), resizeMode: "contain", alignSelf: "center", borderRadius: responsiveWidth(30) }} />

      <Text style={styles.headText}>You've been invited by</Text>

      <Text style={[styles.headText, { fontFamily: "MabryPro-Medium", fontSize: responsiveFontSize(2), marginTop: responsiveWidth(2) }]}>{"@ " + route?.params?.data?.displayName}</Text>

      <TouchableOpacity onPress={() => navigate("SignUp", { referredTokenId: route?.params?.referredTokenId })}>
        <Text style={styles.signUp}>Sign up, now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Invites;

const styles = StyleSheet.create({
  chatRoomContainer: {
    flex: 1,
    backgroundColor: "#fffaf0",
    justifyContent: "center",
    alignItems: "center",
  },

  headText: {
    fontSize: responsiveFontSize(3),
    fontFamily: "MabryPro-Bold",
    textAlign: "center",
    color: "#282828",
    marginTop: responsiveWidth(8),
  },

  signUp: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: "MabryPro-Bold",
    textAlign: "center",
    color: "#ffa17b",
    marginTop: responsiveWidth(8),
  },
});
