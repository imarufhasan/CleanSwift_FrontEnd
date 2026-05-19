import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useGetMyDriverJobsQuery } from '@/src/services/driverApi';

export default function Index() {
  const { data: myJobsRes } = useGetMyDriverJobsQuery();
  const currentJob = myJobsRes?.data?.find(
    order => !['DELIVERED', 'COMPLETED', 'CANCELED'].includes(order.status),
  );
  const order = {
    id: currentJob?._id ?? '-',
    eta: currentJob?.scheduledPickupAt ? new Date(currentJob.scheduledPickupAt).toLocaleString() : '--',
  };
  const status = {
    label: currentJob?.status?.replaceAll('_', ' ') ?? 'No active route',
  };

  return (
    <View className="flex-1">
      <View className="h-[100%] bg-blue-100 relative overflow-hidden">
        {/* Fake Map Grid Background */}
        <View className="absolute inset-0 opacity-40">
          <View className="flex-1 flex-row flex-wrap">
            {[...Array(100)]?.map((_, i) => (
              <View key={i} className="w-[10%] h-[10%] border border-blue-200" />
            ))}
          </View>
        </View>

        {/* Fake Location Marker */}
        <View className="absolute self-center top-1/2 -mt-6 items-center">
          <View className="w-[200px] h-[200px] p-4 items-center justify-center bg-transparent border-blue-400 border-[1px] rounded-full">
            <Ionicons name="location-sharp" size={40} color="#2563eb" />
            <View className="w-3 h-3 bg-blue-600 rounded-full mt-1" />
          </View>
        </View>

        {/* Title Badge */}
        <View className="absolute top-12 self-center bg-white px-4 py-2 rounded-full flex-row items-center shadow">
          <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
          <Text className="font-semibold text-lg">{status.label}</Text>
        </View>

        {/* Zoom buttons */}
        <View className="absolute right-4 top-28">
          <TouchableOpacity className="bg-white w-10 h-10 rounded-lg justify-center items-center mb-2 shadow">
            <Feather name="plus" size={18} />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white w-10 h-10 rounded-lg justify-center items-center shadow">
            <Feather name="minus" size={18} />
          </TouchableOpacity>
        </View>

        {/* Service Radius Bubble */}
        <View className="absolute left-4 bottom-4 bg-white px-4 py-2 rounded-xl shadow">
          <Text className="text-sm text-gray-500">Service Radius</Text>
          <Text className="font-bold text-[20px]">{myJobsRes?.data?.length ?? 0} jobs</Text>
        </View>
      </View>
    </View>
  );
}
