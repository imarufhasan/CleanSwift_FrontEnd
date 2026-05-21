import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_KEY } from '@/src/services/storage/tokenStorage';
import { SOCKET_URL } from '@/src/constants/api';

export type OrderSocketRole = 'CUSTOMER' | 'DRIVER';

type Options = {
  role: OrderSocketRole;
  orderId?: string;
  enabled?: boolean;
  onCustomerUpdate?: () => void;
  onDriverJobsUpdate?: () => void;
};

export function useOrderSocket({
  role,
  orderId,
  enabled = true,
  onCustomerUpdate,
  onDriverJobsUpdate,
}: Options) {
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

      if (role === 'CUSTOMER') {
        socket.on('order:driver:accepted', () => onCustomerUpdate?.());
        socket.on('order:assigned', () => onCustomerUpdate?.());
        socket.on('order:stage:updated', () => onCustomerUpdate?.());
        socket.on('order:payment:confirmed', () => onCustomerUpdate?.());
        socket.on('order:assignment:released', () => onCustomerUpdate?.());
        socket.on('order:tracking:location', () => onCustomerUpdate?.());
      }

      if (role === 'DRIVER') {
        socket.on('driver:job:new', () => onDriverJobsUpdate?.());
        socket.on('order:hidden', () => onDriverJobsUpdate?.());
        socket.on('order:assigned', () => onDriverJobsUpdate?.());
        socket.on('order:stage:updated', () => onDriverJobsUpdate?.());
        socket.on('order:payment:confirmed', () => onDriverJobsUpdate?.());
        socket.on('order:assignment:released', () => onDriverJobsUpdate?.());
      }

      socket.connect();
    };

    connect();

    return () => {
      cancelled = true;
      socket?.removeAllListeners();
      socket?.disconnect();
    };
  }, [enabled, orderId, onCustomerUpdate, onDriverJobsUpdate, role]);
}
