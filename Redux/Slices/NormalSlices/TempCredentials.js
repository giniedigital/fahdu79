import {createSelector, createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: {
    email: '',
    password: '',
  },
};

const tempCredentialSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = {...action.payload.data};
    },

    deleteCredentials: (state, action) => {
      state.user.email = '';
      state.user.password = '';
    },
  },
});

export const {setCredentials, deleteCredentials} = tempCredentialSlice.actions;

export default tempCredentialSlice.reducer;
