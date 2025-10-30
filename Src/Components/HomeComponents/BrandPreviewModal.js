import { StyleSheet, Text, View, Animated, TouchableOpacity, FlatList, Image, TextInput, Switch, ToastAndroid, Pressable, ActivityIndicator } from "react-native";
import React, { useCallback, useState } from "react";
import { responsiveFontSize, responsiveScreenWidth, responsiveWidth } from "react-native-responsive-dimensions";

import Modal from "react-native-modal";

import DIcon from "../../../DesiginData/DIcons";

import { useSelector, useDispatch } from "react-redux";
import { toggleBrandPreviewModal, toggleChatWindowAttachmentPreviewModal } from "../../../Redux/Slices/NormalSlices/HideShowSlice";

import { useSendMessageMutation } from "../../../Redux/Slices/QuerySlices/roomListSliceApi";
import { token as memoizedToken } from "../../../Redux/Slices/NormalSlices/AuthSlice";

import VideoPlayer from "react-native-video-controls";

import { dismissProgressNotification, displayNotificationProgressIndicator } from "../../../Notificaton";

import { useSubmitMediaForApprovalMutation, useUploadAttachmentMutation, useSubmitMediaForRevisionMutation } from "../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi";
import { videoReducer } from "../../../FFMPeg/FFMPegModule";
import { LoginPageErrors, chatRoomSuccess } from "../ErrorSnacks";
import { autoLogout } from "../../../AutoLogout";
import { setCurrentDashboardAction } from "../../../Redux/Slices/NormalSlices/Brands/CurrentDashboardActionSlice";

