import { createSlice } from "@reduxjs/toolkit";
import { resetAll } from "../../Actions";

const initialState = {
  data: {
    filter: "weekly",
  },
};





const ManageRevenueDashboardSlice = createSlice({
  name: "manageRevenueDashboard",
  initialState,
  reducers: {
    setMRDashboardFilter: (state, action) => {
      state.data.filter = action.payload.filterName;
    },
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      state.data.filter = "weekly"
    })
  }
});

export const { setMRDashboardFilter } = ManageRevenueDashboardSlice.actions;
export default ManageRevenueDashboardSlice.reducer;
