import { apiSlice } from './apiSlice';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['User'],
    }),
    banUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/ban/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),
    verifyUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/verify/${userId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/user/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getReports: builder.query({
      query: () => '/admin/reports',
      providesTags: ['Report'],
    }),
    resolveReport: builder.mutation({
      query: ({ reportId, status }) => ({
        url: `/admin/reports/${reportId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Report'],
    }),
    createInterest: builder.mutation({
      query: (interestData) => ({
        url: '/admin/interests',
        method: 'POST',
        body: interestData,
      }),
      invalidatesTags: ['Interest'],
    }),
    deleteInterest: builder.mutation({
      query: (interestId) => ({
        url: `/admin/interests/${interestId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Interest'],
    }),
    getAdminAnalytics: builder.query({
      query: () => '/admin/analytics',
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useBanUserMutation,
  useVerifyUserMutation,
  useDeleteUserMutation,
  useGetReportsQuery,
  useResolveReportMutation,
  useCreateInterestMutation,
  useDeleteInterestMutation,
  useGetAdminAnalyticsQuery,
} = adminApi;
