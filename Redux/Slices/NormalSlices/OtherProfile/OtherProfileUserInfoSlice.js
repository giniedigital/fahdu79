import { createSlice } from "@reduxjs/toolkit";
import { resetAll } from "../../../Actions";

const initialState = {
  data: {
    displayName: undefined,
    profilePirUrl: undefined,
  },
  rating : 0,
};

const otherProfileUserInfoSlice = createSlice({
  name: "otherProfileUserInfo",
  initialState,
  reducers: {
    setOtherProfileUserInfo: (state, action) => {
      state.data = { ...action.payload.userInfo };
    },

    setRating : (state, action) => {
      state.rating = action.payload.rate
    }
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});

export const { setOtherProfileUserInfo, setRating } = otherProfileUserInfoSlice.actions;
export default otherProfileUserInfoSlice.reducer;
