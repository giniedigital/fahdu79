import { Linking, StyleSheet, Text, ToastAndroid, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { Rating } from "@kolking/react-native-rating";
import DIcon from "../../../DesiginData/DIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRateUserMutation } from "../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi";
import { RateConfirmation } from "../ErrorSnacks";
import { useDispatch } from "react-redux";
import { toggleAreYouSureModal } from "../../../Redux/Slices/NormalSlices/HideShowSlice";

const RatingSocialMyProfile = ({ areYouSureModal, userProfileDetails, ratings, isDisabled, token, userName }) => {
  const [rateUser] = useRateUserMutation();

  const [showDefaultRating, setShowDefaultRating] = useState(true);

  const [userRating, setUserRating] = useState();

  const [disable, setDisable] = useState(false);

  const dispatch = useDispatch();

  // const handleRating = useCallback(
  //   (rating) => {
  //     if (areYouSureModal) {
  //       rateUser({ token, displayName: userName, rating })
  //         .then((e) => {
  //           console.log(e);
  //           if (e?.error?.data?.status_code === 400) {
  //             ToastAndroid.show(e?.error?.data?.message, ToastAndroid.SHORT);
  //             setDisable(true);
  //           } else {
  //             setUserRating(rating);
  //             showDefaultRating(false);
  //           }
  //         })
  //         .catch((e) => {
  //           console.log("There was error while rating user", e);
  //         });
  //     } else {
  //       dispatch(toggleAreYouSureModal({ show: true }));
  //     }
  //   },
  //   [userName, token, areYouSureModal, ratings]
  // );

  if (userProfileDetails) {
    return (
      <>
        <View style={styles.container}>
          <Rating size={12} fillColor="#ffd119" touchColor="#ffd119" rating={showDefaultRating ? ratings : userRating} disabled={true} />

          <View style={{ flexDirection: "row", gap: 10 }}>
            {userProfileDetails?.socialHandles?.facebook?.url !== "" && (
              <TouchableOpacity onPress={() => Linking.openURL(userProfileDetails?.socialHandles?.facebook?.url)}>
                <DIcon provider={"Fontisto"} size={15} name={"facebook"} />
              </TouchableOpacity>
            )}

            {userProfileDetails?.socialHandles?.instagram?.url !== "" && (
              <TouchableOpacity onPress={() => Linking.openURL(userProfileDetails?.socialHandles?.instagram?.url)}>
                <DIcon provider={"Fontisto"} size={15} name={"instagram"} />
              </TouchableOpacity>
            )}

            {userProfileDetails?.socialHandles?.snapchat?.url !== "" && (
              <TouchableOpacity onPress={() => Linking.openURL(userProfileDetails?.socialHandles?.snapchat?.url)}>
                <DIcon provider={"Fontisto"} size={15} name={"snapchat"} />
              </TouchableOpacity>
            )}
            {userProfileDetails?.socialHandles?.twitter?.url !== "" && (
              <TouchableOpacity onPress={() => Linking.openURL(userProfileDetails?.socialHandles?.twitter?.url)}>
                <DIcon provider={"Fontisto"} size={15} name={"twitter"} />
              </TouchableOpacity>
            )}
            {userProfileDetails?.socialHandles?.youtube?.url !== "" && (
              <TouchableOpacity onPress={() => Linking.openURL(userProfileDetails?.socialHandles?.youtube?.url)}>
                <DIcon provider={"Fontisto"} size={15} name={"youtube-play"} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 4, paddingHorizontal: responsiveWidth(4), marginTop: responsiveWidth(2) }}>
          <DIcon provider={"Octicons"} size={18} name={"dot-fill"} color={"#bafca2"} />
          <Text style={{ fontFamily: "Lexend-Regular", fontSize: responsiveFontSize(1.6) }}>Online</Text>
        </View>
      </>
    );
  }
};

export default RatingSocialMyProfile;

const styles = StyleSheet.create({
  container: {
    color: "#282828",
    paddingHorizontal: responsiveWidth(4),
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: responsiveWidth(3),
  },
});
