import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_KEY } from '@/src/services/storage/tokenStorage';
import { SOCKET_URL } from '@/src/constants/api';
import { orderApi, type Order } from '@/src/services/orderApi';
import { useAppDispatch } from '@/src/store/hooks';

export type OrderSocketRole = 'CUSTOMER' | 'DRIVER';

type Options = {
  role: OrderSocketRole;
  orderId?: string;
  enabled?: boolean;
  onCustomerUpdate?: () => void;
  onDriverJobsUpdate?: () => void;
};

type OrderStageUpdatedPayload = {
  orderId?: string;
  status?: string;
  order?: Order;
};

export function useOrderSocket({
  role,
  orderId,
  enabled = true,
  onCustomerUpdate,
  onDriverJobsUpdate,
}: Options) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!enabled) return;

    let socket: Socket | null = null;
    let cancelled = false;

    const connect = async () => {
      const token = await AsyncStorage.getItem(ACCESS_KEY);
      socket = io(`${SOCKET_URL}/orders`, {
        path: '/socket.io',
        transports: ['websocket'],
        autoConnect: false,
        auth: token ? { token } : undefined,
      });

      if (cancelled) {
        socket.disconnect();
        return;
      }

      socket.on('connect', () => {
        socket?.emit('orders:join', {
          role,
          ...(orderId ? { orderId } : {}),
        });
      });

      const updateOrderCache = (payload?: OrderStageUpdatedPayload) => {
        if (payload?.order) {
          dispatch(
            orderApi.util.updateQueryData('getMyOrders', undefined, draft => {
              const index = draft.data.findIndex(
                order => order._id === payload.order?._id,
              );

              if (index >= 0) {
                draft.data[index] = payload.order as Order;
              } else {
                draft.data.unshift(payload.order as Order);
              }
            }),
          );

          dispatch(
            orderApi.util.updateQueryData(
              'getOrderById',
              payload.order._id,
              draft => {
                draft.data = payload.order as Order;
              },
            ),
          );
        }

        dispatch(orderApi.util.invalidateTags(['Order']));
      };

      if (role === 'CUSTOMER') {
        socket.on('order:driver:accepted', payload => {
          updateOrderCache(payload);
          onCustomerUpdate?.();
        });
        socket.on('order:assigned', payload => {
          updateOrderCache(payload);
          onCustomerUpdate?.();
        });
        socket.on('order:stage:updated', payload => {
          updateOrderCache(payload);
          onCustomerUpdate?.();
        });
        socket.on('order:payment:confirmed', payload => {
          updateOrderCache(payload);
          onCustomerUpdate?.();
        });
        socket.on('order:assignment:released', payload => {
          updateOrderCache(payload);
          onCustomerUpdate?.();
        });
        socket.on('order:tracking:location', () => onCustomerUpdate?.());
      }

      if (role === 'DRIVER') {
        socket.on('driver:job:new', payload => {
          updateOrderCache(payload);
          onDriverJobsUpdate?.();
        });
        socket.on('order:hidden', () => onDriverJobsUpdate?.());
        socket.on('order:assigned', payload => {
          updateOrderCache(payload);
          onDriverJobsUpdate?.();
        });
        socket.on('order:stage:updated', payload => {
          updateOrderCache(payload);
          onDriverJobsUpdate?.();
        });
        socket.on('order:payment:confirmed', payload => {
          updateOrderCache(payload);
          onDriverJobsUpdate?.();
        });
        socket.on('order:assignment:released', payload => {
          updateOrderCache(payload);
          onDriverJobsUpdate?.();
        });
      }

      socket.connect();
    };

    connect();

    return () => {
      cancelled = true;
      socket?.removeAllListeners();
      socket?.disconnect();
    };
  }, [dispatch, enabled, orderId, onCustomerUpdate, onDriverJobsUpdate, role]);
}
