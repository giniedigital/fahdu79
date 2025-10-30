import { ActivityIndicator, StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { countryList } from "../../../DesiginData/CountryListData";
import { useNavigation } from "@react-navigation/native";

const CountryScreen = () => {
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation();

  const handleCountrySelect = (country, isoCode) => {
    navigation.navigate("editProfile", {country, isoCode})   
  }
  
  

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={"orange"} size={"small"} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          data={countryList}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity style = {styles.eachList} onPress={() => handleCountrySelect(item.name, item.isoCode)}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
};

export default CountryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf0",
    borderTopColor: "#282828",
    borderTopWidth: 1,
    paddingHorizontal: responsiveWidth(2),
    paddingTop: responsiveWidth(2),
  },
  eachList : {
    padding : responsiveWidth(3),
    borderBottomWidth : 1
  }
});
