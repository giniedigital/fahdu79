import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: {
    chipCollector: [],
  },
};

const massMessageChipSlices = createSlice({
  name: 'chips',
  initialState,
  reducers: {
    massMessagePushChip: (state, action) => {
      state.data.chipCollector.push(action.payload.name);
    },

    massMessageDeleteChip: (state, action) => {
      state.data.chipCollector = state.data.chipCollector.filter(chip => chip !== action.payload.name);
    },
  },
});

export const {massMessagePushChip, massMessageDeleteChip} = massMessageChipSlices.actions;
export default massMessageChipSlices.reducer;
