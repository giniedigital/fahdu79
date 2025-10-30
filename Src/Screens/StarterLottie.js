import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";

const StarterLottie = ({ showLottie, setShowLottie }) => {
  const ref = useRef(null);

  return (
    <View style={styles.container}>
      <LottieView
        style={{
          width: "100%",
          height : "100%",
          flexGrow: 1,
          alignSelf: "center",
        }}
        resizeMode="cover"
        ref={ref}
        source={require("../../Assets/Animation/Thanks.json")}
        autoPlay={true}
        loop={false}
        onAnimationFinish={() => setShowLottie(false)}
        // colorFilters={'red'}
      /> 
    </View>
  );
};

export default StarterLottie;
const styles = StyleSheet.create({});