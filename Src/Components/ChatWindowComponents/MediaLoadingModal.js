import { StyleSheet, Text, View, Animated, TouchableOpacity, FlatList, Image, TextInput, Switch, ToastAndroid, Pressable, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

import Modal from "react-native-modal";

import DIcon from "../../../DesiginData/DIcons";

import { useSelector, useDispatch } from "react-redux";
import { toggleAttachmentMediaLoading, toggleChatWindowPaymentModal } from "../../../Redux/Slices/NormalSlices/HideShowSlice";
import { usePaymentMutation } from "../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi";
import { resetUnlockPremiumTempData } from "../../../Redux/Slices/NormalSlices/MessageSlices/ChatWindowUnlockPremiumTempDataSlice";
import { memoizedThreadSelector } from "../../../Redux/Slices/NormalSlices/MessageSlices/ThreadSlices";
import { updatePremiumAttachmentThread } from "../../../Redux/Slices/NormalSlices/MessageSlices/ThreadSlices";
import { LoginPageErrors } from "../ErrorSnacks";

const MediaLoadingModal = ({ setCancelMediaSelection }) => {
  const dispatch = useDispatch();

  const showModal = useSelector((state) => state.hideShow.visibility.attachmentMediaLoading);

  return (
    <Modal
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      animationInTiming={150}
      animationOutTiming={150}
      onRequestClose={() => dispatch(toggleAttachmentMediaLoading({ show: false }))}
      transparent={true}
      isVisible={showModal}
      backdropColor="gray"
      onBackButtonPress={() => dispatch(toggleAttachmentMediaLoading({ show: false }))}
      onBackdropPress={() => dispatch(toggleAttachmentMediaLoading({ show: false }))}
      useNativeDriver
      style={{
        flex: 1,
      }}
    >
      <View style={styles.modalInnerWrapper}>
        <ActivityIndicator size={"small"} color={"#ffa07a"} />
        <TouchableOpacity onPress={() => dispatch(toggleAttachmentMediaLoading({show : false}))}>
          <Text style={{ fontFamily: "MabryPro-Regular", color: "#282828", marginTop: responsiveWidth(5) }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalInnerWrapper: {
    height: responsiveWidth(25),
    width: responsiveWidth(25),
    backgroundColor: "#fff",
    alignSelf: "center",
    borderRadius: responsiveWidth(3),
    padding: responsiveWidth(4),
    paddingTop: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(4),
    alignItems: "center",
    justifyContent: "center",
  },
  previewModalImageWrapper: {
    flexBasis: "35%",
    width: "100%",
  },
  previewModalInputWrapper: {
    flexBasis: "15%",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: responsiveWidth(2),
  },
  notch: {
    borderTopColor: "#000",
    borderTopWidth: responsiveWidth(0.8),
    width: responsiveWidth(10),
    borderRadius: responsiveWidth(1),
  },
  sendTipText: {
    textAlign: "center",
    fontFamily: "Lexend-Bold",
    color: "#ffa07a",
    fontSize: responsiveFontSize(3),
    marginTop: responsiveWidth(5),
  },
  loginButton: {
    borderWidth: 1,
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: "#ffa07a",
    marginTop: responsiveWidth(4),
    borderRadius: responsiveWidth(2),
    color: "#282828",
    textAlign: "center",
    fontFamily: "Lexend-Medium",
    elevation: 1,
    fontWeight: "600",
    width: responsiveWidth(35),
    height: responsiveWidth(12),
    textAlignVertical: "center",
    alignSelf: "center",
    borderTopColor: "#282828",
    borderLeftColor: "#282828",
    elevation: 1,
    fontSize: responsiveFontSize(2.8),
  },
  fahduCoinTextTitle: {
    fontFamily: "MabryPro-Regular",
    fontSize: responsiveFontSize(2.8),
    color: "#282828",
    textAlign: "center",
    marginVertical: responsiveWidth(2),
    marginRight: responsiveWidth(2),
  },
  tipContainer: {
    marginTop: responsiveWidth(1),
    width: responsiveWidth(55),
  },

  sendTipInputContainer: {
    // borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#282828",
  },
});

export default MediaLoadingModal;
