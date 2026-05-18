import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Colors from '@/constants/color';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetMyDriverJobsQuery } from '@/src/services/driverApi';
import type { Order } from '@/src/services/orderApi';
import { livePricingQueryOptions, useGetPricingQuery } from '@/src/services/pricingApi';
import { formatOrderNumber } from '@/src/utils/orderNumber';

const getEffectiveBagCount = (order?: Order) =>
  Math.max(0, order?.bagCountAtDelivery ?? order?.bagCountAtPickup ?? order?.bags ?? 0);

type Props = {
  order?: Order;
  onStartOutForDelivery: () => Promise<boolean | void> | boolean | void;
};

export default function DeliveryStep({ order, onStartOutForDelivery }: Props) {
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(
    order?.status === 'OUT_FOR_DELIVERY',
  );
  const { data: myJobsRes } = useGetMyDriverJobsQuery();
  const { data: pricingRes } = useGetPricingQuery(undefined, livePricingQueryOptions);
  const driverEarningPercentage = pricingRes?.data?.driverEarningPercentage ?? 70;
  const activeJob =
    order ??
    (myJobsRes && myJobsRes.data
      ? myJobsRes.data.find(order => !['DELIVERED', 'COMPLETED', 'CANCELED'].includes(order.status))
      : undefined);
  const canStartOutForDelivery = activeJob?.status === 'FOLDING';
  const isButtonWaiting = isWaitingForConfirmation || activeJob?.status === 'OUT_FOR_DELIVERY';

  useEffect(() => {
    setIsWaitingForConfirmation(order?.status === 'OUT_FOR_DELIVERY' || activeJob?.status === 'OUT_FOR_DELIVERY');
  }, [activeJob?.status, order?.status]);
  const customer = activeJob ? activeJob.customer : null;
  const status = {
    label: activeJob && activeJob.status ? activeJob.status.replaceAll('_', ' ') : 'No active job',
    etaMinutes: activeJob && activeJob.scheduledPickupAt ? 6 : 0,
  };
  const orderDetails = {
    service: activeJob && activeJob.serviceType ? activeJob.serviceType.replaceAll('_', ' ') : 'Unavailable',
    address: {
      street: activeJob && activeJob.address ? activeJob.address : 'No address available',
      city: '',
    },
    instructions:
      activeJob && activeJob.specialInstructions ? activeJob.specialInstructions : 'No special instructions',
    pricing: {
      bags: getEffectiveBagCount(activeJob),
      bagPrice: activeJob && activeJob.pricePerBag !== undefined ? activeJob.pricePerBag : 0,
      tip: 0,
    },
  };

  const total = orderDetails.pricing.bags * orderDetails.pricing.bagPrice + orderDetails.pricing.tip;

  return (
    <ScrollView className="flex-1">
      <SafeAreaView edges={['bottom']} className="bg-[#F6F9FF] flex-1">
        {/* Map Placeholder */}
        <View className="h-[350px] bg-blue-100 relative">
          {/* Fake Map Grid Background */}
          <View className="absolute inset-0 opacity-40">
            <View className="flex-1 flex-row flex-wrap">
              {[...Array(100)].map((_, i) => (
                <View key={i} className="w-[10%] h-[10%] border border-blue-200" />
              ))}
            </View>
          </View>

          {/* Fake Location Marker */}
          <View className="absolute self-center top-1/2 -mt-10 items-center">
            <View className="w-[120px] h-[120px] p-4 items-center justify-center bg-transparent border-blue-400 border-[1px] rounded-full">
              <Ionicons name="location-sharp" size={30} color="#2563eb" />
              <View className="w-3 h-3 bg-blue-600 rounded-full mt-1" />
            </View>
          </View>

          {/* Status Badge */}
          <View className="absolute top-4 self-center bg-white px-4 py-2 rounded-full flex-row items-center shadow">
            <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
            <Text className="font-semibold text-lg">{status.label}</Text>
          </View>

          {/* Zoom buttons */}
          <View className="absolute right-4 top-10">
            <TouchableOpacity className="bg-white w-10 h-10 rounded-lg justify-center items-center mb-2 shadow">
              <Feather name="plus" size={18} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-white w-10 h-10 rounded-lg justify-center items-center shadow">
              <Feather name="minus" size={18} />
            </TouchableOpacity>
          </View>

          {/* Distance / ETA */}
          <View className="absolute flex-row left-4 bottom-4 bg-white px-4 py-2 rounded-xl shadow">
            <View className="bg-white px-3 py-2 rounded-xl shadow-sm">
              <Text className="text-xs text-gray-500">Distance</Text>
              <Text className="font-bold">{orderDetails.pricing.bags} bags</Text>
            </View>
            <View className="bg-white px-3 py-2 rounded-xl shadow-sm">
              <Text className="text-xs text-gray-500">ETA</Text>
              <Text className="font-bold text-blue-500">
                {status.etaMinutes ? `${status.etaMinutes} min` : '--'}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white mb-6 px-4">
          <View className="bg-white rounded-2xl p-4 shadow-lg mb-4">
            {/* 🔹 USER INFO */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Image
                  source={
                    customer && customer.image
                      ? { uri: customer.image }
                      : require('@/assets/images/profile.png')
                  }
                  className="w-[60px] h-[60px] rounded-full border-2 border-white"
                />
                <View className="ml-3">
                  <Text className="text-sm text-gray-500">Picking up from</Text>
                  <Text className="text-2xl font-semibold">
                    {customer && customer.name ? customer.name : 'Customer'}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Order #{formatOrderNumber(activeJob ? activeJob._id : undefined)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Address */}
            <View className="bg-blue-50 rounded-2xl p-4 mt-4">
              <View className="flex-row items-start">
                <Ionicons name="location-outline" size={16} color="blue" />
                <View className="ml-2">
                  <Text className="text-gray-500 text-sm">Pickup Address</Text>
                  <Text className="font-bold text-lg my-1">{orderDetails.address.street}</Text>
                  <Text className="text-xs text-gray-500">{orderDetails.address.city || 'Live data'}</Text>
                </View>
              </View>
            </View>

            {/* 🔹 INSTRUCTION CARD */}
            <View className="bg-orange-50 rounded-2xl p-4 mt-4">
              <View className="flex-row items-start">
                <Ionicons name="alert-circle-outline" size={16} color="#F97316" />
                <View className="ml-2">
                  <Text className="text-gray-500 text-sm">Instructions</Text>
                  <Text className="font-bold text-lg my-1">{orderDetails.service}</Text>
                  <Text className="text-xs text-gray-500">{orderDetails.instructions}</Text>
                </View>
              </View>
            </View>

            <View className="flex-row flex-1 gap-4">
              <View className="bg-blue-50 flex-1 rounded-2xl p-4 mt-4">
                <Text className="text-gray-500 font-medium text-base mb-2">Expected Bags</Text>
                <Text className="font-bold text-xl text-black">{orderDetails.pricing.bags}</Text>
              </View>

              <View className="bg-orange-50 flex-1 rounded-2xl p-4 mt-4">
                <Text className="text-gray-500 font-medium text-base mb-2">Your Earnings</Text>
                <Text className="font-bold text-xl text-green-500">
                  ${Number((total * driverEarningPercentage) / 100).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Out for Delivery Button */}
        <View className="px-5 mb-2 mt-[50px]">
          <TouchableOpacity
            onPress={async () => {
              if (!canStartOutForDelivery) return;
              const result = await onStartOutForDelivery();
              if (result !== false) {
                setIsWaitingForConfirmation(true);
              }
            }}
            disabled={!canStartOutForDelivery || isButtonWaiting}
            style={{ backgroundColor: Colors.primary }}
            className="gap-2 rounded-xl py-3 flex-row justify-center items-center"
          >
            <Ionicons name="car-outline" size={18} color="#fff" />
            <Text className="text-white text-lg font-semibold">
              {isButtonWaiting ? 'Waiting for Customer Confirmation' : 'Out for Delivery'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
