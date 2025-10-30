import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";

const EmptyComponent = ({ type }) => {
  if (type === "other") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: responsiveWidth(4) }}>
        <Text style={styles.heading}>No Posts Found</Text>
        <Text style={styles.description}>It looks like either you haven't followed them, or they haven't posted anything yet.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: responsiveWidth(4) }}>
      <Text style={styles.heading}>No Posts Found</Text>
      <Text style={[styles.description, { width: responsiveWidth(65) }]}>Looks like you haven't posted anything yet</Text>
    </View>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "Rubik-SemiBold",
    fontSize: responsiveFontSize(3),
    color: "#282828",
    marginTop : responsiveWidth(16)
  },
  description: {
    marginTop: responsiveWidth(7),
    fontFamily: "Rubik-Regular",
    textAlign: "center",
    color: "#282828",
    width: responsiveWidth(67),
    lineHeight: responsiveWidth(6),
  },
});
