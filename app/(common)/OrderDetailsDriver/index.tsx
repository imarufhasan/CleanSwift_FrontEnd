import React from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/color';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetOrderByIdQuery } from '@/src/services/orderApi';

const serviceLabel: Record<string, string> = {
  WASH_DRY: 'Washing & Drying',
  DRY_CLEAN: 'Dry Cleaning',
};

const userImage = (image?: string) => (image ? { uri: image } : require('@/assets/images/profile.png'));

const getEffectiveBagCount = (order?: { bagCountAtDelivery?: number; bagCountAtPickup?: number; bags?: number }) =>
  Math.max(0, order?.bagCountAtDelivery ?? order?.bagCountAtPickup ?? order?.bags ?? 0);

const getEffectiveOrderTotal = (order?: { pricePerBag?: number; bagCountAtDelivery?: number; bagCountAtPickup?: number; bags?: number }) =>
  getEffectiveBagCount(order) * Number(order?.pricePerBag ?? 0);

export default function OrderDetailsDriver() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data, isLoading, isError } = useGetOrderByIdQuery(id ?? '', {
    skip: !id,
  });

  const order = data?.data;
  const customer = order?.customer;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!order || isError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 px-6">
        <Text className="text-lg font-semibold text-gray-800">Order not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text style={{ color: Colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="pb-6" style={{ backgroundColor: Colors.primary }}>
        <View className="flex-row items-center px-5 pt-12 mb-[40px]">
          <TouchableOpacity onPress={() => router.back()} className="bg-white p-2 rounded-full mr-3">
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          <Text className="text-white text-[24px]">Order Details</Text>
        </View>
      </View>

      {/* Driver Card */}
      <View className="px-5 -mt-10">
        <View className="bg-white rounded-2xl p-4 shadow">
          <View className="flex-row items-center">
            <Image source={userImage(customer?.image)} className="w-14 h-14 rounded-full" />

            <View className="ml-3 flex-1">
              <Text className="font-bold text-2xl" numberOfLines={1}>
                {customer?.name ?? 'Customer'}
              </Text>
              <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
                {customer?.phone ?? customer?.email ?? 'Order customer'}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/(common)/ChatScreen' as any,
                  params: {
                    orderId: order._id,
                    name: customer?.name ?? 'Customer',
                    avatar: customer?.image ?? '',
                  },
                })
              }
              className="flex-row bg-blue-100/80 items-center justify-center border rounded-xl py-3 w-[48%]"
              style={{ borderColor: Colors.primary }}
            >
              <AntDesign name="message" size={18} color={Colors.primary} />
              <Text className="ml-2 text-lg font-semibold" style={{ color: Colors.primary }}>
                Message
              </Text>
            </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/(common)/CallScreen' as any,
                    params: { name: customer?.name ?? 'Customer', image: customer?.image ?? '' },
                  })
                }
              className="flex-row bg-blue-100/80 items-center justify-center border rounded-xl py-3 w-[48%]"
              style={{ borderColor: Colors.primary }}
            >
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
              <Text className="ml-2 text-lg font-semibold" style={{ color: Colors.primary }}>
                Call Customer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Order Details */}
      <View className="px-5 mt-6">
        <Text className="text-lg font-bold mb-3">Order Details</Text>

        <View className="bg-white rounded-2xl p-4 shadow">
          {/* Service */}
          <Text className="text-gray-400 text-sm">Service</Text>
          <Text className="font-semibold mb-3">{serviceLabel[order.serviceType] ?? order.serviceType}</Text>

          {/* Address */}

          <Text className="text-gray-400 text-sm">Pickup Address</Text>
          <Text className="font-semibold mb-3">{order.address || 'No address available'}</Text>
          {/* Instruction */}
          <Text className="text-gray-400 text-sm">Special Instructions</Text>
          <Text className="font-semibold mb-4">{order.specialInstructions || 'No special instructions'}</Text>

          {/* Price Breakdown */}
          <View className="border-t border-gray-200 pt-3 space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">
                {getEffectiveBagCount(order)} bags x ${order.pricePerBag}
              </Text>
              <Text className="text-gray-700">${getEffectiveOrderTotal(order).toFixed(2)}</Text>
            </View>

            <View className="flex-row justify-between border-t border-gray-200 pt-3 mt-2">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold" style={{ color: Colors.primary }}>
                ${getEffectiveOrderTotal(order).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="h-24" />
    </ScrollView>
  );
}
