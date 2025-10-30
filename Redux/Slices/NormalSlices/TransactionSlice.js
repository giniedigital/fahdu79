import { createSlice } from "@reduxjs/toolkit";
import { resetAll } from "../../Actions";

const initialState = {
  data: {
    filter: "all",
  },
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactionFilter: (state, action) => {
      state.data.filter = action.payload.filterName;
    },
  },


  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      state.data.filter = "all"
    })
  }

});

export const { setTransactionFilter } = transactionSlice.actions;
export default transactionSlice.reducer;
