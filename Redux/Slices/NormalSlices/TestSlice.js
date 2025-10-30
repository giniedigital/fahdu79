import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  value: {number: 0},
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    increment: (state, action) => {
      if (action.payload.type === 'increment') {
        state.value.number = state.value.number + 1;
      }
    },
  },
});

export const {increment} = testSlice.actions;
export default testSlice.reducer;
