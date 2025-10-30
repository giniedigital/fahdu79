import {createSlice} from '@reduxjs/toolkit';
import {resetAll} from '../../../Actions';

const initialState = {
  data: {
    chats: [],
    goals: [],
    viewers: 0,
    toAnimate: false,
    socketConnect: false,
    mute: {},
  },
};

const liveChatsSlice = createSlice({
  name: 'livechats',
  initialState,
  reducers: {
    pushChats: (state, action) => {
      state.data.chats.push(action.payload.chat);
    },
    pushGoals: (state, action) => {
      state.data.goals.push(action.payload.goals);
    },
    updateGoals: (state, action) => {
      let index = state.data.goals.findIndex(x => x.title === action.payload.data.title);

      state.data.goals[index].collected = action.payload.data.collected;
    },
    addGoalsBeforeStream: (state, action) => {
      let tempArr = action.payload.preStremGoalsArr;

      for (const element of tempArr) {
        element['collected'] = 0;
      }

      state.data.goals = tempArr;
    },
    setViewers: (state, action) => {
      state.data.viewers = action.payload.viewers;
    },

    removeGoals: (state, action) => {
      let index = state.data.goals.findIndex(x => x.title === action.payload.data.title);

      state.data.goals.splice(index, 1);
    },

    setToAnimate: (state, action) => {
      state.data.toAnimate = action.payload.toAnimate;
    },

    setSocketConnect: (state, action) => {
      state.data.socketConnect = action.payload.socketConnect;
    },

    setMuteState: (state, action) => {
      state.data.mute = action.payload.data;
    },

    resetStreamStates: (state, action) => {
      return initialState;
    },
  },

  extraReducers(builder) {
    builder.addCase(resetAll, state => {
      return initialState;
    });
  },
});

export const {pushChats, pushGoals, updateGoals, addGoalsBeforeStream, setViewers, resetStreamStates, removeGoals, setToAnimate, setSocketConnect, setMuteState} = liveChatsSlice.actions;

export default liveChatsSlice.reducer;
