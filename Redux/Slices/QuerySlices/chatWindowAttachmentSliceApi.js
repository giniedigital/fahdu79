import {fetchBaseQuery, createApi} from '@reduxjs/toolkit/query/react';
import {Platform} from 'react-native';
import {useSendMessageMutation} from './roomListSliceApi';
import axios from 'axios';
import {setUploadProgress} from '../NormalSlices/UploadSlice';

export const chatWindowAttachmentApi = createApi({
  reducerPath: 'chatWindowAttachmentApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.fahdu.in',
  }),

  tagTypes: ['CampaignList', 'Hello'],

  endpoints: builder => ({
    uploadAttachment: builder.mutation({
      query: ({token, formData}) => ({
        url: '/api/upload',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }),
    }),

    createPostUploadAttachment: builder.mutation({
      queryFn: async ({token, formData}, {dispatch}) => {
        try {
          const response = await axios.post('https://api.fahdu.in/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
            // This is the key part for progress tracking
            onUploadProgress: progressEvent => {
              const {loaded, total} = progressEvent;

              console.log(loaded, total, '&&&&&&&&&', progressEvent);
              const percentCompleted = Math.round((loaded * 100) / total);
              // Dispatch the progress to your Redux store
              dispatch(setUploadProgress(percentCompleted));
            },
          });
          return {data: response};
        } catch (error) {
          return {error: error.response?.data || error.message};
        }
      },
    }),

    initiatePayment: builder.mutation({
      query: ({token, conversationId, roomId}) => ({
        url: '/api/wallet/message/initiate-attachment-payment',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          roomId,
          conversationId,
        },
      }),
    }),

    payment: builder.mutation({
      query: ({token, conversationId, roomId}) => ({
        url: '/api/wallet/message/payment',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          roomId,
          conversationId,
        },
      }),
    }),

    sendFcmToken: builder.mutation({
      query: ({token, fcmToken}) => ({
        url: '/api/notification/preserve/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          token: fcmToken,
        },
      }),
    }),

    sendTip: builder.mutation({
      query: ({token, tipAmount, chatRoomId}) => ({
        url: '/api/wallet/chat/send-tip',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          amount: tipAmount,
          roomId: chatRoomId,
          type: 'CHAT',
        },
      }),
    }),

    getAllNotifications: builder.query({
      query: ({token, chatRoomId, _id}) => {
        return {
          url: ``,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ['latestChat'],
    }),

    logoutFromServer: builder.query({
      query: ({token}) => {
        return {
          url: `/api/user/logout`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    getCoins: builder.query({
      query: ({token}) => {
        return {
          url: `/api/wallet/get-coins`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    isValidFollow: builder.query({
      query: ({token, userName}) => {
        console.log('FOLLO', userName);

        return {
          url: `/api/user/valid-follow-check?id=${userName}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    followUser: builder.mutation({
      query: ({token, displayName}) => ({
        url: '/api/user/follow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          displayName,
        },
      }),
    }),

    unFollowUser: builder.mutation({
      query: ({token, displayName}) => ({
        url: '/api/user/unFollow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          displayName,
        },
      }),
    }),

    getUserFeed: builder.query({
      query: ({token, page, timestamp}) => {
        return {
          url: `/api/post/user/feeds?page=${page}&timestamp=${timestamp}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    requestBrandCollab: builder.mutation({
      query: ({token, id}) => ({
        url: '/api/brand/campaign/apply',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          id,
        },
      }),
    }),

    getDashBoardData: builder.query({
      query: ({token, page}) => {
        return {
          url: `/api/brand/creator/campaign/dashboard`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    getCampaignList: builder.query({
      query: ({token, filter, page}) => {
        return {
          url: `/api/brand/creator/campaign/response?filter=${filter}&&page=${page}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ['CampaignList'],
    }),

    submitMediaForApproval: builder.mutation({
      query: ({token, id, url}) => ({
        url: '/api/brand/campaign/creator/submit',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          id,
          url,
        },
      }),
      invalidatesTags: ['CampaignList'],
    }),

    submitMediaForRevision: builder.mutation({
      query: ({token, id, url}) => ({
        url: '/api/brand/campaign/creator/revision/submit',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          id,
          url,
        },
      }),
      invalidatesTags: ['CampaignList'],
    }),

    submitLinkToBrand: builder.mutation({
      query: ({token, id, url}) => ({
        url: '/api/brand/campaign/creator/ready/submit',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          id,
          url,
        },
      }),
      invalidatesTags: ['CampaignList'],
    }),

    createPost: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/post/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    myPostList: builder.query({
      query: ({token}) => {
        return {
          url: `/api/post/user/cpost?page=1&timestamp=`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ['CampaignList'],
    }),

    otherPostList: builder.query({
      query: ({token, userName}) => {
        return {
          url: `/api/post/user/cr_feeds?id=${userName}&page=1&timestamp=`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ['CampaignList'],
    }),

    creatorProfile: builder.query({
      query: ({token, displayName}) => {
        return {
          url: `/api/user/${displayName}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    creatorRating: builder.query({
      query: ({token, displayName}) => {
        return {
          url: `/api/user/get-user-rating?displayName=${displayName}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    getWishList: builder.query({
      query: ({token, userId}) => {
        return {
          url: `/api/wishlists?userId=${userId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    rateUser: builder.mutation({
      query: ({token, displayName, rating}) => ({
        url: '/api/user/user-rating',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          displayName,
          rating: Number(rating),
        },
      }),
    }),

    uploadWishList: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/wishlists',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    changePassword: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/user/password-change',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    userProfile: builder.query({
      query: ({token}) => {
        return {
          url: `/api/user/profile`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    updateProfile: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/user/update-profile',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    //DiscoverPageAPI

    newCreators: builder.query({
      query: ({token}) => {
        return {
          url: `/api/creators/new-creators`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    mostSearch: builder.query({
      query: ({token}) => {
        return {
          url: `/api/creators/most-search`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    trendingCreators: builder.query({
      query: ({token}) => {
        return {
          url: `/api/creators/trending-creators`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    discoverRecomendCreators: builder.query({
      query: ({token, type = 'LifeStyle'}) => {
        return {
          url: `api/creators/niche?niche=${encodeURIComponent(type)}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    recommendedCreators: builder.query({
      query: ({token, page}) => {
        return {
          url: `/api/creators/trending-creators-niche?page=${page}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    popularCreators: builder.query({
      query: ({token}) => {
        return {
          url: `/api/creators/popular-artist`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    searchedCreators: builder.query({
      query: ({token, name}) => {
        return {
          url: `/api/user/search/creators?searchBy=${name}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    //Creatrors perspective

    getFS: builder.query({
      query: ({token, listType, active = true}) => {
        return {
          url: `/api/subscription/get-${listType}?active=${active}&page=1`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    //User Perspective

    //list-type : followed/subscribed
    getFSD: builder.query({
      query: ({token, listType, active = true}) => {
        return {
          url: `/api/subscription/get-${listType}?active=${active}&page=1`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    //Check account link

    accountLinkStatus: builder.query({
      query: ({token}) => {
        return {
          url: `/api/connect`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    linkAccount: builder.mutation({
      query: ({token, data}) => ({
        url: `/api/connect/link`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    unLinkAccount: builder.mutation({
      query: ({token, provider}) => ({
        url: `/api/connect/unlink`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: {
          provider,
        },
      }),
    }),

    // user/

    updatePictures: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/user/update-profile-image',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    createPassword: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/user/create-password',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getRoomId: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/messages/room',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    wishListDonation: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/wishlists/donate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    transactionData: builder.query({
      query: ({token, page, filter}) => {
        return {
          url: `api/wallet/get-recentTrxn?page=${page}&filter=${filter}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    forgetPassword: builder.mutation({
      query: ({data}) => ({
        url: '/api/user/forget-password',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
    }),

    verifyOtp: builder.mutation({
      query: ({data}) => ({
        url: '/api/user/forgot-password/verify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
    }),

    resendOtp: builder.mutation({
      query: ({data}) => ({
        url: '/api/user/resend-otp',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({data}) => ({
        url: '/api/user/update-password',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
    }),

    // user/signup

    signUp: builder.mutation({
      query: ({data}) => ({
        url: '/api/user/signup',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
    }),

    referralVerify: builder.query({
      query: ({query}) => {
        return {
          url: `/api/user/verify-referral?refId=${query}`,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),

    //

    signUpByRefferal: builder.mutation({
      query: ({data}) => ({
        url: '/api/user/signup-by-referral',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }),
    }),

    getCreatorsPlan: builder.query({
      query: ({token, id}) => {
        return {
          url: `/api/subscription/get-package/${id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    subscriptionPayments: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/wallet/subscription/payment',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    unSubscribe: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/user/unsubscribe',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    //

    instaVerify: builder.query({
      query: ({token, handle}) => {
        return {
          url: `/api/document-verification/v3/ig/account?handle=${handle}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    coverUpdateProfile: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/user/cove/update-profile',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getNoOnce: builder.query({
      query: ({token}) => {
        return {
          url: `/api/document-verification/get-nonce`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    checkUserNameAvailability: builder.query({
      query: ({token, displayName}) => {
        return {
          url: `/api/document-verification/v2/check-availability?displayName=${displayName}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    getUserDoc: builder.query({
      query: ({token}) => {
        return {
          url: `/api/document-verification/v2/get-user-docs`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    finalVerificationSubmission: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/document-verification/v2/create-docs',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getOwnPackage: builder.query({
      query: ({token}) => {
        return {
          url: `/api/subscription/get-own-package`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    addPackageSubscription: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/subscription/add-package',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getFeeSetupDetails: builder.query({
      query: ({token}) => {
        return {
          url: `/api/fee-setup/get-feesetup-details`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    updateFeeSetup: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/fee-setup/update',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    updateFeeSetupChatWindow: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/fee-setup/chat/update',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getWalletPack: builder.query({
      query: ({token, os}) => {
        return {
          url: `/api/wallet/get-coin-packs?type=${os}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    appleReceiptVerify: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/payments/apple/verify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getMRDashboardData: builder.query({
      query: ({token, type, filter}) => {
        return {
          url: `/api/creators/dashboard?filter=${type}&duration=${filter}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    refferalDetails: builder.query({
      query: ({token}) => {
        return {
          url: `/api/referral/details`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    //

    getSelfLike: builder.query({
      query: ({token, _id}) => {
        return {
          url: `/api/post/get-like?postId=${_id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    likeApi: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/post/likes',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getAllComments: builder.query({
      query: ({token, _id, page = 1}) => {
        console.log('kanchanpage', page);

        return {
          url: `/api/post/get-comment?postId=${_id}&page=${page}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    doComment: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/post/comment',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    sendPostTip: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/wallet/post/send-tip',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    reportPost: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/post/report',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    //

    getScheduledPosts: builder.query({
      query: ({token, _id}) => {
        return {
          url: `/api/post/get-scheduled-post`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    deleteScheduledPost: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/post/cancel-schedule-post',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    deleteMyPost: builder.mutation({
      query: ({token, postId}) => ({
        url: `/api/post/del-post?postId=${postId}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    pinUnPinPost: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/post/pin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    postEdit: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/post/edit-post',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    blockUser: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/user/block',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    unblockUser: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/user/unblock',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getBlockList: builder.query({
      query: ({token}) => {
        return {
          url: `/api/user/blocked-list`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    getSupportRoomId: builder.query({
      query: ({token}) => {
        return {
          url: `/api/static/config/additional`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    //

    getTippersList: builder.query({
      query: ({token, postId, page = 1}) => {
        return {
          url: `/api/post/details/tip?postId=${postId}&page=${page}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    getTFACode: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/TFA/third-party/access-code',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getTFAEmailCode: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/TFA/mail/access-code',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    validateTFA: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/TFA/mail/validate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    validateTFAAuth: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/TFA/third-party/get-qrcode',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getTFAStatus: builder.query({
      query: ({token, postId, page = 1}) => {
        return {
          url: '/api/TFA',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    // /api/TFA/mail/disable/access-code

    enableThirdPartyAuth: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/TFA/third-party/validate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    disableThirdPartyAuth: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/TFA/third-party/disable',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    disableMailTwoFA: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/TFA/mail/disable/confirm',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    resendCodeTFA: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/TFA/mail/resend/access-code',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getDisableMailTFACode: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/TFA/mail/disable/access-code',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getSinglePostDetails: builder.query({
      query: ({token, postId}) => {
        return {
          url: `/api/post/get-post?postId=${postId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    deleteUser: builder.mutation({
      query: ({token}) => ({
        url: '/api/user/account/remove',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    agreeToLicense: builder.mutation({
      query: ({token}) => ({
        url: '/api/user/toc/agree',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    //!liveStream

    createLiveStream: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/stream/livestream/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    joinLiveStream: builder.query({
      query: ({token, roomId}) => {
        return {
          url: `/api/stream/livestream/join?roomId=${roomId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    // /api/stream/live/token?roomId=92846b8c-3313-445e-a0aa-3c62e78d3644

    getStreamTokenToJoin: builder.query({
      query: ({token, roomId}) => {
        return {
          url: `/api/stream/live/token?roomId=${roomId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    //We have to renew token of user for every 1 min

    userRenewToken: builder.query({
      query: ({token, roomId}) => {
        return {
          url: `/api/stream/live/renew-token?roomId=${roomId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    //roomId in body {terminate livestream from userSide}
    leaveLiveStream: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/stream/livestream/leave',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    //{terminate livestream from streamer side}
    endLiveStream: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/stream/livestream/end',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    // {amount, roomId, type : "LIVESTREAM"}
    liveStreamTip: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/wallet/livestream/send-tip',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    //

    sendMessageLiveStream: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/stream/livestream/sendMessage',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    // {amount, title}

    addGoalsLiveStream: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/stream/livestream/goals',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    // { amount: 2, title: "Russian", roomId: "83c3a194-ec4a-4842-9049-1490eecd6f26" }
    tipForGoal: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/stream/livestream/goals/tip',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    reJoin: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/stream/livestream/rejoin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    //Mutre

    muteLiveStream: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/stream/livestream/toggleMute',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    //For leaderboard

    sendLiveStreamDetails: builder.mutation({
      query: ({token, data}) => ({
        url: 'api/leaderboard/submit/task/liveStream',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    //Stories

    getStories: builder.query({
      query: ({token}) => {
        return {
          url: `/api/post/get-stories`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    getInstagramProfileInfo: builder.query({
      query: ({username}) => {
        return {
          url: `/api/brand/creator/insta/information/${username}`,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),

    applyInCampaign: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/brand/creator/apply',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    listOfAppliedCampaign: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/brand/creator/campaign/applied/list',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    submitMobileNumberForOtp: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/brand/creator/send/otp',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    verifyWhatsappOtp: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/brand/creator/verify/mobilenumber',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    //Payments

    // http://localhost:8000

    paymentCheckOut: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/payments/cashfree/wallet/checkout',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    paymentCheckOutPhonePe: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/payments/wallet/checkout',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    searchProfile: builder.query({
      query: ({token, name}) => {
        return {
          url: `/api/creators/search-user?prefix=${name}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    getWeeklyEarning: builder.query({
      query: ({token}) => {
        return {
          url: `/api/wallet/get-weeklyEarnings`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    getTotalEarnings: builder.query({
      query: ({token}) => {
        return {
          url: `/api/wallet/get-totalEarnings`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    saveBankDetails: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/wallet/save/bankDetails',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    featureWiseEarningDetail: builder.query({
      query: ({token}) => {
        return {
          url: `/api/wallet/get-earningDetails`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    withdrawableBalance: builder.query({
      query: ({token}) => {
        return {
          url: `/api/wallet/withdrawableBalance`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    refferalList: builder.query({
      query: ({token}) => {
        return {
          url: `/api/referral/get-referral`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    //Check if bank details already submitted

    alreadyFilledBankDetails: builder.query({
      query: ({token}) => {
        return {
          url: `/api/wallet/checkBankDetails`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    getShowBankDetails: builder.query({
      query: ({token}) => {
        return {
          url: `/api/wallet/get-bankDetails`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    helpCenterRequest: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/user/helpcenter',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    assignLabel: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/messages/label/assign',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    updateLabelTitle: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/messages/label/update',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getAllLabelName: builder.query({
      query: ({token}) => {
        return {
          url: `/api/messages/getLabels`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    sendMassMessage: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/messages/bulk',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getPostDetails: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/post/share-post',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    //notificaiton

    areYouACreatorNotification: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/user/signup/notification',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    //Delete

    getAppVersion: builder.query({
      query: () => {
        return {
          url: `/api/user/get/version`,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),

    callRequest: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/stream/request-call',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getCallToken: builder.query({
      query: ({token, roomId}) => {
        return {
          url: `/api/stream/call/token?roomId=${roomId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    renewTokenCall: builder.query({
      query: ({token, roomId}) => {
        return {
          url: `/api/stream/call/renew-token?roomId=${roomId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    othersCallingFeeDetail: builder.query({
      query: ({token, userId}) => {
        return {
          url: `/api/fee-setup/get-fees?userId=${userId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    acceptCallRequest: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/stream/call',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    callTriesStatus: builder.query({
      query: ({token, roomId}) => {
        return {
          url: `/api/stream/call/status/?roomId=${roomId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    //roomId in body {terminate livestream from userSide}
    leaveCall: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/stream/call/leave',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    callTip: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/wallet/call/send-tip',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    getPaymentToken: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/payments/cashfree/create/order',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    callAcceptManual: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/stream/call/accept/manual',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    //

    phonePePayLoad: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/payments/generate/payload',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    // onlineStatus: builder.mutation({
    //   query: ({token, data}) => ({
    //     url: '/api/user/status?displayName=',
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: data,
    //   }),
    // }),

    updateProfileDescription: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/user/update/contactInfo',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),

    onlineStatus: builder.query({
      query: ({token, displayName}) => {
        return {
          url: `/api/user/status?displayName=${displayName}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    // https://api.fahdu.in

    liveStatus: builder.query({
      query: ({token, userId}) => {
        return {
          url: `/api/stream/live/status?userId=${userId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    creditDebit: builder.query({
      query: ({token, roomId}) => {
        return {
          url: `/api/stream/live/transferCoins?roomId=${roomId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    contactInfo: builder.query({
      query: ({token, userId}) => {
        return {
          url: `/api/user/get/contactInfo?userId=${userId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    //clear cache
    canClearCache: builder.mutation({
      query: ({token, data}) => ({
        url: '/api/user/set/version',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),
  }),
});

export const {
  useVerifyWhatsappOtpMutation,
  useSubmitMobileNumberForOtpMutation,

  useReJoinMutation,
  useTipForGoalMutation,
  useLazyGetStoriesQuery,
  useAddGoalsLiveStreamMutation,
  useSendMessageLiveStreamMutation,
  useEndLiveStreamMutation,
  useLiveStreamTipMutation,
  useLazyUserRenewTokenQuery,
  useLeaveLiveStreamMutation,
  useLazyGetStreamTokenToJoinQuery,
  useLazyJoinLiveStreamQuery,
  useCreateLiveStreamMutation,
  useAgreeToLicenseMutation,
  useDeleteUserMutation,
  useLazyGetSinglePostDetailsQuery,
  useGetDisableMailTFACodeMutation,
  useResendCodeTFAMutation,
  useDisableMailTwoFAMutation,
  useDisableThirdPartyAuthMutation,
  useEnableThirdPartyAuthMutation,
  useValidateTFAAuthMutation,
  useLazyGetTFAStatusQuery,
  useGetTFAEmailCodeMutation,
  useValidateTFAMutation,
  useGetTFACodeMutation,
  useLazyGetTippersListQuery,
  useLazyGetSupportRoomIdQuery,
  useUnblockUserMutation,
  useLazyGetBlockListQuery,
  useBlockUserMutation,
  usePostEditMutation,
  usePinUnPinPostMutation,
  useDeleteMyPostMutation,
  useDeleteScheduledPostMutation,
  useLazyGetScheduledPostsQuery,
  useReportPostMutation,
  useSendPostTipMutation,
  useDoCommentMutation,
  useLikeApiMutation,
  useLazyGetAllCommentsQuery,
  useLazyGetSelfLikeQuery,
  useLazyRefferalDetailsQuery,
  useLazyGetMRDashboardDataQuery,
  useLazyGetWalletPackQuery,
  useUpdateFeeSetupMutation,
  useLazyGetFeeSetupDetailsQuery,
  useAddPackageSubscriptionMutation,
  useLazyGetOwnPackageQuery,
  useLazyGetUserDocQuery,
  useFinalVerificationSubmissionMutation,
  useLazyCheckUserNameAvailabilityQuery,
  useLazyGetNoOnceQuery,
  useLazyInstaVerifyQuery,
  useCoverUpdateProfileMutation,
  useUnSubscribeMutation,
  useSubscriptionPaymentsMutation,
  useLazyGetCreatorsPlanQuery,
  useSignUpByRefferalMutation,
  useLazyReferralVerifyQuery,
  useSignUpMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
  useForgetPasswordMutation,
  useLazyTransactionDataQuery,
  useWishListDonationMutation,
  useGetRoomIdMutation,
  useCreatePasswordMutation,
  useUpdatePicturesMutation,
  useUnLinkAccountMutation,
  useLinkAccountMutation,
  useLazyGetFSQuery,
  useLazyAccountLinkStatusQuery,
  useLazyGetFSDQuery,
  useUploadAttachmentMutation,
  useInitiatePaymentMutation,
  usePaymentMutation,
  useSendFcmTokenMutation,
  useSendTipMutation,
  useLazyLogoutFromServerQuery,
  useGetCoinsQuery,
  useFollowUserMutation,
  useUnFollowUserMutation,
  useGetUserFeedQuery,
  useLazyGetUserFeedQuery,

  useRequestBrandCollabMutation,
  useGetDashBoardDataQuery,
  useLazyGetCampaignListQuery,
  useSubmitMediaForApprovalMutation,
  useSubmitLinkToBrandMutation,
  useSubmitMediaForRevisionMutation,
  useLazyGetDashBoardDataQuery,
  useCreatePostMutation,
  useLazyMyPostListQuery,
  useLazyCreatorProfileQuery,
  useLazyCreatorRatingQuery,
  useLazyGetWishListQuery,
  useLazyOtherPostListQuery,
  useLazyIsValidFollowQuery,
  useRateUserMutation,
  useUploadWishListMutation,
  useChangePasswordMutation,
  useLazyUserProfileQuery,
  useUpdateProfileMutation,
  useAppleReceiptVerifyMutation,

  useLazyNewCreatorsQuery,
  useLazyMostSearchQuery,
  useLazyTrendingCreatorsQuery,
  useLazyRecommendedCreatorsQuery,
  useLazyPopularCreatorsQuery,
  useLazySearchedCreatorsQuery,
  useSendLiveStreamDetailsMutation,
  useLazyGetInstagramProfileInfoQuery,
  useApplyInCampaignMutation,
  useListOfAppliedCampaignMutation,
  useLazyDiscoverRecomendCreatorsQuery,
  usePaymentCheckOutMutation,

  //Dashboard

  useLazyGetWeeklyEarningQuery,
  useSaveBankDetailsMutation,
  useLazyGetTotalEarningsQuery,
  useLazyFeatureWiseEarningDetailQuery,
  useLazyAlreadyFilledBankDetailsQuery,
  useLazyGetShowBankDetailsQuery,

  useUpdateFeeSetupChatWindowMutation,

  //Search
  useLazySearchProfileQuery,

  //live

  useMuteLiveStreamMutation,

  useSendMassMessageMutation,

  useHelpCenterRequestMutation,

  //Reffereal
  useLazyRefferalListQuery,

  useLazyGetAppVersionQuery,

  //Label

  useAssignLabelMutation,
  useUpdateLabelTitleMutation,
  useLazyGetAllLabelNameQuery,

  useGetPostDetailsMutation,

  useCanClearCacheMutation,

  usePaymentCheckOutPhonePeMutation,

  useCallRequestMutation,
  useLazyGetCallTokenQuery,

  useLazyOthersCallingFeeDetailQuery,

  useAcceptCallRequestMutation,

  useLazyCallTriesStatusQuery,

  useLazyRenewTokenCallQuery,

  useLeaveCallMutation,

  useCallTipMutation,

  useLazyLiveStatusQuery,

  useCallAcceptManualMutation,

  useGetPaymentTokenMutation,

  usePhonePePayLoadMutation,

  useUpdateProfileDescriptionMutation,

  useLazyContactInfoQuery,

  useCreatePostUploadAttachmentMutation,

  useLazyCreditDebitQuery,

  useLazyOnlineStatusQuery,

  useLazyWithdrawableBalanceQuery,

  useAreYouACreatorNotificationMutation,
} = chatWindowAttachmentApi;
