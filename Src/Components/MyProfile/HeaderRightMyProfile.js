import { StyleSheet, View, TextInput, Touchable, TouchableOpacity, Image, Pressable } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { responsiveWidth } from "react-native-responsive-dimensions";

import { useDispatch, useSelector } from "react-redux";
// import { setPostsCardType, toggleCreatePostBottomSheet, toggleHomeBottomSheet } from "../../Redux/Slices/NormalSlices/HideShowSlice";
import DIcon from "../../../DesiginData/DIcons";
import { toggleCreatePostBottomSheet } from "../../../Redux/Slices/NormalSlices/HideShowSlice";
import { useNavigation } from "@react-navigation/native";

const HeaderRightMyProfile = () => {

  const dispatch = useDispatch()

  const postCardType = useSelector((state) => state.hideShow.visibility.postCardType);

  const loggedUserInfo = useSelector((state) => state.auth.user)

  const navigation = useNavigation()

  return (
    <View style={styles.wrapper}>
      {postCardType === "normal" && loggedUserInfo?.role === "creator" ? (
        <TouchableOpacity onPress={() => dispatch(toggleCreatePostBottomSheet({show : 1}))}>
          <DIcon provider={"Feather"} name={"plus-circle"} size={responsiveWidth(7)} color={"#282828"} />
        </TouchableOpacity>
      ) : null}

      {postCardType === "normal" ? (
        <TouchableOpacity onPress={() => navigation.navigate("settingsPage")}>
          <DIcon provider={"Ionicons"} name={"settings-sharp"} size={responsiveWidth(7)} color={"#282828"} />
        </TouchableOpacity>
      ) : (
        <Pressable onPress={() => dispatch(setPostsCardType({ postCardType: "normal" }))}>
          <Image source={require("../../../Assets/Images/BrandButton.png")} style={{ height: responsiveWidth(8), width: responsiveWidth(8), resizeMode: "contain", alignSelf: "center" }} />
        </Pressable>
      )}
    </View>
  );
};

export default HeaderRightMyProfile;

const styles = StyleSheet.create({
  wrapper: {
    width: responsiveWidth(25),
    height: responsiveWidth(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingLeft: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    overflow: "hidden",
    marginRight: responsiveWidth(4),
    gap: responsiveWidth(5),
  },

  textStyle: {
    fontSize: responsiveWidth(4),
    fontFamily: "MabryPro-Regular",
  },
});
