import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/color";
import RatingStars from "@/components/home/RatingStars";
import { liveTrackingData } from "@/data/liveTracking";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LiveTrackingScreen() {
  const router = useRouter();
  const { status, order, driver, orderDetails } = liveTrackingData;

  const total =
    orderDetails.pricing.bags * orderDetails.pricing.bagPrice +
    orderDetails.pricing.tip;

  return (
    <ScrollView className="flex-1">
      <SafeAreaView edges={["bottom"]} className="bg-[#F6F9FF] flex-1">
        {/* Map Placeholder */}
        <View className="h-[350px] bg-blue-100 relative">
          {/* back icon */}
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            className="absolute top-12 left-4 bg-white p-2 rounded-full shadow"
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
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

          {/* Distance / ETA */}
          <View className="absolute flex-row left-4 bottom-4 bg-white px-4 py-2 rounded-xl shadow">
            <View className="bg-white px-3 py-2 rounded-xl shadow-sm">
              <Text className="text-xs text-gray-500">Distance</Text>
              <Text className="font-bold">1.5 mi</Text>
            </View>
            <View className="bg-white px-3 py-2 rounded-xl shadow-sm">
              <Text className="text-xs text-gray-500">ETA</Text>
              <Text className="font-bold text-blue-500">6 min</Text>
            </View>
          </View>
        </View>

        {/* Driver Card */}
        <View className="bg-white rounded-2xl p-4 shadow mx-5 mb-5 mt-4">
          <View className="flex-row items-center mb-3">
            <Image
              source={{ uri: driver.avatar }}
              style={{ width: 40, height: 40, borderRadius: 25 }}
              resizeMode="cover"
            />
            <View className="flex-1 ml-2">
              <Text className="text-sm ml-1 text-gray-600">
                Picking up from
              </Text>
              <Text className="font-semibold text-lg">Ali Amin</Text>
              <View className="flex-row items-center">
                <Text className="text-sm ml-1 text-gray-600">
                  San Francisco, CA 984102
                </Text>
              </View>
            </View>
          </View>

          <View className="px-3 gap-2 flex-row bg-blue-100 rounded-xl py-3 justify-center items-start">

            <View>
              <Ionicons name="location-outline" size={14} color={Colors.primary}/>
            </View>
            <View className="flex-1">
              <Text className="text-sm ml-1 text-gray-600">
                Picking Address
              </Text>
              <Text className="font-semibold text-lg">
                123 Main Street, Apt 4B
              </Text>
              <Text className="text-sm ml-1 text-gray-600">
                San Francisco, CA 984102
              </Text>
            </View>
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
              <Text className="text-gray-500 text-xs">
                Special Instructions
              </Text>
              <Text className="font-medium">{orderDetails.instructions}</Text>
            </View>

            <View className="pt-3">
              <View className="border-t border-b border-gray-200 py-3 flex-row justify-between mb-2">
                <Text className="text-gray-600">
                  {orderDetails.pricing.bags} bags × $
                  {orderDetails.pricing.bagPrice}
                </Text>

                <Text>
                  ${orderDetails.pricing.bags * orderDetails.pricing.bagPrice}
                </Text>
              </View>

              <View className="flex-row justify-between mt-2">
                <Text className="font-bold">Total</Text>
                <Text className="font-bold text-blue-600">${total}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mark as Delivered Button */}
        <View className="px-5 mb-5">
          <TouchableOpacity
            onPress={() => router.push("/DeliveredSuccessScreen")}
            className="bg-green-600 gap-2 rounded-xl py-3 flex-row justify-center items-center"
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text className="text-white text-lg font-semibold">
              Mark as Delivered
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
