import { createSlice } from '@reduxjs/toolkit';
import { resetAll } from '../../../Actions';

const initialState = {
    data : {
        roomId : ""
    }
};

const ChatWindowCurrentChattingRoomSlice = createSlice({
    name: 'chatWindowCurrentChattingRoom',
    initialState,
    reducers: {
        setCurrentChattingRoom : (state, action) => {
            state.data.roomId = action.payload.chatRoomId
        },
        resetCurrentChattingRoom : (state, action) => {
            state.data.roomId = ""
        }
    },
    extraReducers(builder) {
        builder.addCase(resetAll, (state) => {
          return initialState
        })
      }
});

export const { setCurrentChattingRoom, resetCurrentChattingRoom } = ChatWindowCurrentChattingRoomSlice.actions;
export default ChatWindowCurrentChattingRoomSlice.reducer;
