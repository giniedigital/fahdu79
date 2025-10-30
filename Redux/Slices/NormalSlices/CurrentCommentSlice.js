import {createSlice} from '@reduxjs/toolkit';
import {resetAll} from '../../Actions';

const initialState = {
  content: {
    data: {},
    comments: [],
    totalPages : 0,
  },
};

const currentCommentSlice = createSlice({
  name: 'currentComment',
  initialState,
  reducers: {
    setCurrentCommentDetails: (state, action) => {
      state.content.data = {...action.payload.data};
    },
    savePostComments: (state, action) => {
      state.content.comments = [...action.payload.comments];
    },
    
    deletePostComments: (state, action) => {
      state.content.comments = [];
    },

    pushComment: (state, action) => {
      
      console.log(action.payload.comment, "{}{}{}")

      state.content.comments.unshift(action.payload.comment);
    },


    setTotalPages : (state, action) => {

      console.log("totalpages", action.payload.totalPages)
      state.content.totalPages = action.payload.totalPages
    },

    

  },

  extraReducers(builder) {
    builder.addCase(resetAll, state => {
      return initialState;
    });
  },
});

export const {setCurrentCommentDetails, savePostComments, deletePostComments, pushComment, setTotalPages} = currentCommentSlice.actions;

export default currentCommentSlice.reducer;
