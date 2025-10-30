import { createSlice } from '@reduxjs/toolkit';
import { resetAll } from '../../../Actions';

const initialState = {
  bio: {
    name: "",
    profileImageUrl : "",
    role : "",
    id : ""
  }
};

const senderDetailSlice = createSlice({
  name: 'senderDetail',
  initialState,
  reducers: {
    setChatWindowSenderUserDetails: (state, action) => {
      state.bio.name = action.payload.name;
      state.bio.profileImageUrl = action.payload.profileImageUrl
      state.bio.role = action.payload.role
      state.bio.id = action.payload.id
    }
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});

export const {setChatWindowSenderUserDetails} = senderDetailSlice.actions;
export default senderDetailSlice.reducer;
