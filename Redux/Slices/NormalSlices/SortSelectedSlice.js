import {createSlice} from '@reduxjs/toolkit';
import {resetAll} from '../../Actions';

const initialState = {
  selected: {
    sort: 1,
    label: 'none',
  },
};

const sortSelectedSlice = createSlice({
  name: 'sortBy',
  initialState,
  reducers: {
    setSelectedSort: (state, action) => {
      state.selected.sort = action.payload.sortNumber;
      // console.log('Sort Selected', state);
    },
    setDefaultSort: (state, action) => {
      state.selected.sort = 1;
    },
    setLabel: (state, action) => {
      state.selected.label = action.payload.label;
    },
    resetLabel: (state, action) => {
      state.selected.label = 'none';
    },
  },

  extraReducers(builder) {
    builder.addCase(resetAll, state => {
      state.selected.sort = 1;
    });
  },
});

export const {setSelectedSort, setDefaultSort, setLabel, resetLabel} = sortSelectedSlice.actions;
export default sortSelectedSlice.reducer;
