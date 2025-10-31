import {Audio} from 'expo-av';

// Create and play sound
export const playSound = async () => {
  try {
    // Set audio mode
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    // Create sound object
    const {sound} = await Audio.Sound.createAsync(
      require('./assets/pop.mp3'), // Local file
      {shouldPlay: true}, // Auto-play
      onPlaybackStatusUpdate, // Optional callback
    );

    // Play the sound
    await sound.playAsync();

    // Don't forget to unload the sound when done
    sound.setOnPlaybackStatusUpdate(status => {
      if (status.didJustFinish) {
        sound.unloadAsync();
        console.log('Successfully finished playing');
      }
    });
  } catch (error) {
    console.log('Failed to load the sound', error);
  }
};

// Or create a reusable sound object
export let soundObj = null;

export const initSound = async () => {
  try {
    const {sound} = await Audio.Sound.createAsync(require('./assets/pop.mp3'));
    soundObj = sound;

    // Get duration
    const status = await sound.getStatusAsync();
    console.log('Duration in seconds:', status.durationMillis / 1000);
  } catch (error) {
    console.log('Failed to load the sound', error);
  }
};

// Play the sound
export const playLoadedSound = async () => {
  if (soundObj) {
    await soundObj.replayAsync();
  }
};

// Cleanup
export const unloadSound = async () => {
  if (soundObj) {
    await soundObj.unloadAsync();
    soundObj = null;
  }
};
