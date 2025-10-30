import {createSlice} from '@reduxjs/toolkit';
import {resetAll} from '../../../Actions';

const initialState = {
  data: {
    searchedProfile: [],
  },
};

const searchProfileSlice = createSlice({
  name: 'searchProfile',
  initialState,
  reducers: {

    updateSearchedProfile: (state, action) => {
      const newProfile = action.payload.data;
      const isAlreadyPresent = state.data.searchedProfile.some(profile => profile._id === newProfile._id);

      if (!isAlreadyPresent) {
        state.data.searchedProfile.unshift(newProfile);
      }
    },
    
    deleteSearchedProfile: (state, action) => {
      const idToDelete = action.payload.id; // Get the _id to delete
      state.data.searchedProfile = state.data.searchedProfile.filter(profile => profile._id !== idToDelete);
    },

  },
  extraReducers(builder) {
    builder.addCase(resetAll, state => {
      return initialState;
    });
  },
});

export const {updateSearchedProfile, deleteSearchedProfile} = searchProfileSlice.actions;
export default searchProfileSlice.reducer;
