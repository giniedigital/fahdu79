import {StyleSheet, Text, View, StatusBar} from 'react-native';
import React from 'react';
import VideoPlayer from 'react-native-video-controls';
import Modal from 'react-native-modal';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector, useDispatch} from 'react-redux';
import { toggleChatWindowVideoModal } from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import { useNavigation } from '@react-navigation/native';


const ChatWindowVideoModal = ({ fullVideoModalUri }) => {
  

  const [playing, setPlaying] = React.useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();


  const previewModalShow = useSelector(
    state => state.hideShow.visibility.chatWindowVideoModal,
  );

  return (
      <Modal
        animationIn={'fadeInUp'}
        animationOut={'fadeOut'}
        animationInTiming={150}
        animationOutTiming={150}
        onRequestClose={() => dispatch(toggleChatWindowVideoModal())}
        transparent={true}
        isVisible={previewModalShow}
        backdropColor="black"
        onBackButtonPress={() => dispatch(toggleChatWindowVideoModal())}
        onBackdropPress={() => dispatch(toggleChatWindowVideoModal())}
        useNativeDriver
        style={{
          flex: 1,
          backgroundColor: 'red',
          alignSelf: 'center',
          width: '100%',
          margin: 0,
        }}>
        <VideoPlayer
          style={{
            flex: 1,
            width: '100%',
          }}
          source={{
            uri: fullVideoModalUri
              ? fullVideoModalUri
              : 'https://fahdu.s3.ap-south-1.amazonaws.com/post/video-1679564683518.mp4',
          }}
          toggleResizeModeOnFullscreen={true}
          resizeMode={'contain'}
          seekColor="white"
          onBack={() => {
            setPlaying(false)
            dispatch(toggleChatWindowVideoModal())
          }}
        />
      </Modal>
  );
};

export default ChatWindowVideoModal;
