import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/color';
import { useLocalSearchParams, useRouter } from 'expo-router';
import RatingStars from '@/components/home/RatingStars';
import { useGetMyOrdersQuery } from '@/src/services/orderApi';

export default function DriverDetails() {
  const router = useRouter();
  const { name, image, rating, trips, vehicle, orderId } = useLocalSearchParams<{
    name?: string;
    image?: string;
    rating?: string;
    trips?: string;
    vehicle?: string;
    orderId?: string;
  }>();

  const { data: ordersRes } = useGetMyOrdersQuery();
  const order =
    ordersRes?.data?.find(item => item._id === orderId) ||
    ordersRes?.data?.find(item => !['DELIVERED', 'COMPLETED', 'CANCELED'].includes(item.status));
  const driver = order?.driver;

  const displayName = name || driver?.name || 'Driver';
  const displayImage = image || driver?.image || '';
  const displayRating = Number(rating || 4.9);
  const displayTrips = Number(trips || 0);
  const displayVehicle = vehicle || 'Vehicle info unavailable';

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="pb-6" style={{ backgroundColor: Colors.primary }}>
        <View className="flex-row items-center px-5 pt-12 mb-[40px]">
          <TouchableOpacity onPress={() => router.back()} className="bg-white p-2 rounded-full mr-3">
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          <Text className="text-white text-[24px]">Driver Details</Text>
        </View>
      </View>

      {/* Driver Card */}
      <View className="px-5 -mt-10">
        <View className="bg-white rounded-2xl p-4 shadow">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={displayImage ? { uri: displayImage } : require('@/assets/images/profile.png')}
                className="w-14 h-14 rounded-full"
              />

              <View className="ml-3">
                <Text className="font-bold text-base">{displayName}</Text>

                <View className="flex-row items-center mt-1">
                  <RatingStars rating={displayRating} size={16} />
                  <Text className="ml-1 text-sm text-gray-600">
                    {displayRating.toFixed(1)} ({displayTrips} trips)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-1 w-full justify-between mt-4">
            <TouchableOpacity
              className="border rounded-xl py-3 bg-blue-100/50"
              style={{ borderColor: Colors.primary }}
            >
              <Text className="ml-2 text-black">Vehicle</Text>
              <Text className="ml-2 font-bold text-black">{displayVehicle}</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1 w-full justify-between mt-4">
            <TouchableOpacity
              className="pl-2 border rounded-xl py-3 bg-green-100/50"
              style={{ borderColor: Colors.green }}
            >
              <Text className="text-black">Current Status</Text>
              <Text className="mt-2 font-bold text-green-400">
                {order?.status?.replaceAll('_', ' ') || 'Handling Your Order'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="px-5 mt-6">
        <Text className="text-lg font-bold mb-3">Safety & Trust</Text>

        <View className="bg-white rounded-2xl p-4 shadow">
          <View className="flex-row mb-4">
            <View className="bg-green-100 rounded-full w-[40px] h-[40px] justify-center items-center">
              <AntDesign name="check-circle" size={20} color={'green'} />
            </View>
            <View className="ml-3">
              <Text className="text-lg font-semibold">Verified Driver</Text>
              <Text className="text-sm">Background Check Completed</Text>
            </View>
          </View>

          <View className="flex-row mb-4">
            <View className="bg-blue-100 rounded-full w-[40px] h-[40px] justify-center items-center">
              <AntDesign name="check-circle" size={20} color={'blue'} />
            </View>
            <View className="ml-3">
              <Text className="text-lg font-semibold">Insured Vehicle</Text>
              <Text className="text-sm">Full coverage insurance</Text>
            </View>
          </View>

          <View className="flex-row">
            <View className="bg-purple-100 rounded-full w-[40px] h-[40px] justify-center items-center">
              <Feather name="star" size={20} color={'purple'} />
            </View>
            <View className="ml-3">
              <Text className="text-lg font-semibold">Top Rated</Text>
              <Text className="text-sm">Excellent customer feedback</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="h-24" />
    </ScrollView>
  );
}
