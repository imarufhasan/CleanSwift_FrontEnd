import { api } from './api';

export type OrderStatus =
  | 'REQUESTED'
  | 'DRIVER_ASSIGNED'
  | 'PICKED_UP'
  | 'WASHING_DRYING'
  | 'DRYING'
  | 'FOLDING'
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
  driverEarningPercentage?: number;
  driverProfile?: {
    _id?: string;
    user?: string;
    stripeConnectedAccountId?: string;
    licenseImageUrl?: string;
    selfieImageUrl?: string;
    identity?: any;
    isAvailable?: boolean;
    insurance?: {
      provider?: string;
      policyNumber?: string;
      expiration?: string;
      documentImageUrl?: string;
    };
    vehicle?: {
      make?: string;
      model?: string;
      year?: number;
      plate?: string;
    };
    backgroundCheckStatus?: 'PENDING' | 'APPROVED' | 'FAILED';
    reputationTier?: number;
    capacityLimit?: number;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  };
  driverRatingSummary?: {
    _id?: string;
    count?: number;
    avg?: number;
  };
  driverRating?: number;
  driverRatingCount?: number;
  driverTrips?: number;
  driverVehicleText?: string;
  driverSafety?: {
    verifiedDriver?: boolean;
    insuredVehicle?: boolean;
    topRated?: boolean;
  };
  myRating?: {
    _id?: string;
    order?: string;
    customer?: string;
    driver?: string;
    rating?: number;
    feedback?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  customerRating?: {
    _id?: string;
    order?: string;
    customer?: string;
    driver?: string;
    rating?: number;
    feedback?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  total: number;
  bagCountAtPickup?: number;
  bagCountAtDelivery?: number;
  timeline?: {
    requestedAt?: string;
    driverAssignedAt?: string;
    pickedUpAt?: string;
    washingDryingAt?: string;
    dryingAt?: string;
    foldingAt?: string;
    outForDeliveryAt?: string;
    deliveredAt?: string;
    completedAt?: string;
    canceledAt?: string;
  };
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

    // {{baseUrl}}/orders/:id/cancel
    cancelOrder: builder.mutation<
      ApiResponse<Order>,
      { orderId: string; reason?: string }
    >({
      query: ({ orderId, reason }) => ({
        url: `/orders/${orderId}/cancel`,
        method: 'POST',
        body: reason ? { reason } : {},
      }),
      invalidatesTags: ['Order'],
    }),

    //{{baseUrl}}/ratings
    createRating: builder.mutation<
      ApiResponse<any>,
      {
        orderId: string;
        driverId: string;
        rating: number;
        feedback?: string;
      }
    >({
      query: body => ({
        url: '/ratings',
        method: 'POST',
        body,
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
  useCancelOrderMutation,
  useCreateRatingMutation,
} = orderApi;
