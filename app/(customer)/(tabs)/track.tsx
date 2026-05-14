import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import Colors from "@/constants/color";
import RatingStars from "@/components/home/RatingStars";
import { useRouter } from "expo-router";
import { useGetMyOrdersQuery } from "@/src/services/orderApi";
import { useOrderSocket } from "@/src/hooks/useOrderSocket";

export default function Track() {
  const router = useRouter();
  const { data: ordersRes, refetch } = useGetMyOrdersQuery();
  const activeOrder = ordersRes?.data?.find(
    order => !["DELIVERED", "COMPLETED", "CANCELED"].includes(order.status),
  );
  const driver = activeOrder?.driver ?? null;
  const status = {
    label: activeOrder?.status?.replaceAll("_", " ") ?? "No active order",
    etaMinutes: activeOrder?.scheduledPickupAt ? 12 : 0,
  };
  const order = {
    id: activeOrder?._id ?? "-",
    eta: activeOrder?.scheduledPickupAt
      ? new Date(activeOrder.scheduledPickupAt).toLocaleString()
      : "--",
  };
  const orderDetails = {
    service: activeOrder?.serviceType
      ? activeOrder.serviceType.replaceAll("_", " ")
      : "Unavailable",
    address: {
      street: activeOrder?.address ?? "No address available",
      city: "",
    },
    instructions: activeOrder?.specialInstructions ?? "No special instructions",
    pricing: {
      bags: activeOrder?.bags ?? 0,
      bagPrice: activeOrder?.pricePerBag ?? 0,
      tip: 0,
    },
  };

  const total =
    orderDetails.pricing.bags * orderDetails.pricing.bagPrice +
    orderDetails.pricing.tip;

  useOrderSocket({
    role: 'CUSTOMER',
    orderId: activeOrder?._id,
    onCustomerUpdate: refetch,
  });

  return (
    <ScrollView className="flex-1">
      {/* Map Placeholder */}
      <View className="h-[350px] bg-blue-100 relative overflow-hidden">
        {/* <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 23.8103,
            longitude: 90.4125,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: 23.8103,
              longitude: 90.4125,
            }}
            title="Driver"
          />
        </MapView> */}

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
            source={{ uri: driver?.avatar }}
            style={{ width: 40, height: 40, borderRadius: 25 }}
            resizeMode="cover"
          />
          <View className="flex-1 ml-2">
            <Text className="font-semibold text-base">{driver?.name}</Text>
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
            onPress={() =>
              router.push({
                pathname: "/(common)/ChatScreen" as any,
                params: {
                  orderId: String(order.id),
                  name: driver?.name,
                  avatar: driver?.avatar,
                },
              })
            }
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
            onPress={() =>
              router.push({
                pathname: "/(common)/CallScreen" as any,
                params: { name: driver?.name, image: driver?.avatar },
              })
            }
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
