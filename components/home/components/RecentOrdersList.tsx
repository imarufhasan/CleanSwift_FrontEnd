// home/components/RecentOrdersList.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/color';
import { formatOrderNumber } from '@/src/utils/orderNumber';

type Order = {
  id: string | number;
  quantity: number;
  price: number;
  rating: number;
  status: string;
  date: string;
};
type Props = {
  orders: Order[];
  onOrderPress: (order: Order) => void;
};

export default function RecentOrdersList({ orders, onOrderPress }: Props) {
  return (
    <View >
      {orders?.map(order => (
        <TouchableOpacity
          key={order.id}
          className="bg-white flex-row items-safe justify-center rounded-2xl p-4 mb-4 border border-gray-100"
        >
          <View
            className="w-9 h-9 rounded-full justify-center items-center"
            style={{ backgroundColor: 'rgba(161, 162, 167, 0.2)' }}
          >
            <Ionicons name="cube-outline" size={20} color={'black'} />
          </View>
          <View className="justify-between flex-1 mb-1 ml-2">
            <Text className="font-semibold">Order #{formatOrderNumber(order.id)}</Text>
            <Text className="text-sm text-gray-500 mb-2">
              {order.quantity} bag • Estimate cost ${order.price}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle-outline" size={16} color="green" />
              <Text className="ml-1 text-green-600 text-sm">{order.status}</Text>
            </View>
          </View>

          <View className="items-end justify-center">
            <View className="flex-row items-center">
              <Ionicons name="star" size={14} color="#FACC15" />
              <Text className="ml-1 text-sm">{order.rating.toFixed(2)}</Text>
            </View>

            <TouchableOpacity onPress={() => onOrderPress(order)} className="my-2">
              <Text style={{ color: Colors.primary }} className="font-semibold">
                View Details
              </Text>
            </TouchableOpacity>

            <Text className="text-xs text-gray-400">{order.date}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
