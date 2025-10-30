import { createSlice } from "@reduxjs/toolkit";
import { resetAll } from "../../../Actions";

const initialState = {
  data: {
    brands : {
        
       sharedCampaignId : undefined,
       ylyticInstagramUserId : undefined,
       userFromCampaignLink : false,

    },
    refferal : {
      link : null
    }
  },
};

const deeplinkSlice = createSlice({
  
  name: "deeplink",
  
  initialState,
  
  reducers: {


    setSharedCampaignId: (state, action) => {
      
      state.data.brands.sharedCampaignId = action.payload.campaignId

  
    },

    setYlyticInstagramUserId : (state, action) => {
        state.data.brands.ylyticInstagramUserId = action.payload.ylyticInstagramUserId
    },


    setUserFromCampaignLink : (state, action) => {
      state.data.brands.userFromCampaignLink = action.payload.userFromCampaignLink
    },

    setRefferalLink : (state, action) => {
      state.data.refferal.link = action.payload.link
    },

    deleteRefferalLink : (state, action) => {
      state.data.refferal.link = null
    }




  },

  extraReducers(builder) {
    builder.addCase(resetAll, (state) => {
      return initialState
    })
  }
  
});

export const { setSharedCampaignId, setUserFromCampaignLink, setYlyticInstagramUserId, setRefferalLink, deleteRefferalLink } = deeplinkSlice.actions;

export default deeplinkSlice.reducer;