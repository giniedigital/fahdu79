import { createSlice } from '@reduxjs/toolkit';
import { resetAll } from '../../../Actions';

const initialState = {
    data: {
        searchString: "",
    },

};

const chatRoomSearchValueSlice = createSlice({
    name: 'chatRoomSearchValue',
    initialState,
    reducers: {
        insertSearchString : (state, action) => {
            state.data.searchString = action.payload.searchString;
        },
        clearSearchString : (state, action) => {
            state.data.searchString = ""
        }
    },
    extraReducers(builder) {
        builder.addCase(resetAll, (state) => {
          return initialState
        })
      }
});

export const { insertSearchString, clearSearchString } = chatRoomSearchValueSlice.actions;
export default chatRoomSearchValueSlice.reducer;
