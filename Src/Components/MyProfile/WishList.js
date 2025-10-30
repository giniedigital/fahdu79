import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";


const WishList = () => {
  return (
    <View>
      <View style={{ position: "relative", alignSelf: "center" }}>
        <Text style={[styles.loginButton, { backgroundColor: "#282828", position: "absolute", alignSelf: "center", transform: [{ translateX: 2 }, { translateY: 2 }] }]} />
        <Pressable>
          <Text style={[styles.loginButton]}>Add Wishlist</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default WishList;

const styles = StyleSheet.create({
  loginButton: {
    borderWidth: 1,
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: "#ffa07a",
    marginTop: responsiveWidth(4),
    borderRadius: responsiveWidth(2),
    color: "#282828",
    textAlign: "center",
    fontFamily: "Lexend-Medium",
    elevation: 1,
    fontWeight: "600",
    width: responsiveWidth(45),
    height: responsiveWidth(12),
    textAlignVertical: "center",
    alignSelf: "center",
    borderTopColor: "#282828",
    borderLeftColor: "#282828",
    elevation: 1,
    fontSize: responsiveFontSize(2.8),
  },
});
