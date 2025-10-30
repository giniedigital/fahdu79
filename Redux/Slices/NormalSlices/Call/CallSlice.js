import {createSelector, createSlice} from '@reduxjs/toolkit';
import {resetAll} from '../../../Actions';
import dayjs from 'dayjs';

const initialState = {
  data: {
    showCallScreen : false,
    receivedAt : null,
    data : {},
    callback: null,
    fromNotification : false,
    callbackId : null
  },
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setCallData: (state, action) => {

      console.log(action.payload, "<<<<<<>>>>>>")
      state.data.showCallScreen = true
      state.data.receivedAt = action.payload.receivedAt
      state.data.data ={...action.payload.data}
      state.data.fromNotification = action.payload.fromNotification
    },

    setCallCallback: (state, action) => {
      state.data.callback = action.payload; 
    },

    setCallbackId : (state, action) => {
      state.data.callbackId = action.payload.callbackId
    },

    setNotificationFrom : (state, action) => {
      state.data.fromNotification = action.payload.fromNotification
    },




    resetCallData: (state, action) => {
      state.data = {};
    },
  },
});

export const {setCallData, resetCallData, setCallCallback, setCallbackId, setNotificationFrom} = callSlice.actions;

export default callSlice.reducer;
