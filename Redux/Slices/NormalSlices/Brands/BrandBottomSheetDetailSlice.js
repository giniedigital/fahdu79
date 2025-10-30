import { createSlice } from '@reduxjs/toolkit';
import { resetAll } from '../../../Actions';

const initialState = {
    data: {
        title : "",
        description : "",
        task : "",
        rules : "",
        amount : 0,
        id : ""
    }
};

const brandBottomSheetDetailSlice = createSlice({
  name: 'brandBottomSheetDetail',
  initialState,
  reducers: {
        setBrandBottomSheetData : (state, action) => {
            state.data = {...action.payload.details}
        }
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});

export const {  setBrandBottomSheetData } = brandBottomSheetDetailSlice.actions;

export default brandBottomSheetDetailSlice.reducer;
