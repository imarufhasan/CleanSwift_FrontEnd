import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { trackingData } from "@/data/tracking";

export default function index() {
  const { status, order, driver, orderDetails } = trackingData;

  return (
    <View className="flex-1">
      <View className="h-[100%] bg-blue-100 relative">
        {/* Status Badge */}
        <View className="absolute top-12 self-center bg-white px-4 py-2 rounded-full flex-row items-center shadow">
          <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
          <Text className="font-semibold text-lg">My Routes</Text>
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

        {/* ETA Bubble */}
        <View className="absolute left-4 bottom-4 bg-white px-4 py-2 rounded-xl shadow">
          <Text className="text-sm text-gray-500">Service Radius</Text>
          <Text className="font-bold text-[20px]">5 miles</Text>
        </View>
      </View>
    </View>
  );
}
