import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { useNavigation } from "@react-navigation/native";
import DIcon from "../../../DesiginData/DIcons";

import { responsiveWidth } from "react-native-responsive-dimensions";

const HomeVideoBack = () => {
  const navigation = useNavigation();

  return (
    <View>
      <DIcon provider={"MaterialIcons"} name={"keyboard-backspace"} color={"#fff"} size={responsiveWidth(7)} onPress={() => navigation.goBack()} />
    </View>
  );
};

export default HomeVideoBack;

const styles = StyleSheet.create({});
