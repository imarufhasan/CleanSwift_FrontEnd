import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import Toast from "@/constants/toast";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  const [data, setData] = useState({
    user: {
      name: "Ali Amin",
    },

    location: {
      title: "Current Location",
      street: "123 Main Street, Apt 4B",
      city: "San Francisco",
      state: "CA 94102",
    },

    activeOrder: {
      id: 1248,
      status: "Washing",
      quantity: 2,
      price: 90,
      progress: 50,
      estimatedDelivery: "Today, 6:00 PM",
      steps: ["Picked Up", "Washing", "Delivery"],
      currentStep: 1,
    },

    recentOrders: [
      {
        id: 1247,
        quantity: 1,
        price: 45,
        rating: 5.0,
        status: "Delivered",
        date: "Jan 24, 2026",
      },
      {
        id: 1246,
        quantity: 2,
        price: 80,
        rating: 4.8,
        status: "Delivered",
        date: "Jan 18, 2026",
      },
      {
        id: 1248,
        quantity: 2,
        price: 90,
        rating: 5.0,
        status: "Delivered",
        date: "Today",
      },
    ],
  });

  const getStatusStyle = (status: any) => {
    switch (status) {
      case "Washing":
        return "bg-orange-100 text-orange-500";
      case "Delivered":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      // setData((prev) => ({
      //   ...prev,
      //   activeOrder: {
      //     ...prev.activeOrder,
      //     progress: 75,
      //     currentStep: 2,
      //     status: "Delivery",
      //     estimatedDelivery: "Today, 7:00 PM",
      //   },
      //   recentOrders: [
      // {
      //   id: 1248,
      //   quantity: 2,
      //   price: 90,
      //   rating: 5.0,
      //   status: "Delivered",
      //   date: "Today",
      // },
      //     ...prev.recentOrders,
      //   ],
      // }));

      setRefreshing(false);
      Toast.show("updated");
    }, 1500);
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="flex-1 bg-white"
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: Colors.primary,
        }}
        className=" rounded-b-[40px] pb-20"
      >
        <View className="flex-row px-5 pt-12 justify-between items-center">
          <View className="flex-1">
            <Text className="text-sm text-white/80">Welcome back,</Text>
            <Text className="text-2xl font-bold text-white">
              {data.user.name}
            </Text>
          </View>

          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => router.push("/notifications")}
              className="bg-white/20 p-3 rounded-full"
            >
              <Ionicons name="notifications-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location */}
        <View className="px-5 mt-8">
          <View
            style={{
              backgroundColor: Colors.primary,
            }}
            className="border border-white/40 rounded-2xl p-4"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-row items-start">
                <View className="bg-white/20 w-9 h-9 rounded-full justify-center items-center">
                  <Ionicons name="location-outline" size={18} color="#fff" />
                </View>

                <View className="ml-3">
                  <Text className="text-white font-semibold">
                    {data.location.title}
                  </Text>
                  <Text className="text-white text-lg">
                    {data.location.street}
                  </Text>
                  <Text className="text-white text-sm">
                    {data.location.city}, {data.location.state}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.push("/ChangeLocation")}>
                <Text className="text-white font-medium">Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Floating Request Pickup */}
      <View className="px-5 -mt-12 z-10">
        <View
          style={{
            backgroundColor: Colors.primary,
          }}
          className="border border-white/40 shadow-xl rounded-2xl p-5 flex-row justify-between items-center"
        >
          <View>
            <Text className="text-white text-lg font-bold">Request Pickup</Text>
            <Text className="text-white/90 text-sm mt-1">
              Get your laundry picked up today
            </Text>
          </View>

          <TouchableOpacity className="bg-white w-12 h-12 rounded-full justify-center items-center shadow">
            <Ionicons name="add" size={26} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="px-5 mt-6">
        {/* Active Order */}
        <Text className="text-lg font-bold mb-3">Active Order</Text>

        <View className="bg-white rounded-2xl p-4 shadow-sm mb-6 border border-gray-100">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-safe">
              <View
                className="w-9 h-9 rounded-full justify-center items-center"
                style={{ backgroundColor: "rgba(37, 99, 235, 0.2)" }}
              >
                <Ionicons
                  name="cube-outline"
                  size={20}
                  color={Colors.primary}
                />
              </View>

              <View className="ml-2">
                <Text className="font-semibold">
                  Order #{data.activeOrder.id}
                </Text>
                <Text className="text-sm text-gray-500 mb-3">
                  {data.activeOrder.quantity} bags • ${data.activeOrder.price}
                  .00
                </Text>
              </View>
            </View>

            <Text
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                data.activeOrder.status,
              )}`}
            >
              {data.activeOrder.status}
            </Text>
          </View>

          {/* Steps */}
          <View className="flex-row justify-between mb-2">
            {data.activeOrder.steps.map((step, index) => (
              <Text
                key={step}
                className={`text-xs ${
                  index <= data.activeOrder.currentStep
                    ? "text-blue-500"
                    : "text-gray-400"
                }`}
              >
                {step}
              </Text>
            ))}
          </View>

          {/* Progress Bar */}
          <View className="h-2 bg-gray-200 rounded-full mb-3">
            <View
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${data.activeOrder.progress}%` }}
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-gray-500">
              Estimated delivery: {data.activeOrder.estimatedDelivery}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/LiveTrackingScreen")}
              className="flex-row gap-3 items-center"
            >
              <Text
                style={{ color: Colors.primary }}
                className="text-[14px] font-bold"
              >
                Track Live
              </Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders */}
        <Text className="text-lg font-bold mb-3">Recent Orders</Text>

        {data.recentOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            className="bg-white flex-row items-safe justify-center rounded-2xl p-4 mb-4 border border-gray-100"
          >
            <View
              className="w-9 h-9 rounded-full justify-center items-center"
              style={{ backgroundColor: "rgba(161, 162, 167, 0.2)" }}
            >
              <Ionicons name="cube-outline" size={20} color={"black"} />
            </View>
            <View className="justify-between flex-1 mb-1 ml-2">
              <Text className="font-semibold">Order #{order.id}</Text>
              <Text className="text-sm text-gray-500 mb-2">
                {order.quantity} bag • Estimate cost ${order.price}
              </Text>
              <View className="flex-row items-center">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color="green"
                />
                <Text className="ml-1 text-green-600 text-sm">
                  {order.status}
                </Text>
              </View>
            </View>

            <View className="items-end justify-center">
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#FACC15" />
                <Text className="ml-1 text-sm">{order.rating.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  console.log("recet_item: ", order);
                  router.push("/(stack)/OrderDetails");
                }}
                className="my-2"
              >
                <Text
                  style={{ color: Colors.primary }}
                  className="font-semibold"
                >
                  View Details
                </Text>
              </TouchableOpacity>

              <Text className="text-xs text-gray-400">{order.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View className="h-24" />
    </ScrollView>
  );
}
