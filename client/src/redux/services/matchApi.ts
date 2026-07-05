import { apiSlice } from './apiSlice';

export const matchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMatches: builder.query({
      query: () => '/matches',
      providesTags: ['Match'],
    }),
    getMatchById: builder.query({
      query: (targetUserId) => `/matches/${targetUserId}`,
    }),
    discoverUsers: builder.query({
      query: (params) => ({
        url: '/users/discover',
        params,
      }),
      providesTags: ['User'],
    }),
    likeUser: builder.mutation({
      query: (receiverId) => ({
        url: '/likes',
        method: 'POST',
        body: { receiverId },
      }),
      invalidatesTags: ['Like', 'Match'],
    }),
    saveUser: builder.mutation({
      query: (targetUserId) => ({
        url: '/likes/save',
        method: 'POST',
        body: { targetUserId },
      }),
      invalidatesTags: ['Like'],
    }),
    getMyLikes: builder.query({
      query: () => '/likes',
      providesTags: ['Like'],
    }),
  }),
});

export const {
  useGetMatchesQuery,
  useGetMatchByIdQuery,
  useDiscoverUsersQuery,
  useLikeUserMutation,
  useSaveUserMutation,
  useGetMyLikesQuery,
} = matchApi;
