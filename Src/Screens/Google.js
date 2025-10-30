import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'

const Google = () => {
  return (
    <View>
        <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle={"dark-content"}
        showHideTransition={"slide"}
        hidden={false}
      />
      
      
      <Text>Google</Text>
    </View>
  )
}

export default Google

const styles = StyleSheet.create({})