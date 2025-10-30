import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import { responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import DIcon from "../../../DesiginData/DIcons";
import Moment from "react-moment";
import Video from "react-native-video";
import { Gesture } from "react-native-gesture-handler";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { setBrandBottomSheetData } from "../../../Redux/Slices/NormalSlices/Brands/BrandBottomSheetDetailSlice";
import { toggleBrandBottomSheet, toggleInstagrmLinkSubmitModal } from "../../../Redux/Slices/NormalSlices/HideShowSlice";
import { setCampaignData } from "../../../Redux/Slices/NormalSlices/Brands/CampaignDataSlice";

const BrandCards = ({ item }) => {
  console.log(item?.brandData?.logoimage?.url, "::::");

  const dispatch = useDispatch();

  const handleBrandIntrested = () => {
    console.log(item, "_____________");

    // dispatch(setBrandBottomSheetData({details : { title: item?.title, description: item?.overview, task: item?.task, rules: item?.rules, amount : item?.amount, id : item?._id }}))

    dispatch(setCampaignData({ campaignDetails: item }));

    dispatch(toggleInstagrmLinkSubmitModal({ show: true }));
  };

  return (
    <View style={styles.cardContainer}>
      <View style={{ paddingHorizontal: responsiveWidth(2) }}>
        <View style={styles.cardHeaderWrapper}>
          <View style={styles.headerLeftWrapper}>
            <View style={styles.headerLeftContentContainer}>
              <TouchableOpacity style={styles.profileImageContainer}>
                <Image source={!item?.brandData?.logoimage?.url ? require("../../../Assets/Images/Shoes.png") : { uri: item?.brandData?.logoimage?.url }} resizeMethod="resize" style={styles.profileImage} />
              </TouchableOpacity>

              <View style={{ position: "absolute", transform: [{ translateX: responsiveWidth(8.3) }, { translateY: responsiveWidth(-4) }] }}>
                <DIcon provider={"MaterialIcons"} name={"verified"} color="#FFA07A" size={responsiveWidth(4)} />
              </View>

              <View style={styles.headerInformation}>
                <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                  {item?.brandData?.brandName}
                </Text>
                <Text style={[styles.userName, { fontSize: responsiveFontSize(1.6), color: "#FFA07A" }]} numberOfLines={1} ellipsizeMode="tail">
                  {item?.creatorInterest}
                </Text>
              </View>
            </View>
          </View>

          {/* <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", gap: responsiveWidth(3) }}>
            <Text style={{ padding: responsiveWidth(1), backgroundColor: "#BAFCA2", fontFamily: "Rubik-Bold", fontSize: responsiveWidth(4), width: responsiveWidth(18), height: responsiveWidth(8), textAlign: "center", color: "#282828", borderRadius: responsiveWidth(2) }}>Paid</Text>
            <DIcon provider={"Entypo"} name={"dots-three-vertical"} size={responsiveWidth(5)} />
          </View> */}
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image source={!item?.image?.url ? require("../../../Assets/Images/Shoes.png") : { uri: item?.image?.url }} resizeMode="contain" style={{ width: "100%", height: "100%" }} />
      </View>

      <View style={{ paddingHorizontal: responsiveWidth(2), flexDirection: "row", justifyContent: "space-between", padding: responsiveWidth(1) }}>
        <View>
          <Text style={{ fontFamily: "Rubik-SemiBold", color: "#282828", marginLeft: responsiveWidth(3), fontSize: responsiveWidth(4.8) }}>Campaign Title: </Text>
          <Text style={{ color: "black", fontFamily: "Rubik-Regular", fontSize: responsiveWidth(4), marginLeft: responsiveWidth(3) }}>{item.campaignTitle}</Text>
        </View>

        <View style={{ backgroundColor: "#FFF0E5", borderRadius: responsiveWidth(2), width: responsiveWidth(30), justifyContent: "center", alignItems: "center", marginRight: responsiveWidth(3), borderColor: "#FFF0E5", borderWidth: 1, padding: responsiveWidth(2) }}>
          <Text style={{ color: "black", fontFamily: "Rubik-Regular" }}>Applied </Text>
          <Text style={{ color: "#FF8A38", fontFamily: "Rubik-SemiBold", fontSize: responsiveWidth(5) }}>
            {item.appliedCreatorsCount}
            <Text style={{ color: "black" }}>/{item.creatorCount}</Text>
          </Text>
        </View>
      </View>

      {/* <Pressable style={styles.cardTextWrapper} onPress={() => handleBrandIntrested()}>
        <Text style={styles.cardText}>
          {item?.overview}
            
              <Text style={{ color: "#FFA07A" }}>...read more</Text>
            
        </Text>
      </Pressable> */}
      <View style={{ marginLeft: responsiveWidth(3) }}>
        <Text style={{ fontFamily: "Rubik-SemiBold", color: "#282828", marginLeft: responsiveWidth(3), fontSize: responsiveWidth(4.8) }}>Description: </Text>

        <Text style={{ color: "black", marginLeft: responsiveWidth(3) }}>{item.campaignDescription}</Text>
      </View>

      <View style={[styles.loginButton]}>
        {/* <Text style={[styles.loginButton, { backgroundColor: "#282828", position: "absolute", alignSelf: "center", transform: [{ translateX: 2 }, { translateY: 2 }] }]}></Text>  */}
        <Pressable onPress={() => handleBrandIntrested()}>
          <Text style={styles.btnText}>Intrested</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default BrandCards;

const styles = StyleSheet.create({
  cardContainer: {
    // borderWidth: 1,
    // padding: responsiveWidth(1),
    // borderRadius: responsiveWidth(2),
    borderColor: "#282828",
    overflow: "hidden",
    marginVertical: responsiveWidth(2),
    paddingTop: responsiveWidth(2),
  },

  cardHeaderWrapper: {
    justifyContent: "space-between",
    // flexDirection: "row",
    // alignItems: "center",
    // borderWidth: 1,
    borderColor: "blue",
  },

  headerLeftWrapper: {
    height: responsiveWidth(12),
    justifyContent: "center",
    // borderWidth: 1,
    marginLeft: responsiveWidth(3),
    flexBasis: "50%",
  },
  headerLeftContentContainer: {
    height: "100%",
    borderColor: "blue",
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveWidth(4),
  },
  profileImageContainer: {
    borderColor: "#282828",
    height: responsiveWidth(11),
    width: responsiveWidth(11),
    borderRadius: responsiveWidth(10),
    overflow: "hidden",
    borderWidth: 1,
    position: "relative",
  },
  profileImage: {
    width: "100%",
    borderWidth: responsiveWidth(1),
    borderRadius: responsiveWidth(10),

    resizeMode: "cover",
    height: "100%",
  },
  userName: {
    fontFamily: "Rubik-Regular",
    color: "#282828",
    fontSize: responsiveFontSize(1.9),
  },
  status: {
    fontSize: responsiveFontSize(1.6),
    letterSpacing: 0.5,
    color: "#282828",
    fontFamily: "Rubik-Regular",
  },
  cardTextWrapper: {
    // borderWidth : 1,
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveWidth(2),
  },
  cardImageContainer: {
    paddingVertical: responsiveWidth(2),
    borderWidth: 1,
    paddingHorizontal: responsiveWidth(4),
  },
  cardText: {
    color: "#282828",
    fontFamily: "Rubik-Regular",
    fontSize: responsiveFontSize(1.8),
  },
  imageContainer: {
    overflow: "hidden",
    height: responsiveWidth(100),
    maxHeight: responsiveWidth(180),
    position: "relative",
    // borderWidth : 1,
    marginTop: responsiveWidth(2),
    marginBottom: responsiveWidth(3),
    backgroundColor: "#f3f3f3",
  },
  likeCommentText: {
    color: "#282828",
    fontSize: responsiveWidth(3.5),
    fontFamily: "Rubik-Bold",
  },
  timiming: {
    fontSize: responsiveFontSize(1.4),
    paddingLeft: responsiveWidth(2),
    paddingTop: responsiveWidth(0.8),
    color: "#35353595",
    paddingVertical: responsiveWidth(2),
  },

  loginButton: {
    borderWidth: responsiveWidth(0.5),
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: "#FFA86B",
    marginTop: responsiveWidth(4),
    borderRadius: responsiveWidth(3),
    borderColor: "#FF781A",
    color: "#282828",
    textAlign: "center",
    paddingTop: Platform.OS === "ios" ? responsiveWidth(3) : null,
    fontFamily: "Rubik-SemiBold",
    // elevation: 1,
    width: responsiveWidth(90),
    height: responsiveWidth(13),
    textAlignVertical: "center",
    alignSelf: "center",
    // borderTopColor: "#282828",
    // borderLeftColor: "#282828",
    fontSize: responsiveFontSize(2),
  },
  btnText: {
    color: "#282828",
    textAlign: "center",
    // paddingTop:responsiveWidth(3),
    fontFamily: "Rubik-SemiBold",

    width: responsiveWidth(90),
    height: responsiveWidth(13),
    textAlignVertical: "center",
    alignSelf: "center",

    fontSize: responsiveFontSize(2),
  },
});
