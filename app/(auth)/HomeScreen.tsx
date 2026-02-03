import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
      <ScrollView className="flex-1 bg-white px-5">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-sm text-white/80">Welcome back,</Text>
            <Text className="text-2xl font-bold text-white">Ali Amin</Text>
          </View>

          <TouchableOpacity className="bg-white/20 p-3 rounded-full">
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Location Card */}
        <View className="bg-blue-400 rounded-2xl p-4 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={18} color="#fff" />
              <Text className="ml-2 text-white font-semibold">
                Current Location
              </Text>
            </View>
            <Text className="text-white font-medium">Change</Text>
          </View>

          <Text className="text-white text-sm">
            123 Main Street, Apt 4B
          </Text>
          <Text className="text-white text-sm">
            San Francisco, CA 94102
          </Text>
        </View>

        {/* Request Pickup */}
        <View className="bg-blue-500 rounded-2xl p-5 flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-lg font-bold">
              Request Pickup
            </Text>
            <Text className="text-white/90 text-sm mt-1">
              Get your laundry picked up today
            </Text>
          </View>

          <TouchableOpacity className="bg-white w-12 h-12 rounded-full justify-center items-center">
            <Ionicons name="add" size={26} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Active Order */}
        <Text className="text-lg font-bold mb-3">Active order</Text>

        <View className="bg-white rounded-2xl p-4 shadow-sm mb-6 border border-gray-100">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Ionicons name="cube-outline" size={20} color="#2563EB" />
              <Text className="ml-2 font-semibold">
                Order #1248
              </Text>
            </View>

            <Text className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-xs font-semibold">
              Washing
            </Text>
          </View>

          <Text className="text-sm text-gray-500 mb-3">
            2 bags • $90.00
          </Text>

          {/* Progress */}
          <View className="flex-row justify-between mb-2">
            <Text className="text-xs text-blue-500">Picked Up</Text>
            <Text className="text-xs text-blue-500">Washing</Text>
            <Text className="text-xs text-gray-400">Delivery</Text>
          </View>

          <View className="h-1 bg-gray-200 rounded-full mb-3">
            <View className="h-1 bg-blue-500 rounded-full w-2/3" />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-gray-500">
              Estimated delivery: Today, 6:00 PM
            </Text>
            <Text className="text-blue-500 text-sm font-semibold">
              Track Live →
            </Text>
          </View>
        </View>

        {/* Recent Orders */}
        <Text className="text-lg font-bold mb-3">Recent Orders</Text>

        {[1, 2, 3].map((item) => (
          <View
            key={item}
            className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
          >
            <View className="flex-row justify-between items-center mb-1">
              <Text className="font-semibold">
                Order #1247
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#FACC15" />
                <Text className="ml-1 text-sm">5.0</Text>
              </View>
            </View>

            <Text className="text-sm text-gray-500 mb-2">
              1 bag • Estimate cost $45
            </Text>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="green" />
                <Text className="ml-1 text-green-600 text-sm">
                  Delivered
                </Text>
              </View>
              <Text className="text-xs text-gray-400">
                Jan 24, 2026
              </Text>
            </View>
          </View>
        ))}

        <View className="mb-[100px]"></View>
      </ScrollView>
  );
}
