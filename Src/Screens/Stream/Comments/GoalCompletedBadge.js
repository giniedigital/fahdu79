import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { FONT_SIZES, WIDTH_SIZES } from "../../../../DesiginData/Utility";

const GoalCompletedBadge = ({ goal }) => {
  // Limit goal text to 15 characters to avoid excessive width
  const trimmedGoal = goal.length > 9 ? `${goal.substring(0, 9)}...` : goal;

  return (
    <View style={styles.container}>
      <Image source={require("../../../../Assets/Images/Sparkle.png")} style={styles.sparkleIcon} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Goal{" "}
          <Text style={styles.bold} numberOfLines={2} ellipsizeMode="tail">
            “{trimmedGoal}”
          </Text>{" "}
          Completed
        </Text>
      </View>
      <Image source={require("../../../../Assets/Images/Sparkle.png")} style={styles.sparkleIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF914D",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: WIDTH_SIZES[2],
    borderColor: "#1e1e1e",
    width: WIDTH_SIZES[214],
  },
  textContainer: {
    flex: 1, 
    maxWidth: "70%", // Prevents text from taking too much space
  },
  text: {
    color: "#1e1e1e",
    fontSize: FONT_SIZES[14],
    fontFamily: "Rubik-Medium",
    textAlign: "center",
  },
  bold: {
    fontFamily: "Rubik-Bold",
    fontSize: FONT_SIZES[14],
  },
  sparkleIcon: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    marginHorizontal: 6,
  },
});

export default GoalCompletedBadge;
