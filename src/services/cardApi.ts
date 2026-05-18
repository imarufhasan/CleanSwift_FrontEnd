import { api } from './api';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type SavedCard = {
  _id: string;
  stripeCustomerId: string;
  stripePaymentMethodId: string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  isDefault?: boolean;
};

export const cardApi = api.injectEndpoints({
  endpoints: builder => ({
    getSavedCards: builder.query<ApiResponse<SavedCard[]>, void>({
      query: () => ({
        url: '/cards',
        method: 'GET',
      }),
      providesTags: ['Card'],
    }),

    attachCard: builder.mutation<
      ApiResponse<SavedCard>,
      {
        paymentMethodId: string;
        brand?: string;
        last4?: string;
        expMonth?: number;
        expYear?: number;
        isDefault?: boolean;
      }
    >({
      query: body => ({
        url: '/cards/attach',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Card', 'Payment'],
    }),
  }),
});

export const { useAttachCardMutation, useGetSavedCardsQuery } = cardApi;
