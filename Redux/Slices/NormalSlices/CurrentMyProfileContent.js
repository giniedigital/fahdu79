import { createSlice } from '@reduxjs/toolkit';
import { resetAll } from '../../Actions';

const initialState = {
    content: {
        index : 0
    }
};

const currentMyProfileContentSlice = createSlice({
  name: 'currentMyProfileContent',
  initialState,
  reducers: {
        setCurrentMyProfileContnetIndex : (state, action) => {
            state.content.index = action.payload.index
        }
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});

export const { setCurrentMyProfileContnetIndex  } = currentMyProfileContentSlice.actions;

export default currentMyProfileContentSlice.reducer;
