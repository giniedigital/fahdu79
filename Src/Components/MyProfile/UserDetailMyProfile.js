import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import DIcon from "../../../DesiginData/DIcons";
import { useSelector } from "react-redux";

const UserDetailMyProfile = ({ userProfileDetails }) => {
  const currentUserRole = useSelector((state) => state.auth.user.role);


  return (
    <View style={styles.container}>
      <View style={styles.userName}>
        <Text style={styles.userNameTitle}>{userProfileDetails?.displayName}</Text>
        { userProfileDetails?.role === "creator" && <DIcon provider={"MaterialIcons"} name={"verified"} color="#FFA07A" size={responsiveWidth(5)} /> }
      </View>

      {currentUserRole === "creator" && (
        <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: responsiveWidth(3), paddingVertical: responsiveWidth(1), alignItems: "center" }}>
          <View style={{ flexDirection: "row", gap: responsiveWidth(1), alignItems: "center" }}>
            <DIcon color={"#FFA07A"} provider={"FontAwesome6"} name={"user-plus"} size={12} />
            <Text style={styles.likeCommentText}>
              <Text style={{ color: "#282828" }}>{userProfileDetails?.followers?.count?.followers}</Text>
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: responsiveWidth(1), alignItems: "center" }}>
            <DIcon color={"#FFA07A"} provider={"FontAwesome"} name={"heart"} size={12} />
            <Text style={styles.likeCommentText}>
              <Text style={{ color: "#282828" }}>{userProfileDetails?.likes}</Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default UserDetailMyProfile;

const styles = StyleSheet.create({
  container: {
    marginTop: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userName: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: responsiveWidth(50),
    gap: responsiveWidth(1),
  },
  userNameTitle: {
    fontFamily: "Lexend-Bold",
    color: "#282828",
    fontSize: responsiveFontSize(2),
  },
});
