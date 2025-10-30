import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AddSvg from './AddSvg'
import { responsiveWidth } from 'react-native-responsive-dimensions'


const Testify = () => {
  return (
    <View  style = {{marginTop : responsiveWidth(30), marginLeft : responsiveWidth(30)}}>
      <AddSvg name={'Cam'} />

      
    </View>
  )
}

export default Testify

const styles = StyleSheet.create({})