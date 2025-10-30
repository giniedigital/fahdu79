import { createSlice } from '@reduxjs/toolkit';
import { resetAll } from '../../Actions';

const initialState = {
    screen: {
        role : undefined
    }
};

const secondUserSlice = createSlice({
  name: 'secondUser',
  initialState,
  reducers: {
        setsecondUser : (state, action) => {
            state.screen.role = action.payload.role
        }
  },


  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
        state.screen.role = undefined
    })
  }
});

export const {  setsecondUser } = secondUserSlice.actions;

export default secondUserSlice.reducer;
