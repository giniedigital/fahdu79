import { createSlice } from "@reduxjs/toolkit";
import { resetAll } from "../../../Actions";

const initialState = {
  data: {
    donationInfo: {},
  },
};

const WishListDonateSheetSlice = createSlice({
  name: "wishListDonateSheet",
  initialState,
  reducers: {
    setWishListDonationInfo: (state, action) => {
      state.data.donationInfo = { ...action.payload.donationInfo };
    },
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});

export const { setWishListDonationInfo } = WishListDonateSheetSlice.actions;
export default WishListDonateSheetSlice.reducer;
