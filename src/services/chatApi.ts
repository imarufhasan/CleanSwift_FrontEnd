import { api } from './api';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ChatUser = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  role?: string;
};

export type ChatMessage = {
  _id: string;
  order?: string;
  from: ChatUser | string;
  to: ChatUser | string;
  contentType: 'TEXT' | 'IMAGE';
  content: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ChatThread = {
  _id?: string;
  orderId: string;
  lastMessageAt?: string;
  lastMessage?: string;
  lastContentType?: 'TEXT' | 'IMAGE';
  lastFrom?: string;
  unreadCount?: number;
  order?: {
    _id?: string;
    status?: string;
    serviceType?: string;
    address?: string;
    total?: number;
    createdAt?: string;
  };
  customer?: ChatUser;
  driver?: ChatUser;
};

export const chatApi = api.injectEndpoints({
  endpoints: builder => ({
    getChatThreads: builder.query<ApiResponse<ChatThread[]>, void>({
      query: () => ({
        url: '/chat/threads',
        method: 'GET',
      }),
      providesTags: ['Chat'],
    }),

    getChatMessages: builder.query<ApiResponse<ChatMessage[]>, string>({
      query: orderId => ({
        url: `/chat/order/${orderId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, orderId) => [{ type: 'Chat', id: orderId }],
    }),

    sendChatMessage: builder.mutation<
      ApiResponse<ChatMessage>,
      { orderId: string; content: string; to?: string; contentType?: 'TEXT' | 'IMAGE' }
    >({
      query: ({ orderId, ...body }) => ({
        url: `/chat/order/${orderId}`,
        method: 'POST',
        body: {
          contentType: 'TEXT',
          ...body,
        },
      }),
      invalidatesTags: (_result, _error, arg) => ['Chat', { type: 'Chat', id: arg.orderId }],
    }),

    sendChatImage: builder.mutation<ApiResponse<ChatMessage>, { orderId: string; image: FormData }>({
      query: ({ orderId, image }) => ({
        url: `/chat/order/${orderId}/image`,
        method: 'POST',
        body: image,
      }),
      invalidatesTags: (_result, _error, arg) => ['Chat', { type: 'Chat', id: arg.orderId }],
    }),
  }),
});

export const {
  useGetChatThreadsQuery,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
  useSendChatImageMutation,
} = chatApi;
