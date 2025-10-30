import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

import { resetAll } from '../../../Actions';

const initialState = {
  threadStore: {},
};

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {
    saveThread: (state, action) => {
      console.log('Entered to threadslice');
      state.threadStore[action.payload.chatRoomId] = {
        ...action.payload.threadDetails,
      };
    },
    updateThread: (state, action) => {
      console.log('Update thread reached')
      let x = state.threadStore[action.payload.chatRoomId].messages.findIndex((x) => x._id === action.payload.newMessage[0]._id);
      if (x === -1) {
        state.threadStore[action.payload.chatRoomId].messages.push(...action.payload.newMessage,);  
      } else {
        state.threadStore[action.payload.chatRoomId].messages[x] = action.payload.newMessage[0]
        console.log("Found:::::::::::::??????????")
      }
      
    },
    updatePremiumAttachmentThread: (state, action) => {
      console.log('Updating premium thread', action.payload.chatRoomId)
      let premiumChatIndex = state.threadStore[action.payload.chatRoomId]?.messages?.findIndex((x) => x._id == action.payload.conversationId);
      state.threadStore[action.payload.chatRoomId].messages[premiumChatIndex].attachment.url = action.payload.url;
      state.threadStore[action.payload.chatRoomId].messages[premiumChatIndex].attachment.paid_by_reciever = true;
      state.threadStore[action.payload.chatRoomId].messages[premiumChatIndex].attachment.preview = ""
    },
    pushSentMessageResponse: (state, action) => {
      let x = state.threadStore[action.payload.chatRoomId].messages.findIndex((x) => x._id === action.payload.sentMessageResponse._id)
      if (x === -1) {
        state.threadStore[action.payload.chatRoomId].messages.push(action.payload.sentMessageResponse)  
      } else {
        state.threadStore[action.payload.chatRoomId].messages[x] = action.payload.sentMessageResponse
      }
    },
    deleteCachedMessages : (state, action) => {
      state.threadStore = {};
    }
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});


export const {saveThread, updateThread, updatePremiumAttachmentThread, pushSentMessageResponse, deleteCachedMessages} = threadSlice.actions;
export default threadSlice.reducer;

//!@Exporting memoized selectors

const wholeThread = state => state.thread.threadStore

export const memoizedThreadSelector = (roomId) => {
  
    return createSelector([wholeThread], threadStore => threadStore[roomId])
}