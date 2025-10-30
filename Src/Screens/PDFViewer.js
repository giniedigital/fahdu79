import React, { useState } from "react";
import { StyleSheet, Dimensions, View, Linking, Text } from "react-native";
import Pdf from "react-native-pdf";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const PDFViewer = ({route}) => {

  const [pdfError, setPdfError] = useState(false);

  const handleError = (e) => {
    if (e) {
      setPdfError(true);
    }
  };

  if (!pdfError) {
    return (
      <View style={styles.container}>
        <Pdf
          trustAllCerts={false}
          source={{ uri: route?.params?.url }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => handleError(error)}
          onPressLink={(uri) => {
            Linking.openURL(uri);
          }}
          style={styles.pdf}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.containerError}>
        <Text style={styles.errorStyle}>There was error while opening your pdf</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: "#282828", fontFamily: "MabryPro-Regular" }}>Open pdf file in browser</Text>
          {/* <TouchableOpacity onPress={() => Linking.openURL()}> */}
          <Text style={{ color: "blue", fontFamily: "MabryPro-Regular" }}> : Link</Text>
          {/* </TouchableOpacity> */}
        </View>
      </View>
    );
  }
};

export default PDFViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  errorStyle: {
    fontFamily: "MabryPro-Medium",
    fontSize: responsiveFontSize(2.3),
    color: "#282828",
  },
  containerError: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
