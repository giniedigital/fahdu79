import {createSlice} from '@reduxjs/toolkit';
import { resetAll } from '../../../Actions';

//uri is to show in preview model;
//file is to bind the file with file objectt to send server;

const initialState = {
  media: {
    image: {
      fileData: undefined,
      preview: undefined,
    },
    video: {
      fileData: undefined,
    },
    pdf: {
      fileData: undefined,
    },
  },
  premium : false,
};

const chatWindowPreviewDataSlice = createSlice({
  name: 'chatWindowPreviewData',
  initialState,
  reducers: {
    setMediaData: (state, action) => {
      if (action.payload.type === 1) {
        //state media info for image
        
        state.media.image.fileData = action.payload.mediaImageInfoSet.mediaImageInfo
        
        state.media.image.preview = action.payload.mediaImageInfoSet.dePixeldPreviewBase64MediaInfo

      } else if (action.payload.type === 2) {
        
        //state media info for video
        
        state.media.video.fileData = action.payload.fileData;

      } else if (action.payload.type === 3) {
        //state media info for pdf
        console.log('SETTIG VIDEO', action.payload.type, action.payload.fileData)

        state.media.pdf.fileData = action.payload.fileData;

      } else {          
                
        state.media.image.fileData = undefined;

        for (const i of ['image', 'video', 'pdf']) {

          state.media[i].fileData = undefined

        }
          
      }
    },
    setAsPremium: (state, action) => {
        state.premium = !state.premium
    }
  },
  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
});

export const { setMediaData, setAsPremium } = chatWindowPreviewDataSlice.actions;

export default chatWindowPreviewDataSlice.reducer;
