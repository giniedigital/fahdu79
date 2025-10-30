import {createSlice} from '@reduxjs/toolkit';

import {resetAll} from '../../Actions';
let checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

const initialState = {
  data: {
    none: [],
  },
};

//Beggineg who show

const sortChatRoomList = arr => {
  //To sort room list accroding to latest chat
  return arr
    .map(x => {
      x.updatedAt = new Date(x.updatedAt);
      return x;
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);
};

const chatRoomListSlice = createSlice({
  name: 'roomList',
  initialState,

  reducers: {
    setCacheByFilter: (state, action) => {
      if (action.payload.type === 'none') {
        state.data.none = [...action.payload.data];
      }
    },

    updateCacheRoomList: (state, action) => {
      //Abhi Followers and Subs Waale dekhne hai merorko

      console.log('updating room list cache');

      const {chatRoomId: _id, createdAt, message, hasAttachment, senderId} = action.payload;

      const roomIdObjectIndex = state.data.none.findIndex(x => x._id === _id); //Find Position of room in the roomList

      if (roomIdObjectIndex !== -1) {
        state.data.none[roomIdObjectIndex].lastMessage = {hasAttachment, message, senderId};

        state.data.none[roomIdObjectIndex].updatedAt = createdAt;

        //Update time finish above not it's time to set in order latest chat flatlist.

        state.data.none = sortChatRoomList(state.data.none);
      } else {
        if (checkForHexRegExp.test(_id) === true && checkForHexRegExp.test(senderId) === true) {
          let newMessageRoomObject = {
            label: 'none',
            unreadCounterUser: 5,
            onlineStatus: true,
            lastMessage: {
              senderId: '',
              message: '',
              hasAttachment: false,
            },
            recipient: {
              role: '',
              profile_image: {
                url: '',
                type: 'profile',
              },
              displayName: '',
              _id: '6454c8ac37ccf94e20038c9c',
            },
            myId: '6454ccfd90254d526edb95ef',
            callRequest: {
              callTries: 0,
              type: '',
              status: false,
              initiatedAt: null,
              initiator: null,
            },
            updatedAt: '',
            _id: '',
          };

          newMessageRoomObject._id = _id;
          newMessageRoomObject.lastMessage.hasAttachment = hasAttachment;
          newMessageRoomObject.lastMessage.message = message;
          newMessageRoomObject.lastMessage.senderId = senderId;
          newMessageRoomObject.recipient.profile_image.url = action.payload.profileImage;
          newMessageRoomObject.updatedAt = createdAt;
          newMessageRoomObject.recipient.role = 'creator';
          newMessageRoomObject.recipient.displayName = action.payload.userName;
          newMessageRoomObject.recipient.role = action.payload.role;
          state.data.none.unshift(newMessageRoomObject);
        }
      }
    },

    updateLabel: (state, action) => {
      const roomIdObjectIndex = state.data.none.findIndex(x => x._id === action.payload.data.roomId);

      console.log(roomIdObjectIndex, "11111")

      if(roomIdObjectIndex >= 0) {
        state.data.none[roomIdObjectIndex].label = action.payload.data.current;
      }

    },

    sortByLabel: (state, action) => {
      console.log(action.payload.data, '_++__+_+_+');

      let x = state.data.none.sort((a, b) => {
        const aHasLabel = a?.label === action.payload.data ? 0 : 1;
        const bHasLabel = b?.label === action.payload.data ? 0 : 1;
        return aHasLabel - bHasLabel;
      });

      console.log(x);
    },

    removeRoomList: (state, action) => {
      //It was just previous version of extrareducer so just let it be ...
      state.data.none = [];
    },

    deleteFirst: (state, action) => {
      state.data.none.splice(0, 1);
    },
  },

  extraReducers(builder) {
    builder.addCase(resetAll, state => {
      return initialState;
    });
  },
});

export const {setCacheByFilter, removeRoomList, updateCacheRoomList, deleteFirst, updateLabel, sortByLabel} = chatRoomListSlice.actions;
export default chatRoomListSlice.reducer;
