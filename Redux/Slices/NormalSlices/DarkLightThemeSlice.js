import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  theme: {
    dark: {

    },
    light : {

    },
    currentTheme : {
        isDark : false
    }
  },
};

const darkLightThemeSlice = createSlice({
  name: 'darkLightTheme',
  initialState,
  reducers: {
    setSelectedSort: (state, action) => {
      state.selected.sort = action.payload.sortNumber;
      // console.log('Sort Selected', state);
    },
    setDefaultSort: (state, action) => {
      state.selected.sort = 1;
      console.log('Default sort set', state.selected.sort);
    },
  },
});

export const {setSelectedSort, setDefaultSort} = darkLightThemeSlice.actions;
export default darkLightThemeSlice.reducer;
