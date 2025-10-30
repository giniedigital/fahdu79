import { createSlice } from "@reduxjs/toolkit";
import { resetAll } from "../../Actions";

const initialState = {
  unReadRoomIdArr: [],
};

const unReadThreadSlice = createSlice({
  name: "unReadThread",
  initialState,
  reducers: {
    pushUnReadRoomIds: (state, action) => {
      let isRoomIdAlreadyPresent = state.unReadRoomIdArr.findIndex((id) => id === action.payload.chatRoomId);
      if (isRoomIdAlreadyPresent === -1) {
        console.log("RoomId Already Present");
        console.log("Pushing roomId in unRead Array");
        state.unReadRoomIdArr.push(action.payload.chatRoomId);
      }
    },

    removeRoomIds: (state, action) => {
      let isRoomIdAlreadyPresent = state.unReadRoomIdArr.findIndex((id) => id === action.payload.chatRoomId);
      if (isRoomIdAlreadyPresent !== -1) {
        state.unReadRoomIdArr.splice(isRoomIdAlreadyPresent, 1);
        console.log("RoomList After Delting Room", state.unReadRoomIdArr);
      } else {
        console.log("Unable to delete room Id not found");
      }
    },

    emptyUnreadRoomList : (state, action) => {
        state.unReadRoomIdArr.length = 0;
    }
    
  },

  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      state.unReadRoomIdArr.length = 0
    })
  }

});

export const { pushUnReadRoomIds, removeRoomIds, emptyUnreadRoomList } = unReadThreadSlice.actions;

export default unReadThreadSlice.reducer;
