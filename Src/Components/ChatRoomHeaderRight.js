import { StyleSheet, View, TextInput, Touchable, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { responsiveWidth } from "react-native-responsive-dimensions";
import DIcon from "../../DesiginData/DIcons";
import { clearSearchString, insertSearchString } from "../../Redux/Slices/NormalSlices/MessageSlices/ChatRoomSearchValueSlice";

import { useDispatch } from "react-redux";
import { nTwins, nTwinsFont } from "../../DesiginData/Utility";

const ChatRoomHeaderRight = () => {
  const [searchString, setSearchString] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    let debounceSearch = setTimeout(() => {
      dispatch(insertSearchString({ searchString }));
    }, 300);

    return () => {
      clearTimeout(debounceSearch);
    };
  }, [searchString]);

  const handleClearText = useCallback(() => {
    if(searchString?.length > 0) {
      dispatch(clearSearchString());
      setSearchString("");
    }

  }, [searchString]);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={() => handleClearText()}>
      <DIcon provider={"Feather"} name={ searchString?.length > 0 ? "x" : "search"} size = {nTwins(6, 4.4)}/>
      </TouchableOpacity>

      <TextInput placeholderTextColor={'#282828'} cursorColor={'#282828'} value={searchString} placeholder="Search" style={[styles.textInputStyle, styles.textStyle]} onChangeText={(str) => setSearchString(str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"").trim())} />
    </View>
  );
};

export default ChatRoomHeaderRight;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 0,
    width: responsiveWidth(30),
    height: nTwins(12, 10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    overflow: "hidden",
    marginRight: nTwins(2, -5),
  },

  textInputStyle: {
    paddingLeft: nTwins(4, 0),
    backgroundColor: "#fffdf6",
    fontFamily: "MabryPro-Regular",
    width: "80%",
    marginTop : nTwins(0, 0.6)
  },

  textStyle: {
    fontSize: nTwinsFont(1.8, 1.8),
    fontFamily: "MabryPro-Regular",
    color : "#282828"
  },

});
