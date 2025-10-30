import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: {
      height : 0
    }
};

const keyboardPropertiesSlice = createSlice({
  name: 'keyboardProperties',
  initialState,
  reducers: {
        setKeyboardHeight : (state, action) => {
            state.data.height = action.payload.keyboardHeight
        }
  },
});

export const {  setKeyboardHeight } = keyboardPropertiesSlice.actions;

export default keyboardPropertiesSlice.reducer;
