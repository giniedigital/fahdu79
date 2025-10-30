import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";
import { useDispatch } from "react-redux";
import { setKeyboardHeight } from "../../Redux/Slices/NormalSlices/AppData/KeyboardPropertiesSlice";


const useKeyboardHook = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setLocalKeyboardHeight] = useState(0);
  const dispatch = useDispatch();

  

  useEffect(() => {
    const onKeyboardShow = (e) => {
      const height = e.endCoordinates?.height || 0;
      setIsKeyboardVisible(true);
      setLocalKeyboardHeight(height);

      // Dispatch keyboard height to Redux if required
      if (Platform.OS === "ios") {
        dispatch(setKeyboardHeight({ keyboardHeight: height }));
      }
    };

    const onKeyboardHide = () => {
      setIsKeyboardVisible(false);
      setLocalKeyboardHeight(0);
    };

    // Attach both listeners for all platforms
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      onKeyboardShow
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      onKeyboardHide
    );

    return () => {
      // Clean up listeners
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [dispatch]);

  return { isKeyboardVisible, keyboardHeight };

  
};

export default useKeyboardHook;