const BrandPreviewModal = ({ attachmentType, selectedMedia, setAttachmentType, currentDashboardAction, id, getList }) => {
  // selectedMedia?.image?.fileData?.uri

  // console.log(attachmentType, selectedMedia)

  //!<---------------------Refs--------->

  const attachmentInputRef = React.useRef();
  const videoRef = React.useRef();

  //!<---------------------States--------->
  const dispatcher = useDispatch();

  const [uploadAttachment] = useUploadAttachmentMutation();

  const [submitMediaForApproval] = useSubmitMediaForApprovalMutation();

  const [submitMediaForRevision] = useSubmitMediaForRevisionMutation();

  const [amount, setAmount] = useState(undefined);

  const [disableSendBtton, setDisableSendButton] = useState(false);

  const [next, setNext] = useState(false);

  //!<---------------------Selectors--------->

  const token = useSelector(state => state.auth.user.token);

  const previewModalShow = useSelector((state) => state.hideShow.visibility.brandPreviewModal);

  //!<---------------------Handlers--------->

  const handlePreviewModalClose = () => {
    try {
      dispatcher(toggleBrandPreviewModal());
    } catch (e) {
      console.log("handlePreviewModalClose", e.message);
    }
  };

  // console.log(amount)

  const handleUploadAttachment = useCallback(() => {
    console.log("🚀 Handle upload");
    displayNotificationProgressIndicator();

    if (attachmentType !== undefined) {
      setDisableSendButton(true);

      if (attachmentType === "image") {
        const formData = new FormData();
        formData.append("keyName", "brand_media"); //Will bind with every attachemnt upload
        formData.append("file", selectedMedia?.image?.fileData);

        console.log(selectedMedia?.image?.fileData);

        uploadAttachment({ token, formData })
          .then((e) => {
            //2nd Step

            if (e?.error?.status === "FETCH_ERROR") {
              LoginPageErrors("Please check your network");
              setDisableSendButton(false);
            } else {
              if (e?.data?.statusCode === 200) {
                if (currentDashboardAction === "approved") {
                  submitMediaForApproval({ token, id, url: e?.data?.data?.url }).then((e) => {
                    if (e?.data?.statusCode === 200) {
                      setDisableSendButton(false);
                      handlePreviewModalClose();
                      setAttachmentType(undefined);
                      dismissProgressNotification();
                      dispatcher(setCurrentDashboardAction({ name: "requested" }));
                      ToastAndroid.show("Media sent for approval", ToastAndroid.SHORT)
                    } else {
                      ToastAndroid.show("There was some error", ToastAndroid.SHORT);
                      setDisableSendButton(false);
                      console.log(e);
                    }
                  });
                } else if (currentDashboardAction === "revision") {
                  submitMediaForRevision({ token, id, url: e?.data?.data?.url }).then((e) => {
                    if (e?.data?.statusCode === 200) {
                      setDisableSendButton(false);
                      handlePreviewModalClose();
                      setAttachmentType(undefined);
                      dismissProgressNotification();
                      dispatcher(setCurrentDashboardAction({ name: "requested" }));
                      ToastAndroid.show("Media sent for revision", ToastAndroid.SHORT)
                    } else {
                      ToastAndroid.show("There was some error", ToastAndroid.SHORT);
                      setDisableSendButton(false);
                    }
                  });
                } else if (e?.error?.data?.status === 401) {
                  autoLogout();
                }
              } else {
                console.log("UploadAttachment Image Error Server status not 200", e);
              }
            }
          })
          .catch((e) => console.log("Edsfdsf", e));
      }

      
      if (attachmentType === "video") {
        try {
          async function videoFormatter(uri) {
            const result = await videoReducer(uri);
            console.log(uri);
            return result;
          }

          videoFormatter(selectedMedia?.video?.fileData?.uri).then(async (compressedVideoUrl) => {
            if (compressedVideoUrl) {
              const formData = new FormData();
              formData.append("keyName", "brand_media"); //Will bind with every attachemnt upload
              formData.append("file", {
                name: selectedMedia?.video?.fileData?.name,
                type: selectedMedia?.video?.fileData?.type,
                uri: compressedVideoUrl,
              });

              uploadAttachment({ token, formData }).then((e) => {
                console.log("Uploading video");
                console.log(e);

                if (e?.data?.statusCode === 200) {
                  if (currentDashboardAction === "approved") {
                    submitMediaForApproval({ token, id, url: e?.data?.data?.url }).then((e) => {
                      setDisableSendButton(false);
                      handlePreviewModalClose();
                      setAttachmentType(undefined);
                      dismissProgressNotification();
                    });
                  } else if (currentDashboardAction === "revision") {
                    submitMediaForRevision({ token, id, url: e?.data?.data?.url }).then((e) => {
                      setDisableSendButton(false);
                      handlePreviewModalClose();
                      setAttachmentType(undefined);
                      dismissProgressNotification();
                    });
                  } else {
                    console.log("Final round");
                  }
                } else {
                  console.log("Video upload error");
                }
              });
            }
          });
        } catch (e) {
          console.log("Vide Upload CWPM Error", e.message);
        }
      }
    } else {
      console.log("No attachement selected to send");
    }
  }, [selectedMedia, attachmentType, amount, id]);

  return (
    <Modal
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      animationInTiming={150}
      animationOutTiming={150}
      onRequestClose={() => (disableSendBtton ? console.log("Still uploading") : handlePreviewModalClose())}
      transparent={true}
      isVisible={previewModalShow}
      backdropColor="black"
      onBackButtonPress={() => (disableSendBtton ? console.log("Still uploading") : handlePreviewModalClose())}
      onBackdropPress={() => (disableSendBtton ? console.log("Still uploading") : handlePreviewModalClose())}
      useNativeDriver
      style={{
        flex: 1,
      }}
    >
      <View style={styles.modalInnerWrapper}>
        <View style={styles.notch} />
        <Text style={styles.attachFileText}>Attach File</Text>
        <View style={styles.previewModalImageWrapper}>
          {attachmentType !== "video" ? (
            <Image source={!selectedMedia?.image?.fileData?.uri ? require("../../../Assets/Images/Profile.jpg") : { uri: selectedMedia?.image?.fileData?.uri }} style={{ flex: 1, width: "100%", resizeMode: "cover", borderRadius: responsiveWidth(4) }} resizeMethod="resize" resizeMode="cover" />
          ) : (
            <VideoPlayer
              ref={videoRef}
              style={{
                flex: 1,
                width: "100%",
                backgroundColor: "#f3f3f3",
                borderRadius: responsiveWidth(4),
              }}
              source={{ uri: selectedMedia?.video?.fileData?.uri }}
              toggleResizeModeOnFullscreen={true}
              resizeMode={"contain"}
              seekColor="purple"
            />
          )}
        </View>

        <View style={styles.modalSendContainer}>
          <View style={styles.userWarning}>
            <Text style={{ fontFamily: "MabryPro-Regular", color: "#ffa07a", textAlign: "center", marginVertical: responsiveWidth(2), fontSize: responsiveFontSize(2) }}>You are about to send your task for review</Text>
            <Text style={{ fontFamily: "Lexend-Medium", color: "#282828", textAlign: "center" }}>1. Make sure you've completed the task</Text>
            <Text style={{ fontFamily: "Lexend-Medium", color: "#282828", textAlign: "center", marginVertical: responsiveWidth(1) }}>2. You've followed the rules provided</Text>
          </View>

          {!next ? (
            <View style={{ position: "relative", alignSelf: "center" }}>
              <Text style={[styles.loginButton, { backgroundColor: "#282828", position: "absolute", alignSelf: "center", transform: [{ translateX: 2 }, { translateY: 2 }] }]} />
              <Pressable onPress={() => setNext(true)}>
                <Text style={[styles.loginButton]}>
                  NEXT <DIcon provider={"FontAwesome6"} name={"caret-right"} />
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.confirmationView}>
              <Text style={styles.confirmationViewTextTitle}>You are about to send attachement ?</Text>
              <View style={{ flexDirection: "row", width: responsiveWidth(40), justifyContent: "space-around" }}>
                <View style={[{ position: "relative", alignSelf: "center" }, disableSendBtton ? { display: "none" } : { display: "flex" }]}>
                  <Text style={[styles.loginButton, { backgroundColor: "#282828", position: "absolute", alignSelf: "center", transform: [{ translateX: 2 }, { translateY: 2 }], width: responsiveWidth(15) }]} />
                  <Pressable onPress={() => setNext(false)}>
                    <Text style={[styles.loginButton, { width: responsiveWidth(15) }]}>
                      <DIcon provider={"FontAwesome6"} name={"xmark"} />
                    </Text>
                  </Pressable>
                </View>
                <View style={{ position: "relative", alignSelf: "center" }}>
                  <Text style={[styles.loginButton, { backgroundColor: "#282828", position: "absolute", alignSelf: "center", transform: [{ translateX: 2 }, { translateY: 2 }], width: responsiveWidth(15) }]} />
                  <Pressable disabled={disableSendBtton} onPress={handleUploadAttachment}>
                    {disableSendBtton ? (
                      <ActivityIndicator size={"small"} color="#282828" style={[styles.loginButton, { width: responsiveScreenWidth(15) }]} />
                    ) : (
                      <Text style={[styles.loginButton, { width: responsiveWidth(15) }]}>
                        <DIcon provider={"FontAwesome6"} name={"check"} />
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalInnerWrapper: {
    height: responsiveWidth(260),
    width: responsiveWidth(99),
    backgroundColor: "#fffdf6",
    alignSelf: "center",
    borderTopLeftRadius: responsiveWidth(3),
    borderTopRightRadius: responsiveWidth(3),
    padding: responsiveWidth(4),
    paddingTop: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(4),
    alignItems: "center",
    marginLeft: responsiveWidth(1),
    marginTop: responsiveWidth(75),
  },

  previewModalImageWrapper: {
    flexBasis: "35%",
    width: "100%",
  },

  previewModalSendButton: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "400",
    color: "#205cd4",
    textAlign: "right",
    marginLeft: responsiveWidth(10),
  },

  modalSendContainer: {
    flexDirection: "column",
    alignItems: "space-around",
    gap: 5,
  },

  freePaidToggleText: {
    fontSize: responsiveFontSize(2.2),
    textAlignVertical: "center",
  },

  freePaidToggle: {
    width: responsiveWidth(70),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: responsiveWidth(2),
    backgroundColor: "#f3f3f3",
    height: responsiveWidth(12),
    borderColor: "#282828",
  },

  amountInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 1,
    padding: responsiveWidth(1),
    borderColor: "#282828",
    height: responsiveWidth(14),
    borderWidth: 1,
    alignSelf: "center",
    marginTop: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    width: responsiveWidth(62),
    fontFamily: "MabryPro-Regular",
  },
  notch: {
    borderTopColor: "#000",
    borderTopWidth: responsiveWidth(0.8),
    width: responsiveWidth(10),
    borderRadius: responsiveWidth(1),
  },
  attachFileText: {
    textAlign: "center",
    fontFamily: "Lexend-Bold",
    color: "#ffa07a",
    fontSize: responsiveFontSize(2.2),
    marginVertical: responsiveWidth(2),
  },
  free: {
    borderWidth: 1,
    flexBasis: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: responsiveWidth(2),
    borderBottomLeftRadius: responsiveWidth(2),
    backgroundColor: "#fffdf6",
  },
  paid: {
    borderWidth: 1,
    flexBasis: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: responsiveWidth(2),
    borderBottomRightRadius: responsiveWidth(2),
    backgroundColor: "#fffdf6",
  },
  titleSetPrice: {
    fontSize: responsiveFontSize(2),
    backgroundColor: "#e3dff2",
    height: "90%",
    borderRadius: responsiveWidth(2),
    textAlign: "center",
    textAlignVertical: "center",
    flexBasis: "55%",
    fontFamily: "MabryPro-Regular",
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
    width: responsiveWidth(40),
    height: responsiveWidth(13),
    textAlignVertical: "center",
    alignSelf: "center",
    borderTopColor: "#282828",
    borderLeftColor: "#282828",
    elevation: 1,
    fontSize: responsiveFontSize(2.8),
  },
  confirmationView: {
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    marginTop: responsiveWidth(2),
  },
  confirmationViewTextTitle: {
    fontFamily: "MabryPro-Bold",
  },

  userWarning: {
    width: responsiveWidth(90),
    padding: responsiveWidth(2),
    flexDirection: "column",
  },
});

export default BrandPreviewModal;
