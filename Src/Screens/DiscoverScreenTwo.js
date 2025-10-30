import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, FlatList, ActivityIndicator, Platform } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import DIcon from "../../DesiginData/DIcons";
import { useLazyIsValidFollowQuery } from "../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi";
import { token as memoizedToken } from "../../Redux/Slices/NormalSlices/AuthSlice";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { LoginPageErrors } from "../Components/ErrorSnacks";

const DiscoverScreenTwo = ({ route }) => {
  const creatorsList = route?.params?.list;

  const navigation = useNavigation();

  const handleGoToOthersProfile = useCallback(async (userName, userId) => {
    navigation.navigate("othersProfile", { userName, userId });
  }, []);

  if (route?.params?.list?.length > 0) {
    return (
      <View style={styles.container}>
        <View style={styles.verticalScrollContainer}>
          <FlatList
            data={creatorsList}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={[styles.cardContainer]} onPress={() => handleGoToOthersProfile(item?.displayName, item?._id)}>
                  <Image source={{ uri: item?.profile_image?.url }} style={{ flex: 1 }} />
                  <View style={styles.userNameContainer}>
                    <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                      {item?.displayName}
                    </Text>
                    <DIcon name={"verified"} provider={"Octicons"} size={responsiveWidth(3.5)} color={"#ffa07a"} />
                  </View>
                </TouchableOpacity>
              );
            }}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "space-around" }}
          />
        </View>
      </View>
    );
  } else {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size={"small"} color={"#ffa07a"} />
      </View>
    );
  }
};

export default DiscoverScreenTwo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf0",
    borderTopColor: "#282828",
    borderTopWidth: 1,
    paddingHorizontal: responsiveWidth(2),
    paddingBottom: responsiveWidth(2),
  },

  searchContainer: {
    color: "red",
    marginTop: responsiveWidth(4),
    flexDirection: "row",
    borderWidth: 1,
    alignItems: "center",
    paddingRight: responsiveWidth(4),
    borderRadius: responsiveWidth(2),
    overflow: "hidden",
    alignSelf: "center",
    width: "94%",
  },

  searchInputBox: {
    borderWidth: 1,
  },

  textInputStyle: {
    paddingLeft: responsiveWidth(4),
    backgroundColor: "#fffdf6",
    fontFamily: "MabryPro-Regular",
    flex: 1,
  },

  textStyle: {
    fontSize: responsiveWidth(4),
    fontFamily: "MabryPro-Regular",
  },

  verticalScrollContainer: {
    marginTop: responsiveWidth(2),
    flex: 1,
  },

  verticalScroll: {},

  eachTypeSearchCategory: {
    padding: responsiveWidth(1),
    flexDirection: "column",
    marginTop: responsiveWidth(4),
  },

  categoryName: {
    fontFamily: "MabryPro-Medium",
    color: "#282828",
  },

  seeMore: {
    fontFamily: "MabryPro-Regular",
    fontSize: responsiveFontSize(1.5),
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardContainer: {
    borderWidth: Platform.OS === "ios" ? 2 : 1,
    width: responsiveWidth(28),
    height: responsiveWidth(32),
    marginTop: responsiveWidth(2),
    overflow: "hidden",
    borderRadius: responsiveWidth(2),
  },
  

  userName: {
    fontFamily: "MabryPro-Regular",
    color: "#282828",
    fontSize: responsiveFontSize(1.4),
    width: responsiveWidth(15),
  },
  userNameContainer: {
    padding: responsiveWidth(1),
    paddingLeft: responsiveWidth(2),
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveWidth(2),
  },
});
