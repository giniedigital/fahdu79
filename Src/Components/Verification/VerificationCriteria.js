import { StyleSheet, Text, View, Switch, Image } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import TwoFAInputCodeBottomCard from "./TwoFAInputCodeBottomCard";
import { LoginPageErrors, SendAuthCode, chatRoomSuccess } from "../ErrorSnacks";
import { token as memoizedToken } from "../../../Redux/Slices/NormalSlices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthenticatorVia, toggleDisableAuthModal, toggleTwoFAAuthCard } from "../../../Redux/Slices/NormalSlices/HideShowSlice";
import { useGetTFACodeMutation, useGetTFAEmailCodeMutation, useLazyGetTFAStatusQuery } from "../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi";
import { useFocusEffect } from "@react-navigation/native";
import TwoFADisableModal from "./TwoFADisableModal";

const TwoFALanding = () => {
  const token = useSelector(state => state.auth.user.token);

  const dispatch = useDispatch();

  const x = useSelector((state) => state.hideShow.visibility.authenticatorVia);
  const { type, show } = useSelector((state) => state.hideShow.visibility.twoFAAuthCard);

  const [getTFACode] = useGetTFACodeMutation();
  const [getTfaEmailCode] = useGetTFAEmailCodeMutation();

  const [getTFAStatus] = useLazyGetTFAStatusQuery();

  const toggleSwitchAuth = async (type) => {
    if (type === "email" && x.auth) {
      LoginPageErrors("You need to disable App authentication first");
      return;
    }

    if (type === "auth" && x.email) {
      LoginPageErrors("You need to disable email authentication first");
      return;
    }

    if (type === "auth") {
      if (!x.auth) {
        dispatch(toggleAuthenticatorVia({ info: { auth: !x.auth } }));
        const { data, error } = await getTFACode({ token, send: true });

        if (data?.data) {
          console.log(data?.data);
          chatRoomSuccess("Code sent to your email");
          setTimeout(() => {
            dispatch(toggleTwoFAAuthCard({ info: { type: "auth", show: true } }));
          }, 500);
        }
      } else {
        dispatch(toggleDisableAuthModal({ show: true }));
      }
    }

    if (type === "email") {
      if (!x.email) {
        dispatch(toggleAuthenticatorVia({ info: { email: !x.email } }));

        const { data, error } = await getTfaEmailCode({ token, send: true });

        if (data?.data) {
          chatRoomSuccess("Code sent to your email");
          setTimeout(() => {
            dispatch(toggleTwoFAAuthCard({ info: { type: "email", show: true } }));
          }, 500);
        }
      } else {
        dispatch(toggleDisableAuthModal({ show: true }));
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const getstatus = async () => {
        const { data, error } = await getTFAStatus({ token });

        console.log(data?.data?.TFA, error);

        if (data) {
          dispatch(toggleAuthenticatorVia({ info: { email: data?.data?.TFA?.email, auth: data?.data?.TFA?.thirdParty } }));
        }
      };

      getstatus();
    }, [token])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Two Factor Authentication</Text>

      <View style={[styles.card, { elevation: 2, backgroundColor: "#fff", flexDirection: "column" }]}>
        <View style={[styles.card, { elevation: 0 }]}>
          <View style={styles.cardLeftView}>
            <Text style={styles.heading}>With Authenticator App</Text>
            <Text style={styles.description}>
              You can use <Text style={{ color: "#ffa07a" }}> Microsoft or Google Authenticator App </Text>to complete authentication process
            </Text>
          </View>
          <View style={styles.cardRightView}>
            <Switch trackColor={{ false: "#767577", true: "#f89f7b" }} thumbColor={x.auth ? "#f89f7b" : "#f4f3f4"} ios_backgroundColor="#3e3e3e" onValueChange={() => toggleSwitchAuth("auth")} value={x.auth} />
          </View>
        </View>
      </View>

      <View style={[styles.card, { elevation: 2, backgroundColor: "#fff", flexDirection: "column", marginTop: responsiveWidth(8) }]}>
        <View style={[styles.card, { elevation: 0 }]}>
          <View style={styles.cardLeftView}>
            <Text style={styles.heading}>With E-Mail Address</Text>
            <Text style={styles.description}>
              <Text style={{ color: "#ffa07a" }}>Receive email code </Text> for added security, Authenticate your account easily and securely
            </Text>
          </View>
          <View style={styles.cardRightView}>
            <Switch trackColor={{ false: "#767577", true: "#f89f7b" }} thumbColor={x.email ? "#f89f7b" : "#f4f3f4"} ios_backgroundColor="#3e3e3e" onValueChange={() => toggleSwitchAuth("email")} value={x.email} />
          </View>
        </View>
      </View>
      <TwoFAInputCodeBottomCard token={token} />
      <TwoFADisableModal token={token} />
    </View>
  );
};

export default VerificationCriteria;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf0",
    borderTopColor: "#282828",
    paddingTop: responsiveWidth(14),
    alignItems: "center",
  },
  titleText: {
    fontFamily: "MabryPro-Bold",
    color: "#282828",
    fontSize: responsiveFontSize(4),
    textAlign: "center",
    marginBottom: responsiveWidth(10),
  },
  card: {
    backgroundColor: "#fff",
    elevation: 2,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(3),
    flexDirection: "row",
    borderRadius: responsiveWidth(2),
    width: responsiveWidth(85),
    justifyContent: "space-between",
    alignItems: "center",
  },

  heading: {
    fontFamily: "MabryPro-Bold",
    color: "#282828",
    fontSize: responsiveFontSize(1.8),
  },

  description: {
    fontFamily: "MabryPro-Medium",
    color: "#282828",
    fontSize: responsiveFontSize(1.6),
  },

  cardLeftView: {
    width: responsiveWidth(65),
    gap: responsiveWidth(2),
  },
  appIconContainer: {
    flexDirection: "column",
    gap: responsiveWidth(2),
    // borderWidth: 1,
    alignSelf: "flex-start",
    width: responsiveWidth(75),
    marginTop: responsiveWidth(4),
    paddingBottom: responsiveWidth(4),
  },
});
