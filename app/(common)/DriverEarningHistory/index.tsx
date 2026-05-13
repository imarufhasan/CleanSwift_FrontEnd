import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import RatingStars from '@/components/home/RatingStars';
import Colors from '@/constants/color';
import { useGetMyDriverJobsQuery } from '@/src/services/driverApi';

export default function Index() {
  const router = useRouter();
  const { data: jobsRes } = useGetMyDriverJobsQuery();
  const completedJobs = (jobsRes?.data ?? []).filter(job => ['DELIVERED', 'COMPLETED'].includes(job.status));
  const recentOrders = completedJobs.slice(0, 5).map(order => ({
    id: order._id,
    quantity: order.bags,
    price: order.total,
    rating: 5,
    status: order.status.replaceAll('_', ' '),
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
  }));
  const todayEarning = completedJobs
    .filter(job => job.createdAt && new Date(job.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, job) => sum + Number(job.total ?? 0) * 0.7, 0);
  const weeklyEarning = completedJobs.reduce((sum, job) => sum + Number(job.total ?? 0) * 0.7, 0);

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      {/* 🔹 Header */}
      <View className="flex-row items-center justify-between py-4">
        <TouchableOpacity onPress={() => router.back()} className="bg-blue-100 p-2 rounded-full">
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text className="text-2xl font-semibold">My Earning</Text>

        {/* Balance spacing */}
        <View className="w-9" />
      </View>

      {/* 🔹 Earnings Section */}
      <View className="mt-6">
        <View className="flex-row gap-4">
          {/* Card 1 */}
          <View className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
            <Text className="text-gray-500 text-sm">Today Earning</Text>
            <Text className="text-green-500 font-bold text-2xl mt-2">${todayEarning.toFixed(2)}</Text>
          </View>

          {/* Card 2 */}
          <View className="flex-1 bg-white border border-gray-200 rounded-xl p-4">
            <Text className="text-gray-500 text-sm">Weekly Earning</Text>
            <Text className="text-black font-bold text-2xl mt-2">${weeklyEarning.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View className="mt-6">
        <View className="flex-row gap-4 mb-4">
          <AntDesign name="dollar" size={22} color={'#01A1FF'} />
          <Text style={{ color: Colors.primary }} className=" text-lg">
            Earning Details
          </Text>
        </View>

        {recentOrders.map(order => (
          <TouchableOpacity
            key={order.id}
            className="bg-white items-safe justify-center rounded-2xl p-4 mb-4 border border-gray-200"
          >
            <View className=" flex-row items-center justify-center">
              <View className="justify-between flex-1 mb-1 ml-2">
                <Text className="font-semibold">Order #{order.id}</Text>
                <Text className="text-sm text-gray-500 mb-2">{order.quantity} bags</Text>
              </View>

              <View className="items-end justify-center">
                <Text className="text-green-600 text-lg font-bold">$ {order.price}</Text>
                <View className="flex-row items-center">
                  <RatingStars rating={order.rating} />
                  <Text className="ml-1 text-sm">{order.rating.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            <View className="h-[1px] bg-gray-100 w-full mt-3" />
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle-outline" size={16} color="green" />
                <Text className="ml-1 text-green-600 text-sm">{order.date}</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  console.log('recet_item: ', order);
                  router.push('/(common)/OrderDetailsDriver');
                }}
                className="my-2"
              >
                <Text style={{ color: Colors.primary }} className="font-semibold">
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
