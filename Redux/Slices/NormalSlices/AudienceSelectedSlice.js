import {createSlice} from '@reduxjs/toolkit';
import { resetAll } from '../../Actions';

const initialState = {
  selected: {
    audience: 1,
  },
};

const audienceSelectedSlice = createSlice({
  name: 'filterBy',
  initialState,
  reducers: {
    setSelectedAudience: (state, action) => {
      state.selected.audience = action.payload.audienceNumber;
        console.log('Audience Selected', state);
    },

    setDefaultAudience : (state, action) => {
      state.selected.audience = 1
    }
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});

export const {setSelectedAudience, setDefaultAudience} = audienceSelectedSlice.actions;
export default audienceSelectedSlice.reducer;
