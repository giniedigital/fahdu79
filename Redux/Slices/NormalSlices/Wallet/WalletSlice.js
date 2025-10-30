import { createSlice } from '@reduxjs/toolkit';
import { resetAll } from '../../../Actions';

const initialState = {
    data: {
      coins : 0,
    }
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {

      updateWallet : (state, aciton) => {
            state.data.coins = aciton.payload.coins
      }

  },

   extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});

export const { updateWallet } = walletSlice.actions;

export default walletSlice.reducer;
