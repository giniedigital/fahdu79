import { createSlice } from '@reduxjs/toolkit';
import { resetAll } from '../../../Actions';

const initialState = {
    action: {
       name : "requested"
    }
};

const currentDashboardActionSlice = createSlice({
  name: 'currentDashboardAction',
  initialState,
  reducers: {
        setCurrentDashboardAction : (state, action) => {
            state.action.name = action.payload.name
        }
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});

export const {  setCurrentDashboardAction } = currentDashboardActionSlice.actions;

export default currentDashboardActionSlice.reducer;
