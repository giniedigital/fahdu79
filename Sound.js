let Sound = require('react-native-sound');
Sound.setCategory('Playback');


 export const soundObj =  new Sound('pop.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // loaded successfully
    console.log('duration in seconds: ' + soundObj.getDuration() + 'number of channels: ' + soundObj.getNumberOfChannels());
  
    // Play the sound with an onEnd callback
    soundObj.play((success) => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  });


  