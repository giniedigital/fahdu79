import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {
    liveStory: [],
  },
};

const storiesSlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    pushLiveStories: (state, action) => {
      state.data.liveStory = action.payload.liveStory;
    },
  },
});

export const {pushLiveStories} = storiesSlice.actions;

export default storiesSlice.reducer;
