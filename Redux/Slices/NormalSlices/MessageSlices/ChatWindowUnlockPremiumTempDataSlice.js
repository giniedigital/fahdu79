import {createSlice} from '@reduxjs/toolkit';
import { resetAll } from '../../../Actions';

//This was required because previously setting states via props was not working basically the chat component were not rerendering and hence the conversation Id was not changing

const initialState = {
    data: {
        conversationId: undefined,
        canPay: false,
        amount : 0,
    }
};

const chatWindowUnlockPremiumTempDataSlice = createSlice({
  name: 'chatWindowUnlockPremiumTempData',
  initialState,
  reducers: {
    setUnlockPremiumTempData: (state, action) => {
      state.data.conversationId = action.payload.conversationId;
      state.data.canPay = action.payload.canPay;
      state.data.amount = action.payload.amount
    },
    resetUnlockPremiumTempData: (state, action) => {
      state.data.conversationId = undefined;
      state.data.canPay = false;
      state.data.amount = 0;
    }
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});

export const { setUnlockPremiumTempData, resetUnlockPremiumTempData } = chatWindowUnlockPremiumTempDataSlice.actions;
export default chatWindowUnlockPremiumTempDataSlice.reducer;
