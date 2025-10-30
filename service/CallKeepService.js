// src/services/CallKeepService.js
import RNCallKeep from 'react-native-callkeep';

import uuid from 'react-native-uuid';
import {navigate, navigationRef} from '../Navigation/RootNavigation';
import {Alert, Platform} from 'react-native';

const options = {
  ios: {
    appName: 'Fahdu Calls',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This app needs permission to manage calls.',
    cancelButton: 'Cancel',
    okButton: 'OK',
    foregroundService: {
      channelId: 'com.fahdu.call',
      channelName: 'Fahdu Calls',
      notificationTitle: 'Fahdu call in progress',
    },
  },
};

class CallKeepService {
  constructor() {
    this.setupCallKeep();
    this.isCallPending = false;
  }

  async setupCallKeep() {
    try {
      const accepted = await RNCallKeep.setup(options);
      if (accepted) {
        RNCallKeep.setAvailable(true);
        console.log('📞 CallKeep is ready');
      }
      this.addListeners();
    } catch (e) {
      console.log('CallKeep setup failed:', e);
    }
  }
  addListeners() {
    RNCallKeep.addEventListener('answerCall', ({callUUID}) => {
      console.log('✅ Answered:', callUUID);
      // RNCallKeep.backToForeground();
      // Navigate to your call screen here if needed

      // 🚨 CRITICAL FIX STEP 2: Bring the app to the foreground. (Android only)
      // This ensures your custom in-app calling screen is visible to the user.
      if (Platform.OS === 'android') {
        RNCallKeep.backToForeground();
      }

      this.isCallPending = true;
      if (navigationRef.current?.isReady()) {
        RNCallKeep.endCall(callUUID);
        navigate('accountmanagement');
        this.isCallPending = false; // Reset the flag
      }
    });

    RNCallKeep.addEventListener('endCall', ({callUUID}) => {
      console.log('❌ Ended:', callUUID);
    });
  }

  handleAppStateChange = nextAppState => {
    console.log(nextAppState, '::::NEXT');

    if (nextAppState === 'active' && this.isCallPending) {
      // Alert.alert('fji');

      navigate('accountmanagement');
      this.isCallPending = false; // Reset the flag
    }
  };

  showIncomingCall(callerId, callerName) {
    const callUUID = uuid.v4();
    RNCallKeep.displayIncomingCall(callUUID, callerId, callerName, 'generic', false, {
      payload: JSON.stringify({screen: 'CallScreen', userId: '123'}),
    });
    return callUUID;
  }
}

export default new CallKeepService();
