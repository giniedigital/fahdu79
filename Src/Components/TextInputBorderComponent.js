import { Keyboard, Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { setKeyboardHeight } from "../../Redux/Slices/NormalSlices/AppData/KeyboardPropertiesSlice";
import { nTwins } from "../../DesiginData/Utility";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { useDispatch } from "react-redux";

const TextInputBorderComponent = ({ children }) => {
  const [hide, setHide] = React.useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    let show;
    let hides;
    if (Platform.OS === "android") {
      show = Keyboard.addListener("keyboardDidShow", () => {
        setHide(true);
      });

      hides = Keyboard.addListener("keyboardDidHide", () => {
        setHide(false);
      });
    } else {
      show = Keyboard.addListener("keyboardWillShow", (x) => {
        dispatch(setKeyboardHeight({ keyboardHeight: x.endCoordinates.height }));
        setHide(true);
      });

      hides = Keyboard.addListener("keyboardWillHide", () => {
        setHide(false);
      });
    }

    return () => {
      show.remove();
      hides.remove();
    };
  }, []);

  return (
    <View
      style={[
        {
          borderWidth: 2,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: responsiveWidth(4),
          paddingLeft: responsiveWidth(4),
          width: responsiveWidth(85),
          padding: nTwins(0, 0.5),
          marginLeft: responsiveWidth(7),
          top: responsiveWidth(2),
        },
        hide ? { borderBottomWidth: responsiveWidth(1.2), borderRightWidth: responsiveWidth(1.2) } : null,
      ]}
    >
      {children}
    </View>
  );
};

export default TextInputBorderComponent;

const styles = StyleSheet.create({});
