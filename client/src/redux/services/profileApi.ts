import { apiSlice } from './apiSlice';

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/profile/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile', 'User'],
    }),
    submitPersonality: builder.mutation({
      query: (answers) => ({
        url: '/profile/personality',
        method: 'PUT',
        body: { answers },
      }),
      invalidatesTags: ['Profile'],
    }),
    updateInterests: builder.mutation({
      query: (interestIds) => ({
        url: '/profile/interests',
        method: 'PUT',
        body: { interestIds },
      }),
      invalidatesTags: ['Profile'],
    }),
    updatePreferences: builder.mutation({
      query: (preferences) => ({
        url: '/profile/preferences',
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: ['Profile'],
    }),
    addPhoto: builder.mutation({
      query: (photoUrl) => ({
        url: '/profile/photos',
        method: 'POST',
        body: { photoUrl },
      }),
      invalidatesTags: ['Profile'],
    }),
    getProfileByUserId: builder.query({
      query: (userId) => `/profile/user/${userId}`,
    }),
    getQuestions: builder.query({
      query: () => '/meta/questions',
    }),
    getInterests: builder.query({
      query: () => '/meta/interests',
      providesTags: ['Interest'],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useSubmitPersonalityMutation,
  useUpdateInterestsMutation,
  useUpdatePreferencesMutation,
  useAddPhotoMutation,
  useGetProfileByUserIdQuery,
  useGetQuestionsQuery,
  useGetInterestsQuery,
} = profileApi;
