import { StyleSheet, View, ActivityIndicator, Button } from "react-native";
import React from "react";
import { responsiveWidth } from "react-native-responsive-dimensions";

const Loader = () => {

  return (
    <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
      <View style={{ backgroundColor: "white", padding: responsiveWidth(3), elevation: 2, borderRadius: responsiveWidth(10), justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={"#ffa07a"} size={"small"} />
      </View>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopColor: "#282828",
        paddingHorizontal: responsiveWidth(2),
      },
});
