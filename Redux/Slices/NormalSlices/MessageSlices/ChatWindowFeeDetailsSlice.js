import { createSlice } from '@reduxjs/toolkit';
import { resetAll } from '../../../Actions';

const initialState = {
    data : {}
};

const ChatWindowFeeDetailsSlice = createSlice({
    name: 'chatWindowFeeDetails',
    initialState,
    reducers: {
        saveFeeDetails : (state, action) => {
            state.data[action.payload.chatRoomId] = action.payload.feeDetails
        },
        resetFeeDetails : (state, action) => {
            state.data = {}
        }
    },
    extraReducers(builder) {
        builder.addCase(resetAll, (state) => {
          return initialState
        })
      }
});

export const { saveFeeDetails, resetFeeDetails } = ChatWindowFeeDetailsSlice.actions;
export default ChatWindowFeeDetailsSlice.reducer;
