import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import VideoPlayer from "react-native-video-controls";

const CreatePostVideoPreview = ({ route }) => {

  const navigation = useNavigation();
  
  
  return (
    <VideoPlayer
      style={{
        flex: 1,
        width: "100%",
      }}
      source={{
        uri: route?.params?.videoUri ? route?.params?.videoUri : "https://fahdu.s3.ap-south-1.amazonaws.com/post/video-1679564683518.mp4",
      }}
      toggleResizeModeOnFullscreen={true}
      resizeMode={"contain"}
      seekColor="white"
      onBack={() => {
        // setPlaying(false);
        // dispatch(toggleChatWindowVideoModal());
        navigation.goBack();
      }}
      disableVolume
    />
  )

};

export default CreatePostVideoPreview;

const styles = StyleSheet.create({});
