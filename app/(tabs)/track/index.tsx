import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import Colors from "@/constants/color";
import RatingStars from "@/components/home/RatingStars";
import { trackingData } from "@/data/tracking";
import { useRouter } from "expo-router";

export default function Track() {
  const router = useRouter();
  const { status, order, driver, orderDetails } = trackingData;

  const total =
    orderDetails.pricing.bags * orderDetails.pricing.bagPrice +
    orderDetails.pricing.tip;

  return (
    <ScrollView className="flex-1">
      {/* Map Placeholder */}
      <View className="h-[300px] bg-blue-100 relative">
        {/* Status Badge */}
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

        {/* ETA Bubble */}
        <View className="absolute left-4 bottom-4 bg-white px-4 py-2 rounded-xl shadow">
          <Text className="text-sm text-gray-500">Estimated Arrival</Text>
          <Text className="font-bold text-[20px]">
            {status.etaMinutes} mins
          </Text>
        </View>
      </View>

      {/* Driver Card */}
      <View className="bg-white rounded-2xl p-4 shadow mx-5 mb-5">
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: driver.avatar }}
            style={{ width: 40, height: 40, borderRadius: 25 }}
            resizeMode="cover"
          />
          <View className="flex-1 ml-2">
            <Text className="font-semibold text-base">{driver.name}</Text>
            <View className="flex-row items-center mt-1">
              <RatingStars rating={driver.rating} />
              <Text className="text-sm ml-1 text-gray-600">
                {driver.rating} ({driver.trips} trips)
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row mb-4">
          <View className="flex-1 flex-row justify-start pl-4 gap-2 border border-blue-200 rounded-xl py-3 items-center mr-2">
            <Feather name="box" size={18} color={Colors.primary} />
            <View>
              <Text className="text-xs text-gray-500">Order</Text>
              <Text className="font-semibold">#{order.id}</Text>
            </View>
          </View>

          <View className="flex-1 flex-row justify-start pl-4 gap-2 border border-blue-200 rounded-xl py-3 items-center ml-2">
            <Feather name="clock" size={18} color={Colors.primary} />
            <View>
              <Text className="text-xs text-gray-500">ETA</Text>
              <Text className="font-semibold">{order.eta}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row">
          <TouchableOpacity
            onPress={() => router.push("/ChatScreen")}
            className="flex-1 border bg-blue-100 border-blue-400 rounded-xl py-3 flex-row justify-center items-center mr-2"
          >
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={Colors.primary}
            />
            <Text className="ml-2 text-blue-600 font-semibold">Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/CallScreen")}
            className="flex-1 border bg-blue-100 border-blue-400 rounded-xl py-3 flex-row justify-center items-center ml-2"
          >
            <Ionicons name="call-outline" size={18} color={Colors.primary} />
            <Text className="ml-2 text-blue-600 font-semibold">
              Call Driver
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Details */}
      <View className="mx-5 mb-5">
        <Text className="font-bold text-[20px] mb-3">Order Details</Text>

        <View className="bg-white rounded-2xl p-4 shadow mb-8">
          <View className="mb-3">
            <Text className="text-gray-500 text-xs">Service</Text>
            <Text className="font-medium">{orderDetails.service}</Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-500 text-xs">Pickup Address</Text>
            <Text className="font-medium">{orderDetails.address.street}</Text>
            <Text className="text-gray-500 text-sm">
              {orderDetails.address.city}
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-500 text-xs">Special Instructions</Text>
            <Text className="font-medium">{orderDetails.instructions}</Text>
          </View>

          <View className="border-t border-gray-200 pt-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">
                {orderDetails.pricing.bags} bags × $
                {orderDetails.pricing.bagPrice}
              </Text>
              <Text>
                ${orderDetails.pricing.bags * orderDetails.pricing.bagPrice}
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Tip</Text>
              <Text>${orderDetails.pricing.tip}</Text>
            </View>

            <View className="flex-row justify-between mt-2">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold text-blue-600">${total}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
