import { apiSlice } from './apiSlice';

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => '/messages/chats',
      providesTags: ['Chat'],
    }),
    getMessages: builder.query({
      query: (chatId) => `/messages/${chatId}`,
      providesTags: ['Message'],
    }),
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: '/messages',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: ['Chat', 'Message'],
    }),
  }),
});

export const { useGetChatsQuery, useGetMessagesQuery, useSendMessageMutation } = messageApi;
