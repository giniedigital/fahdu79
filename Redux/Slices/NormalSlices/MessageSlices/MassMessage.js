import {createSlice} from '@reduxjs/toolkit';
import {resetAll} from '../../../Actions';

const initialState = {
  data: {
    _body: {
      message: null,
      attachment: {
        url: undefined,
        format: undefined,
        is_charagble: false,
        charge_amount: 10,
        paid_by_reciever: false,
        preview: '',
        type: '',
      },
    },
    target: {
      selectedUsers: [],
      label: [],
    },
    status: {
      online: true,
      offline: false,
    },
  },
};

const massMessageSlice = createSlice({
  name: 'massMessage',
  initialState,
  reducers: {
    setMassMessageLabel: (state, action) => {
      const {label} = action.payload;
      const labelIndex = state.data.target.label.findIndex(l => l === label);

      if (labelIndex >= 0) {
        // Label exists, remove it (uncheck)
        state.data.target.label.splice(labelIndex, 1);
      } else {
        // Label doesn't exist, add it (check)
        state.data.target.label.push(label);
      }
    },

    setMassMessageTargetOnlinleOffline: (state, action) => {
      console.log('AC', action.payload);
      state.data.status.offline = action.payload.status.offline;
      state.data.status.online = action.payload.status.online;
    },

    setMassMessageAddToUserList: (state, action) => {
      const userId = action.payload._id;
      const index = state.data.target.selectedUsers.indexOf(userId);

      if (index >= 0) {
        state.data.target.selectedUsers.splice(index, 1);
      } else {
        state.data.target.selectedUsers.push(userId);
      }
    },

    massMessageUpdateBody: (state, action) => {
      const { message, attachment } = action.payload;
    
      if (message !== undefined) {
        state.data._body.message = message;
      }
    
      if (attachment !== undefined) {
        state.data._body.attachment = {
          ...state.data._body.attachment,
          ...attachment
        };
      }
    },

    resetMassMessage: () => initialState,
  },
  
  // Add extra reducers to respond to the global reset action
  extraReducers: (builder) => {
    builder.addCase(resetAll, () => initialState);
  }
});

export const {
  setMassMessageLabel,
  setMassMessageTargetOnlinleOffline,
  setMassMessageMedia,
  setMassMessageAddToUserList,
  massMessageUpdateBody,
  resetMassMessage,  // Export the new reset action
} = massMessageSlice.actions;

export default massMessageSlice.reducer;