import { createSlice } from '@reduxjs/toolkit';
import { resetAll } from '../../../Actions';

const initialState = {
    data: {
       
    }
};

const campaignDataSlice = createSlice({
  name: 'campaignData',
  initialState,
  reducers: {
    
    setCampaignData : (state, action) => {
        state.data = action.payload.campaignDetails
    }
    
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});

export const {  setCampaignData } = campaignDataSlice.actions;

export default campaignDataSlice.reducer;
