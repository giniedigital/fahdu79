import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

import { responsiveWidth } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";

import { setCurrentMyProfileContnetIndex } from "../../../Redux/Slices/NormalSlices/CurrentMyProfileContent";
const showContentList = [
  {
    id: 1,
    uri: require("../../../Assets/Images/post.png"),
    uriFocus: require("../../../Assets/Images/postFocus.png"),
  },

  {
    id: 2,
    uri: require("../../../Assets/Images/grid.png"),
    uriFocus: require("../../../Assets/Images/gridFocus.png"),
  },

  {
    id: 3,
    uri: require("../../../Assets/Images/wishlist.png"),
    uriFocus: require("../../../Assets/Images/wishlistFocus.png"),
  },
];

const ChooseContentMyProfile = ({ setCurrentProfileContentView }) => {
  const [currentSelectedMenu, setCurrentSelectedMenu] = useState(1);

  const currentContentIndex = useSelector((state) => state.currentMyProfileContent.content.index);
  
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ height: responsiveWidth(8), width: responsiveWidth(8) }} onPress={() => dispatch(setCurrentMyProfileContnetIndex({ index: 0 }))}>
        <Image source={ currentContentIndex === 0 ? showContentList[0].uriFocus : showContentList[0].uri} resizeMethod="resize" resizeMode="contain" style={{ width: "100%", height: "100%" }} />
      </TouchableOpacity>
      <TouchableOpacity style={{ height: responsiveWidth(8), width: responsiveWidth(8) }} onPress={() => dispatch(setCurrentMyProfileContnetIndex({ index: 1 }))}>
        <Image source={ currentContentIndex === 1 ? showContentList[1].uriFocus : showContentList[1].uri} resizeMethod="resize" resizeMode="contain" style={{ width: "100%", height: "100%" }} />
      </TouchableOpacity>
      <TouchableOpacity style={{ height: responsiveWidth(8), width: responsiveWidth(8) }} onPress={() => dispatch(setCurrentMyProfileContnetIndex({ index: 2 }))}>
        <Image source={ currentContentIndex === 2 ? showContentList[2].uriFocus : showContentList[2].uri} resizeMethod="resize" resizeMode="contain" style={{ width: "100%", height: "100%" }} />
      </TouchableOpacity>
    </View>
  );
};

export default ChooseContentMyProfile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: responsiveWidth(4),
    marginTop: responsiveWidth(8),
    flexDirection: "row",
    justifyContent: "center",
    gap: responsiveWidth(20),

  },
});
