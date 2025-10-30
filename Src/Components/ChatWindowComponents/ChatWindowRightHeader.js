import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import DIcon from '../../../DesiginData/DIcons'
import { responsiveWidth } from 'react-native-responsive-dimensions'
import { useSelector, useDispatch } from 'react-redux'
import { toggleChatWindowInformationModal } from '../../../Redux/Slices/NormalSlices/HideShowSlice'
import { nTwins } from '../../../DesiginData/Utility'

const ChatWindowRightHeader = () => {
  const dispatcher = useDispatch();
  // const informationModal  = useSelector(state => state.hideShow.visibility.chatWindowInformationModal)
  // console.log(informationModal)
  return (
    
      <View style = {styles.iconContainer}>
        <TouchableOpacity onPress={() => dispatcher(toggleChatWindowInformationModal())}>
          <DIcon provider={'MaterialCommunityIcons'} name={'information'} color = {'#282828'} size = {nTwins(7, 6)}/>
        </TouchableOpacity>
      </View>
    
  )
}

export default ChatWindowRightHeader

const styles = StyleSheet.create({})