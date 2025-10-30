import { StyleSheet, Text, View, Animated, TouchableOpacity, FlatList, ToastAndroid } from "react-native";
import React, { useCallback } from "react";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { useSelector, useDispatch } from "react-redux";

import Modal from "react-native-modal";

import { profileActionList } from "../../../DesiginData/Data";
import DIcon from "../../../DesiginData/DIcons";
import { toggleProfileAction } from "../../../Redux/Slices/NormalSlices/HideShowSlice";
import { useUnFollowUserMutation, useUnSubscribeMutation } from "../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi";
import { chatRoomSuccess, LoginPageErrors } from "../ErrorSnacks";

/**
 * todo : One dispatch to hide show modal, another one to set seelcted sort
 */

const ProfileActionModal = ({ setIsFollowing, isFollowing, token, userName, setSubscribed }) => {

  const modalVisibility = useSelector((state) => state.hideShow.visibility.profileActionModal);

  console.log(modalVisibility);

  return (
    <Modal
      animationIn={"fadeInDown"}
      animationOut={"fadeOutUp"}
      animationInTiming={150}
      animationOutTiming={150}
      onRequestClose={() => dispatcher(toggleProfileAction())}
      transparent={true}
      isVisible={modalVisibility}
      // coverScreen={true}
      backdropColor="transparent"
      onBackButtonPress={() => dispatcher(toggleProfileAction())}
      onBackdropPress={() => dispatcher(toggleProfileAction())}
      useNativeDriver
      style={{
        width: "100%",
        alignSelf: "center",
        height: "100%",
        justifyContent: "flex-start",
      }}
    >
      <View style={[{ position: "relative" }]}>
        <View style={styles.modalInnerWrapper}>
          <FlatList
            data={profileActionList}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => handleProfileActions(item.id)}>
                <View style={styles.eachSortModalList}>
                  <DIcon name={item.iconName} provider={item.provider} size={responsiveWidth(5)} color={"#FFA07A"} />
                  <Text style={styles.eachSortByModalListText}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
            style={{ marginTop: responsiveWidth(3) }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ProfileActionModal;

const styles = StyleSheet.create({
  modalInnerWrapper: {
    height: responsiveWidth(30),
    width: responsiveWidth(40),
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    marginRight: responsiveWidth(8),
    marginTop: responsiveHeight(40),
    borderRadius: responsiveWidth(2),
    // padding: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(3),
    borderWidth: 1,
    borderColor: "#282828",
  },

  eachSortByModalListText: {
    fontSize: responsiveFontSize(1.8),
    color: "#282828",
    fontFamily: "MabryPro-Medium",
  },
  eachSortModalList: {
    flexDirection: "row",
    gap: responsiveWidth(5),
    alignItems: "center",
    marginVertical: responsiveWidth(3),
  },
});
