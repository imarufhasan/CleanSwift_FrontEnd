import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";
import RatingStars from "@/components/home/RatingStars";
import Toast from "@/constants/toast";

export default function OrderDetailsDriver() {
  const router = useRouter();
  const data = {
    driver: {
      name: "Ali Amin",
      rating: 4.9,
      trips: 234,
      avatar: "https://i.pravatar.cc/150?img=12",
      image: require("@/assets/images/profile.png"),
    },
    order: {
      service: "Washing & Drying",
      pickupAddress: "123 Main Street, Apt 4B",
      city: "San Francisco, CA 94102",
      instruction: "Light wash–Gentle wash for delicate clothes",
      quantity: 2,
      pricePerBag: 45,
      tip: 5,
      total: 95,
    },
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header */}
      <View
        className="pb-6"
        style={{ backgroundColor: Colors.primary }}
      >
        <View className="flex-row items-center px-5 pt-12 mb-[40px]">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            className="bg-white p-2 rounded-full mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          <Text className="text-white text-[24px]">Order Details</Text>
        </View>
      </View>

      {/* Driver Card */}
      <View className="px-5 -mt-10">
        <View className="bg-white rounded-2xl p-4 shadow">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={data.driver.image ?? { uri: data.driver.avatar }}
                className="w-14 h-14 rounded-full"
              />

              <View className="ml-3">
                <Text className="font-bold text-2xl">{data.driver.name}</Text>

                <View className="flex-row items-center mt-1">
                  <Text className="ml-1 text-sm text-gray-600">
                    28 orders completed
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={() => router.push("/ChatScreen")}
              className="flex-row bg-blue-100/80 items-center justify-center border rounded-xl py-3 w-[48%]"
              style={{ borderColor: Colors.primary }}
            >
              <AntDesign name="message" size={18} color={Colors.primary} />
              <Text
                className="ml-2 text-lg font-semibold"
                style={{ color: Colors.primary }}
              >
                Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/CallScreen")}
              className="flex-row bg-blue-100/80 items-center justify-center border rounded-xl py-3 w-[48%]"
              style={{ borderColor: Colors.primary }}
            >
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
              <Text
                className="ml-2 text-lg font-semibold"
                style={{ color: Colors.primary }}
              >
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
          <Text className="font-semibold mb-3">{data.order.service}</Text>

          {/* Address */}
          <Text className="text-gray-400 text-sm">Pickup Address</Text>
          <Text className="font-semibold">{data.order.pickupAddress}</Text>
          <Text className="text-gray-500 mb-3">{data.order.city}</Text>

          {/* Instruction */}
          <Text className="text-gray-400 text-sm">Special Instructions</Text>
          <Text className="font-semibold mb-4">{data.order.instruction}</Text>

          {/* Price Breakdown */}
          <View className="border-t border-gray-200 pt-3 space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">
                {data.order.quantity} bags × ${data.order.pricePerBag}
              </Text>
              <Text className="text-gray-700">
                ${data.order.quantity * data.order.pricePerBag}.00
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-500">Tip</Text>
              <Text className="text-gray-700">${data.order.tip}.00</Text>
            </View>

            <View className="flex-row justify-between border-t border-gray-200 pt-3 mt-2">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold" style={{ color: Colors.primary }}>
                ${data.order.total}.00
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="h-24" />
    </ScrollView>
  );
}
