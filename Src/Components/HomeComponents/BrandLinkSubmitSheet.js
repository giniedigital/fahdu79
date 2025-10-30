import { StyleSheet, View, TouchableOpacity, Text, Image, Pressable, ActivityIndicator, ToastAndroid, Keyboard } from "react-native";
import React, { useMemo, useCallback, useRef, useState } from "react";
import { responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import DIcon from "../../../DesiginData/DIcons";
import { useDispatch, useSelector } from "react-redux";
import { toggleBrandLinkSubmitSheet } from "../../../Redux/Slices/NormalSlices/HideShowSlice";
import { token as memoizedToken } from "../../../Redux/Slices/NormalSlices/AuthSlice";
import { useRequestBrandCollabMutation, useSubmitLinkToBrandMutation, useSubmitMediaForFinalApprovalMutation } from "../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi";
import { LoginPageErrors, chatRoomSuccess } from "../ErrorSnacks";

const BrandLinkSubmitSheet = ({ id }) => {
  const bottomSheetRef = useRef(null);

  const dispatch = useDispatch();

  const brandBottomSheetVisibility = useSelector((state) => state.hideShow.visibility.brandLinkSubmitSheet);

  const [submitLinkToBrand] = useSubmitLinkToBrandMutation();

  const [link, setLink] = useState("");

  const [loading, setLoading] = useState(false);

  const token = useSelector(state => state.auth.user.token);

  const [requestBrandCollab] = useRequestBrandCollabMutation();

  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      console.log(index);
      dispatch(toggleBrandLinkSubmitSheet({ show: -1 }));
    } else if (index === 1) {
      dispatch(toggleBrandLinkSubmitSheet({ show: 1 }));
    }
  }, []);

  const handleSubmitLink = useCallback(() => {

    Keyboard.dismiss()


    function isValidInstagramLink(url) {
      const instagramRegex = /^https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9_\.]+\/?$/;
      return instagramRegex.test(url);
    }

    if (isValidInstagramLink(link)) {
      setLoading(true);

      submitLinkToBrand({ token, id, url: link }).then((e) => {
        console.log(e);
        chatRoomSuccess("Link submitted successfully!")
        setLoading(false);
        bottomSheetRef.current.close();
        setLink("")

      });
    } else {
      LoginPageErrors("Invalid link provided")
    }
    
  }, [link, id]);

  return (
    <BottomSheet ref={bottomSheetRef} index={brandBottomSheetVisibility} snapPoints={snapPoints} onChange={handleSheetChanges} enablePanDownToClose={true} backgroundStyle={{ backgroundColor: "#fff" }}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Social Media Link</Text>
        <Text style={{ textAlign: "center", fontFamily: "Lexend-Medium" }}>You are about to send task for review</Text>
        {/* <ImageBackground source={require("../../../Assets/Images/light_gray.jpg")} style={{ width: "100%", height: responsiveWidth(30) }}> */}
        <View style={{ marginTop: responsiveWidth(4), paddingHorizontal: responsiveWidth(4) }}>
          <Text style={{ textAlign: "left", marginVertical: responsiveWidth(2), fontFamily: "Lexend-Medium" }}>Note</Text>
          <Text style={styles.notePoints}>
            <DIcon provider={"Octicons"} color={"#FF9E99"} name={"dot-fill"} size={responsiveWidth(4)} /> Make sure you have completed given task.
          </Text>
          <Text style={styles.notePoints}>
            <DIcon provider={"Octicons"} color={"#FF9E99"} name={"dot-fill"} size={responsiveWidth(4)} /> Followed mentioned rules if any.
          </Text>
        </View>

        {/* </ImageBackground> */}
        <Text style={{ textAlign: "center", fontFamily: "Lexend-Medium", marginTop: responsiveWidth(8) }}>Your Instagram Content Link</Text>

        <View style={styles.sendTipInputContainer}>
          <BottomSheetTextInput style={styles.amountInput} keyboardType="url" cursorColor={"#FF9E99"} onChangeText={(x) => setLink(x)} value={link} />
          <DIcon provider={"AntDesign"} name={"link"} color="#282828" />
        </View>

        <View style={{ position: "relative", alignSelf: "center" }}>
          <Text style={[styles.loginButton, { backgroundColor: "#282828", position: "absolute", alignSelf: "center", transform: [{ translateX: 2 }, { translateY: 2 }] }]} />
          <Pressable onPress={handleSubmitLink}>{!loading ? <Text style={[styles.loginButton]}>SUBMIT</Text> : <ActivityIndicator size={"small"} color={"#282828"} style={styles.loginButton} />}</Pressable>
        </View>
      </View>
    </BottomSheet>
  );
};

export default BrandLinkSubmitSheet;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#fff",
    height: "100%",
    paddingHorizontal: responsiveWidth(2),
  },
  title: {
    fontFamily: "Lexend-Medium",
    textAlign: "center",
    color: "#FF9E99",
    fontSize: responsiveFontSize(2.2),
  },
  notePoints: {
    fontFamily: "MabryPro-Medium",
    color: "#282828",
    flexDirection: "row",
    alignItems: "center",
  },

  sendTipInputContainer: {
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "70%",
    borderRadius: responsiveWidth(2),
    borderColor: "#282828",
    marginTop: responsiveWidth(4),
    alignSelf: "center",
  },
  amountInput: {
    flexBasis: "70%",
    color: "#282828",
    fontFamily: "MabryPro-Regular",
    fontSize: responsiveFontSize(2.2),
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
});
