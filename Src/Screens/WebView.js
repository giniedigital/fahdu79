import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {WebView as WV} from 'react-native-webview';

const WebView = ({route}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const type = route?.params?.type;

  // Determine URL based on type
  let url = null;
  if (type === 'tac') {
    url = 'https://www.fahdu.com/terms-conditions';
  } else if (type === 'pap') {
    url = 'https://www.fahdu.com/privacy-policy';
  } else if (type === 'refund') {
    url = 'https://fahdu.com/refund-policy/';
  }

  // If no URL found or an error occurred, show error view
  if (!url || error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>There was some error</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={[styles.loaderContainer, styles.center]}>
          <ActivityIndicator size="large" color="#282828" />
        </View>
      )}
      <WV
        source={{uri: url}}
        onError={() => setError(true)}
        onLoadEnd={() => setLoading(false)}
        style={{flex: 1}}
      />
    </View>
  );
};

export default WebView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopColor: '#282828',
    paddingHorizontal: responsiveWidth(2),
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white', 
    zIndex: 1,
  },
  errorText: {
    fontFamily: 'MabryPro-Medium',
    color: '#282828',
  },
});
