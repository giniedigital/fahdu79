import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {VideoView, useVideoPlayer} from 'expo-video';

const CreatePostVideoPreview = ({route}) => {
  const navigation = useNavigation();

  const videoSource = route?.params?.videoUri
    ? route?.params?.videoUri
    : 'https://fahdu.s3.ap-south-1.amazonaws.com/post/video-1679564683518.mp4';

  const player = useVideoPlayer(videoSource, player => {
    player.loop = false;
    player.play();
  });

  // Handle cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (player) {
        player.pause();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls
        contentFit="contain"
      />
    </View>
  );
};

export default CreatePostVideoPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
    width: '100%',
  },
});
