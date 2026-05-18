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

export const ratingApi = api.injectEndpoints({
  endpoints: builder => ({
    getDriverRatings: builder.query<ApiResponse<DriverRatingsResponse>, string>({
      query: driverId => ({
        url: `/ratings/driver/${driverId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetDriverRatingsQuery } = ratingApi;
