import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {VideoView, useVideoPlayer} from 'expo-video';
import Modal from 'react-native-modal';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector, useDispatch} from 'react-redux';
import {toggleChatWindowVideoModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';

const ChatWindowVideoModal = ({fullVideoModalUri}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const previewModalShow = useSelector(
    state => state.hideShow.visibility.chatWindowVideoModal,
  );

  const videoSource = fullVideoModalUri
    ? fullVideoModalUri
    : 'https://fahdu.s3.ap-south-1.amazonaws.com/post/video-1679564683518.mp4';

  const player = useVideoPlayer(videoSource, player => {
    player.loop = false;
    player.play();
  });

  const handleClose = () => {
    if (player) {
      player.pause();
    }
    dispatch(toggleChatWindowVideoModal());
  };

  React.useEffect(() => {
    if (previewModalShow && player) {
      player.play();
    } else if (!previewModalShow && player) {
      player.pause();
    }
  }, [previewModalShow]);

  return (
    <Modal
      animationIn={'fadeInUp'}
      animationOut={'fadeOut'}
      animationInTiming={150}
      animationOutTiming={150}
      onRequestClose={handleClose}
      transparent={true}
      isVisible={previewModalShow}
      backdropColor="black"
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      useNativeDriver
      style={{
        flex: 1,
        backgroundColor: 'black',
        alignSelf: 'center',
        width: '100%',
        margin: 0,
      }}>
      <View style={{flex: 1}}>
        {/* Close Button */}
        <TouchableOpacity
          onPress={handleClose}
          style={{
            position: 'absolute',
            top: 40,
            left: 20,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 20,
            padding: 8,
          }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <VideoView
          style={{
            flex: 1,
            width: '100%',
          }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain"
        />
      </View>
    </Modal>
  );
};

export default ChatWindowVideoModal;
