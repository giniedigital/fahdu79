import { createSlice } from "@reduxjs/toolkit";
import { resetAll } from "../../../Actions";

const initialState = {
  data: {
    mediaImageInfo: undefined,
  },
};

const createWishListMediaInfoSlice = createSlice({
  name: "createwishlistmediainfo",
  initialState,
  reducers: {
    setWishListMediaInfo: (state, action) => {
      console.log(action.payload.mediaImageInfo, ":::::::");
      state.data.mediaImageInfo = { ...action.payload.mediaImageInfo };
    },
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});

export const { setWishListMediaInfo } = createWishListMediaInfoSlice.actions;
export default createWishListMediaInfoSlice.reducer;
