import { api } from './api';

export type OrderStatus =
  | 'REQUESTED'
  | 'DRIVER_ASSIGNED'
  | 'PICKED_UP'
  | 'WASHING_DRYING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELED';

export type Order = {
  _id: string;
  customer?: any;
  driver?: any;
  serviceType: 'WASH_DRY' | 'DRY_CLEAN';
  pickupType: 'ASAP' | 'SCHEDULED';
  scheduledPickupAt?: string;
  bags: number;
  specialInstructions?: string;
  address?: string;
  status: OrderStatus;
  pricePerBag: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const orderApi = api.injectEndpoints({
  endpoints: builder => ({
    createOrder: builder.mutation<
      ApiResponse<Order>,
      {
        serviceType: 'WASH_DRY' | 'DRY_CLEAN';
        pickupType: 'ASAP' | 'SCHEDULED';
        scheduledPickupAt?: string;
        bags: number;
        specialInstructions?: string;
      }
    >({
      query: body => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),

    getMyOrders: builder.query<ApiResponse<Order[]>, void>({
      query: () => ({
        url: '/orders',
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    getOrderById: builder.query<ApiResponse<Order>, string>({
      query: id => ({
        url: `/orders/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    markOrderDelivered: builder.mutation<ApiResponse<Order>, { orderId: string }>({
      query: ({ orderId }) => ({
        url: `/orders/${orderId}/stage/delivery/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['Order'],
    }),

  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useMarkOrderDeliveredMutation,
} = orderApi;
