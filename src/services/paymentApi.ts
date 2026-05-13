import { api } from './api';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const paymentApi = api.injectEndpoints({
  endpoints: builder => ({
    confirmPayment: builder.mutation<
      ApiResponse<unknown>,
      { orderId: string; amount?: number }
    >({
      query: body => ({
        url: '/payments/confirm',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Payment', 'Order'],
    }),
  }),
});

export const { useConfirmPaymentMutation } = paymentApi;
