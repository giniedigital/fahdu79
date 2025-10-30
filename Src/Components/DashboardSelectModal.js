import { StyleSheet, Text, View, Animated, TouchableOpacity, FlatList, Platform } from "react-native";
import React, { useCallback, useState } from "react";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { useSelector, useDispatch } from "react-redux";
import { toggleChatRoomModal, toggleTableModal } from "../../Redux/Slices/NormalSlices/HideShowSlice";
import Modal from "react-native-modal";
import { chatRoomSortList } from "../../DesiginData/Data";
import { setSelectedSort } from "../../Redux/Slices/NormalSlices/SortSelectedSlice";
import DIcon from "../../DesiginData/DIcons";
import { token as memoizedToken} from "../../Redux/Slices/NormalSlices/AuthSlice";
import { useGetDashBoardDataQuery, useLazyGetDashBoardDataQuery } from "../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi";
import { setCurrentDashboardAction } from "../../Redux/Slices/NormalSlices/Brands/CurrentDashboardActionSlice";
import { useFocusEffect } from "@react-navigation/native";

/**
 * todo : One dispatch to hide show modal, another one to set seelcted sort
 */

const DashboardSelectModal = () => {
  const dispatcher = useDispatch();

  const handleCurrentActionSelected = useCallback((name) => {
    
    dispatcher(setCurrentDashboardAction({name}))

    dispatcher(toggleTableModal())
    
  }, []);

  const [data, setData]  = useState({});

  const token = useSelector(state => state.auth.user.token)


  const [trigger] = useLazyGetDashBoardDataQuery();
  
  const modalVisibility = useSelector((state) => state.hideShow.visibility.tableModal);

  useFocusEffect(useCallback(() => {

      trigger({token}).then(e=> {
        // console.log(e)
        setData(e?.data)
      })

  }, [modalVisibility]))


  return (
    <Modal
      animationIn={"fadeInDown"}
      animationOut={"fadeOutUp"}
      animationInTiming={150}
      animationOutTiming={150}
      onRequestClose={() => dispatcher(toggleTableModal())}
      transparent={true}
      isVisible={modalVisibility}
      // coverScreen={true}
      backdropColor="transparent"
      onBackButtonPress={() => dispatcher(toggleTableModal())}
      onBackdropPress={() => dispatcher(toggleTableModal())}
      style={{
        width: "100%",
        alignSelf: "center",
        height: "100%",
        justifyContent: "flex-start",
      }}
    >
      <View style={[{ position: "relative" }]}>
        <View style={styles.modalInnerWrapper}>
          <TouchableOpacity onPress={() => handleCurrentActionSelected("requested")}>
            <View style={styles.eachSortModalList}>
              <DIcon name={"back-in-time"} provider={"Entypo"} size={responsiveWidth(6)} color={"#FFA07A"} />
              <Text style={styles.eachSortByModalListText}>Requested</Text>
              <Text style={styles.eachSortByModalListText}>{data?.data?.count?.requested}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCurrentActionSelected("approved")}>
            <View style={styles.eachSortModalList}>
              <DIcon name={"check"} provider={"AntDesign"} size={responsiveWidth(6)} color={"#FFA07A"} />
              <Text style={styles.eachSortByModalListText}>Approved</Text>
              <Text style={styles.eachSortByModalListText}>{data?.data?.count?.approved}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCurrentActionSelected("review")}>
            <View style={styles.eachSortModalList}>
            <DIcon name={"back-in-time"} provider={"Entypo"} size={responsiveWidth(6)} color={"#FFA07A"} />
              <Text style={styles.eachSortByModalListText}>Review</Text>
              <Text style={styles.eachSortByModalListText}>{data?.data?.count?.review}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCurrentActionSelected("ready")}>
            <View style={styles.eachSortModalList}>
              <DIcon name={"checkmark-done-outline"} provider={"Ionicons"} size={responsiveWidth(6)} color={"#FFA07A"} />
              <Text style={styles.eachSortByModalListText}>Ready</Text>
              <Text style={styles.eachSortByModalListText}>{data?.data?.count?.ready}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCurrentActionSelected("finalApproval")}>
            <View style={styles.eachSortModalList}>
            <DIcon name={"checkmark-done-outline"} provider={"Ionicons"} size={responsiveWidth(6)} color={"#FFA07A"} />
              <Text style={styles.eachSortByModalListText}>Final Approval</Text>
              <Text style={styles.eachSortByModalListText}>{data?.data?.count?.finalApproval}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCurrentActionSelected("completed")}>
            <View style={styles.eachSortModalList}>
            <DIcon name={"checkmark-done-outline"} provider={"Ionicons"} size={responsiveWidth(6)} color={"#FFA07A"} />
              <Text style={styles.eachSortByModalListText}>Completed</Text>
              <Text style={styles.eachSortByModalListText}>{data?.data?.count?.completed}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCurrentActionSelected("revision")}>
            <View style={styles.eachSortModalList}>
            <DIcon name={"checkmark-done-outline"} provider={"Ionicons"} size={responsiveWidth(6)} color={"#FFA07A"} />
              <Text style={styles.eachSortByModalListText}>Revision</Text>
              <Text style={styles.eachSortByModalListText}>{data?.data?.count?.revision}</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default DashboardSelectModal;

const styles = StyleSheet.create({
  modalInnerWrapper: {
    height: responsiveWidth(86),
    width: responsiveWidth(55),
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    marginRight: responsiveWidth(.5),
    marginTop: Platform.OS === "android" ? responsiveHeight(5) : responsiveHeight(8.2),
    borderRadius: responsiveWidth(2),
    // padding: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(3),
    borderWidth: 1,
    borderColor: "#282828",
  },

  eachSortByModalListText: {
    fontSize: responsiveFontSize(2),
    color: "#282828",
    fontFamily: "MabryPro-Bold",
  },
  eachSortModalList: {
    flexDirection: "row",
    gap: responsiveWidth(2),
    alignItems: "center",
    marginVertical: responsiveWidth(3),
    // borderWidth : 1,
    justifyContent : 'space-around'
  },
});
