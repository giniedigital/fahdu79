import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback } from "react";
import DIcon from "../../../DesiginData/DIcons";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { useSelector, useDispatch } from "react-redux";

import { toggleTransactionSheet } from "../../../Redux/Slices/NormalSlices/HideShowSlice";

const TransactionHeaderRight = () => {
  const dispatch = useDispatch();

  const handleShowTransactionFilterSheet = useCallback(() => {
    dispatch(toggleTransactionSheet({ show: 1 }));
  }, []);

  return (
    <TouchableOpacity style={styles.filterContainer} onPress={handleShowTransactionFilterSheet}>
      <Image source={require("../../../Assets/Images/transactionFilter.png")} style={{ height: responsiveWidth(6), width: responsiveWidth(6), resizeMode: "contain", alignSelf: "center" }} />
    </TouchableOpacity>
  );
};

export default TransactionHeaderRight;

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight : responsiveWidth(1)
      },
      text: {
        fontSize: responsiveFontSize(2),
        fontFamily: "MabryPro-Bold",
        color: "#282828",
      },
});
