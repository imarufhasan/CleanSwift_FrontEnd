import { api } from './api';
import type { Order } from './orderApi';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type DriverProfile = {
  _id: string;
  user: string;
  isAvailable?: boolean;
  backgroundCheckStatus?: 'PENDING' | 'APPROVED' | 'FAILED';
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
};

export const driverApi = api.injectEndpoints({
  endpoints: builder => ({
    getMyDriverProfile: builder.query<ApiResponse<DriverProfile | null>, void>({
      query: () => ({
        url: '/drivers/me',
        method: 'GET',
      }),
      providesTags: ['Driver'],
    }),

    updateDriverAvailability: builder.mutation<ApiResponse<DriverProfile>, boolean>({
      query: isAvailable => ({
        url: '/drivers/availability',
        method: 'PATCH',
        body: { isAvailable },
      }),
      invalidatesTags: ['Driver'],
    }),

    getAvailableJobs: builder.query<ApiResponse<Order[]>, void>({
      query: () => ({
        url: '/drivers/jobs/available',
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    getMyDriverJobs: builder.query<ApiResponse<Order[]>, void>({
      query: () => ({
        url: '/drivers/jobs/my',
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    acceptJob: builder.mutation<ApiResponse<Order>, string>({
      query: orderId => ({
        url: `/drivers/jobs/${orderId}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['Order', 'Driver'],
    }),

    declineJob: builder.mutation<ApiResponse<unknown>, string>({
      query: orderId => ({
        url: `/drivers/jobs/${orderId}/decline`,
        method: 'POST',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetMyDriverProfileQuery,
  useUpdateDriverAvailabilityMutation,
  useGetAvailableJobsQuery,
  useGetMyDriverJobsQuery,
  useAcceptJobMutation,
  useDeclineJobMutation,
} = driverApi;
