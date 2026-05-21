import { api } from './api';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type DriverRatingSummary = {
  _id?: string;
  count: number;
  avg: number;
};

type DriverRatingsResponse = {
  summary: DriverRatingSummary;
  list: Array<{
    _id: string;
    rating: number;
    feedback?: string;
    createdAt?: string;
  }>;
};

export type MyOrderRating = {
  _id: string;
  order: string;
  customer: string;
  driver: string;
  rating: number;
  feedback?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const ratingApi = api.injectEndpoints({
  endpoints: builder => ({
    getDriverRatings: builder.query<ApiResponse<DriverRatingsResponse>, string>({
      query: driverId => ({
        url: `/ratings/driver/${driverId}`,
        method: 'GET',
      }),
    }),
    getMyOrderRating: builder.query<ApiResponse<MyOrderRating | null>, string>({
      query: orderId => ({
        url: `/ratings/order/${orderId}/me`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetDriverRatingsQuery, useGetMyOrderRatingQuery } = ratingApi;
