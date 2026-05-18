import { api } from './api';

type Pricing = {
  _id?: string;
  pricePerBag?: number;
  driverEarningPercentage?: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const livePricingQueryOptions = {
  pollingInterval: 30000,
  refetchOnFocus: true,
  refetchOnReconnect: true,
} as const;

export const pricingApi = api.injectEndpoints({
  endpoints: builder => ({
    getPricing: builder.query<ApiResponse<Pricing | null>, void>({
      query: () => ({
        url: '/pricing',
        method: 'GET',
      }),
      providesTags: ['Pricing'],
    }),
  }),
});

export const { useGetPricingQuery } = pricingApi;
