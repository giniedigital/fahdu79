import { StyleSheet, Text, View, Animated, TouchableOpacity, FlatList, Image, TextInput, Switch, ToastAndroid, Pressable, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

import Modal from "react-native-modal";

import { useSelector, useDispatch } from "react-redux";
import { toggleAreYouSureModal } from "../../Redux/Slices/NormalSlices/HideShowSlice";

const AreYouSure = ({ setAreYouSureModal }) => {
  const dispatch = useDispatch();

  const showModal = useSelector((state) => state.hideShow.visibility.areYouSureModal);


  const handleAreYouSure = (output) => {
    
        setAreYouSureModal(output)
        dispatch(toggleAreYouSureModal({show : false}))

  }

  return (
    <Modal
      animationIn={"fadeIn"}
      animationOut={"slideOutDown"}
      animationInTiming={150}
      animationOutTiming={150}
    //   onRequestClose={() => dispatch(toggleAttachmentMediaLoading({ show: false }))}
      transparent={true}
      isVisible={showModal}
      backdropColor="transparent"
    //   onBackButtonPress={() => dispatch(toggleAttachmentMediaLoading({ show: false }))}
    //   onBackdropPress={() => dispatch(toggleAttachmentMediaLoading({ show: false }))}
      useNativeDriver
      style={{
        flex: 1,
      }}
    >
      <View style={styles.modalInnerWrapper}>
        <View style={{ width: "100%", height: "100%" }}>
          <Text style={{ textAlign: "center", fontFamily: "MabryPro-Medium", height: responsiveWidth(14), color: "#282828" }}>Give Rating</Text>

          <TouchableOpacity onPress={() => handleAreYouSure(true)}>
            <Text style={[styles.button, { color: "green" }]}>YES</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleAreYouSure(false)}>
            <Text style={[styles.button, { color: "red" }]}>NO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalInnerWrapper: {
    height: responsiveWidth(35),
    width: responsiveWidth(70),
    backgroundColor: "#fff",
    alignSelf: "center",
    borderRadius: responsiveWidth(3),
    paddingVertical: responsiveWidth(2),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },

  button: {
    fontFamily: "MabryPro-Bold",
    textAlign: "center",
    padding: responsiveWidth(2),
    borderTopWidth: 1,
    borderColor: "gray",
    fontSize: responsiveFontSize(1.8),
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

export default AreYouSure;
