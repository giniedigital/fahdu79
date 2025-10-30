import { FlatList, StyleSheet, Text, View, TouchableOpacity, Pressable, Platform } from "react-native";
import React, { useCallback, useState } from "react";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { audienceList } from "../../DesiginData/Data";
import DIcon from "../../DesiginData/DIcons";

import { useSelector, useDispatch } from "react-redux";

import { setSelectedAudience } from "../../Redux/Slices/NormalSlices/AudienceSelectedSlice";
import { toggleChatRoomModal } from "../../Redux/Slices/NormalSlices/HideShowSlice";
import { nTwins, WIDTH_SIZES } from "../../DesiginData/Utility";
import Filter from "../../Assets/svg/filter.svg";

const ChatRoomAudienceSort = (item) => {
  const selectedAudinceForFilter = useSelector((state) => state.filterBy.selected.audience);

  const dispatch = useDispatch();

  const [selectedSortBox, setSelectedSortBox] = useState(0);

  let selectSortBoxHandler = useCallback((id) => {
    setSelectedSortBox(id);
    dispatch(setSelectedAudience({ audienceNumber: Number(id) }));
  }, []);

  return (
    <View style={styles.chatRoomAudienceSortContainer}>
      {/* <FlatList
        data={audienceList}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity style={[styles.sortBoxeContainer, ]} key={index} onPress={() => selectSortBoxHandler(item.id)}>
              <Text style={styles.sortBoxeText}>{item.activeName}</Text>
            </TouchableOpacity>
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled = {false}
        alwaysBounceHorizontal
        // ItemSeparatorComponent={<View style={{height:responsiveWidth(12),borderWidth:responsiveWidth(.3),borderTopRightRadius:responsiveWidth(9)}}>

        // </View>}
      /> */}

       <Pressable style={[styles.eachBox,{flexBasis : "26%"},  1 === selectedAudinceForFilter ? [{ backgroundColor : "#ffa86b"}] : null]}
       
       onPress={() => selectSortBoxHandler(1)}
       >
        <Text style = {styles.filterText}>All</Text>
      </Pressable>
      <Pressable style={[styles.eachBox, {position : 'absolute', left : responsiveWidth(18), width : responsiveWidth(48)}, 2 === selectedAudinceForFilter ? [{ backgroundColor : "#ffa86b"}] : null]}
       onPress={() => selectSortBoxHandler(2)}

      >
      <Text style = {styles.filterText}>Subscribers</Text>
      </Pressable>
      <Pressable style={[styles.eachBox, 3 === selectedAudinceForFilter ? [{ backgroundColor : "#ffa86b"}] : null]}
      onPress={() => selectSortBoxHandler(3)}
      
      >
        <Text style = {styles.filterText}>
          Followers
        </Text>
      </Pressable> 


    </View>
  );
};

export default ChatRoomAudienceSort;

const styles = StyleSheet.create({
  chatRoomAudienceSortContainer: {
    // backgroundColor: "red",
    height: Platform.OS === "android" ? responsiveHeight(6) : responsiveHeight(6),
    display: "flex",
    flexDirection: "row",
    justifyContent : 'space-between',
    position : 'relative', 
    width : responsiveWidth(92),
    overflow : 'hidden'
  },

  eachBox: {
    flexBasis  : "36%",
    borderWidth: WIDTH_SIZES[1.5],
    height: responsiveWidth(8),
    borderRadius : WIDTH_SIZES[14],
    height : "100%",
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor : 'white'
  },
  filterText : {
      fontFamily : 'Rubik-Medium',
      fontSize : responsiveFontSize(2),
      color : "#1e1e1e"
  },
  sortBoxeContainer: {
    paddingVertical: responsiveWidth(1.8),
    paddingHorizontal: responsiveWidth(6),
    borderLeftWidth: responsiveWidth(0.5),
    // height:responsiveWidth(12),
    // borderColor: "#282828",
    backgroundColor: "#fff",

    // borderBottomLeftRadius: responsiveWidth(2),
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sortBoxeText: {
    color: "#282828",
    fontFamily: "MabryPro-Bold",
    fontSize: responsiveFontSize(2),
  },

  oneSortBoxSelected: {
    backgroundColor: "#FFA07A",
    right: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    borderLeftWidth: responsiveWidth(0.5),

    // borderTopLeftRadius: responsiveWidth(2),
  },
  sortModalContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: responsiveWidth(2),
    // overflow: "hidden",
    bottom: responsiveWidth(14),
    left: responsiveWidth(4),
    borderWidth: responsiveWidth(0.4),
    height: responsiveWidth(13),
    width: responsiveWidth(13),
    borderRadius: responsiveWidth(4),
  },
  textStyle: {
    fontSize: responsiveWidth(4),
    fontFamily: "MabryPro-Regular",
    marginRight: responsiveWidth(2),
  },
  filterWrapper: {
    borderRadius: responsiveWidth(2.5),
    paddingVertical: responsiveWidth(1.8),
    paddingHorizontal: responsiveWidth(3),
    marginRight: responsiveWidth(2),
  },
});
