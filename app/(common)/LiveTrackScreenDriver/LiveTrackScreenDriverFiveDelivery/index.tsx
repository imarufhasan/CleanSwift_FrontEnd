import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/color";
import RatingStars from "@/components/home/RatingStars";
import { liveTrackingData } from "@/data/liveTracking";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomerCard from "@/components/driver/home/CustomerCard";

export default function DeliveryStep({ setDeliverySuccessModal }: any) {
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
          {/* Fake Map Grid Background */}
          <View className="absolute inset-0 opacity-40">
            <View className="flex-1 flex-row flex-wrap">
              {[...Array(100)].map((_, i) => (
                <View
                  key={i}
                  className="w-[10%] h-[10%] border border-blue-200"
                />
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
              <Text className="font-bold">1.5 mi</Text>
            </View>
            <View className="bg-white px-3 py-2 rounded-xl shadow-sm">
              <Text className="text-xs text-gray-500">ETA</Text>
              <Text className="font-bold text-blue-500">6 min</Text>
            </View>
          </View>
        </View>

        <View className="bg-white mb-6 px-4">
          <View className="bg-white rounded-2xl p-4 shadow-lg mb-4">
            {/* 🔹 USER INFO */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?img=12" }}
                  className="w-[60px] h-[60px] rounded-full border-2 border-white"
                />
                <View className="ml-3">
                  <Text className="text-sm text-gray-500">Picking up from</Text>
                  <Text className="text-2xl font-semibold">Ali Amin</Text>
                  <Text className="text-sm text-gray-500">order #1251</Text>
                </View>
              </View>
            </View>

            {/* Address */}
            <View className="bg-blue-50 rounded-2xl p-4 mt-4">
              <View className="flex-row items-start">
                <Ionicons name="location-outline" size={16} color="blue" />
                <View className="ml-2">
                  <Text className="text-gray-500 text-sm">Pickup Address</Text>

                  <Text className="font-bold text-lg my-1">
                    123 Main Street, Apt 4B
                  </Text>
                  <Text className="text-xs text-gray-500">
                    San Francisco, CA 94102
                  </Text>
                </View>
              </View>
            </View>

            {/* 🔹 INSTRUCTION CARD */}
            <View className="bg-orange-50 rounded-2xl p-4 mt-4">
              <View className="flex-row items-start">
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color="#F97316"
                />
                <View className="ml-2">
                  <Text className="text-gray-500 text-sm">Instructions</Text>

                  <Text className="font-bold text-lg my-1">Delicate Items</Text>
                  <Text className="text-xs text-gray-500">
                    Light wash • Gentle wash for delicate clothes
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row flex-1 gap-4">
              <View className="bg-blue-50 flex-1 rounded-2xl p-4 mt-4">
                <Text className="text-gray-500 font-medium text-base mb-2">
                  Expected Bags
                </Text>
                <Text className="font-bold text-xl text-black">2</Text>
              </View>

              <View className="bg-orange-50 flex-1 rounded-2xl p-4 mt-4">
                <Text className="text-gray-500 font-medium text-base mb-2">
                  Your Earnings
                </Text>
                <Text className="font-bold text-xl text-green-500">$45.00</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Mark as Delivered Button */}
        <View className=" px-5 mb-2 mt-[50px]">
          <TouchableOpacity
            //onPress={() => router.push("/DeliveredSuccessScreen")}
            onPress={() => setDeliverySuccessModal(true)}
            style={{ backgroundColor: Colors.primary }}
            className="gap-2 rounded-xl py-3 flex-row justify-center items-center"
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text className="text-white text-lg font-semibold">
              Complete Delivery
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
