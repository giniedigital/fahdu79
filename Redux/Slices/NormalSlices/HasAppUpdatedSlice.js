import { createSlice } from '@reduxjs/toolkit';
import { resetAll } from '../../Actions';

const initialState = {
    app: {
        updated : false
    }
};

const hasAppUdatedSlice = createSlice({
  
  name: 'hasAppUpdated',
  
  initialState,

  reducers: {
        setUpdateStatus : (state, action) => {
          state.app.updated = action.payload.status
        }
  },


  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      console.log("REEEEEEEEEEEEEEEEEEEEE:::::::::::EEEEEEEE********")
      return initialState
    })
  }


});

export const {  setUpdateStatus } = hasAppUdatedSlice.actions;

export default hasAppUdatedSlice.reducer;