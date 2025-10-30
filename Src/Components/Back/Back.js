import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const Back = () => {

    const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image style={{ height: responsiveWidth(4.5), width: responsiveWidth(4.5) }} source={require("../../../Assets/Images/Back.png")} />
    </TouchableOpacity>
  );
};

export default Back;
