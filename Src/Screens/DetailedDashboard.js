import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, ToastAndroid, Pressable, Platform } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { responsiveWidth } from "react-native-responsive-dimensions";
import DIcon from "../../DesiginData/DIcons";
import DashboardSelectModal from "../Components/DashboardSelectModal";
import { useDispatch, useSelector } from "react-redux";
import { toggleBrandLinkSubmitSheet, toggleBrandPreviewModal, toggleDetailedBrandBottomSheet, toggleTableModal } from "../../Redux/Slices/NormalSlices/HideShowSlice";
import { useLazyGetCampaignListQuery } from "../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi";
import Moment from "react-moment";
import LinearGradient from "react-native-linear-gradient";
import { launchImageLibrary } from "react-native-image-picker";

import BrandPreviewModal from "../Components/HomeComponents/BrandPreviewModal";
import BrandLinkSubmitSheet from "../Components/HomeComponents/BrandLinkSubmitSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import DetailedBrandBottomSheet from "../Components/HomeComponents/DetailedBrandBottomSheet";

const DetailedDashboard = ({ route }) => {
  const dispatch = useDispatch();

  const currentDashboardAction = useSelector((state) => state.currentDashboardAction.action.name);

  const [getCampaignList, {}] = useLazyGetCampaignListQuery();

  const [campaignList, setCampaignList] = useState([]);

  const [showActionButton, setShowActionButton] = useState(false);

  const [attachementType, setAttachmentType] = useState("image");

  const [selectedMedia, setSelectedMedia] = useState({});

  const [campaignId, setCampaignId] = useState("");

  const brandBottomSheetVisibility = useSelector((state) => state.hideShow.visibility.brandLinkSubmitSheet);

  const previewModalShow = useSelector((state) => state.hideShow.visibility.brandPreviewModal);

  const [sheetData, setSheetData] = useState({});


  useFocusEffect(useCallback(() => {

    const getList = async () => {
      console.log("Called....");

      let { data } = await getCampaignList({ token: route.params.token, filter: currentDashboardAction, page: 1 }, false);

      if (data?.data?.responses?.length === 0) {
        setCampaignList([]);
      } else {
        setCampaignList(data?.data?.responses);
      }
    };
    getList();

    if (currentDashboardAction === "approved" || currentDashboardAction === "revision" || currentDashboardAction === "ready") {
      setShowActionButton(true);
    } else {
      setShowActionButton(false);
    }
  }, [currentDashboardAction, brandBottomSheetVisibility, previewModalShow, attachementType]))



  // console.log(campaignList)

  const handleSendAttachment = async (id) => {
    // console.log(id)

    if (currentDashboardAction === "ready") {
      setCampaignId(id);
      dispatch(toggleBrandLinkSubmitSheet({ show: 1 }));
    } else {
      if (showActionButton === true) {
        const mediaImageInfo = await launchImageLibrary({ mediaType: "mixed" });

        if (!mediaImageInfo?.didCancel) {
          if (mediaImageInfo?.assets[0]?.type?.search("image") >= 0) {
            console.log("Selected Image For Brand");

            if (mediaImageInfo?.assets[0]?.fileSize > 20000000) {
              //20 MB
              ToastAndroid.show("Image Size must be lower than 20 MB", ToastAndroid.SHORT);

              return 0;
            } else {
              setAttachmentType("image");

              setSelectedMedia({
                image: {
                  fileData: {
                    name: mediaImageInfo?.assets[0]?.fileName,
                    type: mediaImageInfo?.assets[0]?.type,
                    uri: mediaImageInfo?.assets[0]?.uri,
                  },
                },
              });

              setCampaignId(id);

              dispatch(toggleBrandPreviewModal());
            }
          } else {
            console.log("Selected Video For Brand");

            if (mediaImageInfo?.assets[0]?.fileSize > 60000000) {
              ToastAndroid.show("Video Size must be lower than 60 MB", ToastAndroid.SHORT);
              return 0;
            } else {
              setAttachmentType("video");

              setSelectedMedia({
                video: {
                  fileData: {
                    name: mediaImageInfo?.assets[0]?.fileName,
                    type: mediaImageInfo?.assets[0]?.type,
                    uri: mediaImageInfo?.assets[0]?.uri,
                  },
                },
              });

              setCampaignId(id);

              dispatch(toggleBrandPreviewModal());
            }
          }
        } else {
          console.log("User cancllll");
        }
      }
    }
  };

  const handleSheetOpen = (item) => {

    setSheetData(item);
    dispatch(toggleDetailedBrandBottomSheet({ show: 1 }));
  };

  return (
    <GestureHandlerRootView style={[styles.container]}>
      <View style={{ borderTopWidth: 1, borderColor: "#282828" }}></View>
      <TouchableOpacity style={styles.actionButton} onPress={() => dispatch(toggleTableModal())}>
        <Text style={{ fontFamily: "MabryPro-Medium", textTransform: "uppercase", color: "#FFA07A" }}>{currentDashboardAction}</Text>
        <DIcon provider={"AntDesign"} name={"caretdown"} size={responsiveWidth(4)} />
      </TouchableOpacity>

      <View style={styles.scrollViewContainer}>
        <ScrollView horizontal style={[styles.scrollViewDesign]} contentContainerStyle={{ flexDirection: "column", marginLeft: responsiveWidth(3) }}>
          <View style={[styles.row, { backgroundColor: "#E8E8E8" }]}>
            <Text style={[styles.cell, { width: responsiveWidth(80) }]}>Title</Text>
            <Text style={[styles.cell]}>Time</Text>
            <Text style={[styles.cell]}>Rating</Text>
            <Text style={[styles.cell]}>Budget</Text>
            <Text style={[styles.cell]}>Status</Text>
            <Text style={[styles.cell]}>Action</Text>
          </View>
          <FlatList
            data={campaignList}
            renderItem={({ item }) => {
              return (
                <>
                  <View style={[styles.row, { marginTop: responsiveWidth(0.5) }]}>
                    <Text style={[styles.cell, { width: responsiveWidth(80), textAlign: "center" }]}>{item?.title}</Text>
                    <Text style={[styles.cell, { width: responsiveWidth(60) }]}>
                      <Moment style={styles.timiming} element={Text} fromNow>
                        {item?.time}
                      </Moment>
                    </Text>
                    <Text style={[styles.cell, { width: responsiveWidth(60) }]}>{item?.ratings}</Text>
                    <Text style={[styles.cell, { width: responsiveWidth(60) }]}>{item?.budget}</Text>
                    <Text style={[styles.cell, { width: responsiveWidth(60) }]}>{item?.status}</Text>
                    <Pressable style={[styles.cell, { width: responsiveWidth(60), justifyContent: "center", alignItems: "center" }]} onPress={() => handleSendAttachment(item?.campaignId)}>
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity style={{ backgroundColor: "#FFA07A", padding: responsiveWidth(2), borderRadius: responsiveWidth(2), fontFamily: "MabryPro-Medium", marginRight: responsiveWidth(2) }} onPress={() => handleSheetOpen(item)}>
                          <DIcon provider={"Fontisto"} name={"eye"} />
                        </TouchableOpacity>

                        {showActionButton ? <Text style={{ backgroundColor: "#FFA07A", padding: responsiveWidth(2), borderRadius: responsiveWidth(2), fontFamily: "MabryPro-Bold", color: "#282828" }}>Apply</Text> : ""}
                      </View>
                    </Pressable>
                  </View>
                  <LinearGradient colors={["#FFFDF650", "#43423D50", "#FFFDF650"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.linearGradient}>
                    <View style={{ height: 1 }} />
                  </LinearGradient>
                </>
              );
            }}
            keyExtractor={(item, index) => index}
          />
        </ScrollView>
      </View>

      <DashboardSelectModal />
      <BrandPreviewModal attachmentType={attachementType} selectedMedia={selectedMedia} setAttachmentType={setAttachmentType} currentDashboardAction={currentDashboardAction} id={campaignId} />
      <BrandLinkSubmitSheet id={campaignId} />
      <DetailedBrandBottomSheet sheetData={sheetData} />
    </GestureHandlerRootView>
  );
};

export default DetailedDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf0",
    borderTopColor: "#282828",
    borderTopWidth: 1,
  },
  scrollViewContainer: {
    height: responsiveWidth(150),
  },
  scrollViewDesign: {
    // borderWidth : 1,
    // backgroundColor : "#f3f3f3"
  },
  row: {
    width: responsiveWidth(250),
    height: responsiveWidth(12),
    // borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  cell: {
    fontFamily: "MabryPro-Bold",
    height: "100%",
    textAlignVertical: "center",
    textAlign: "center",
    width: responsiveWidth(60),
    overflow : 'hidden',
    lineHeight  : Platform.OS === "ios" ? 50 : 0
  },
  actionButton: {
    borderWidth: 1,
    width: responsiveWidth(45),
    marginRight: 3,
    padding: responsiveWidth(2),
    alignSelf: "flex-end",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: responsiveWidth(2),
    marginVertical: responsiveWidth(8),
  },
});
