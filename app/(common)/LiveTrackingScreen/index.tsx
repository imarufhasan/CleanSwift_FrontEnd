import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/color";
import RatingStars from "@/components/home/RatingStars";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetMyOrdersQuery, type Order } from "@/src/services/orderApi";
import { useOrderSocket } from "@/src/hooks/useOrderSocket";
import { useLocalSearchParams } from "expo-router";
import { formatOrderNumber } from "@/src/utils/orderNumber";

const buildSteps = (order?: Order) => {
  const current = !order
    ? 0
    : order.status === "DELIVERED" || order.status === "COMPLETED"
      ? 7
    : order.status === "OUT_FOR_DELIVERY"
        ? 6
        : order.status === "FOLDING"
          ? 5
          : order.status === "DRYING"
            ? 4
        : order.timeline?.foldingAt
          ? 5
          : order.timeline?.dryingAt
            ? 4
            : order.status === "WASHING_DRYING"
              ? 3
              : order.status === "PICKED_UP"
                ? 2
                : order.status === "DRIVER_ASSIGNED"
                  ? 1
                  : 0;

  const orderSteps = [
    {
      key: "requested",
      title: "Requested",
      match: [
        "REQUESTED",
        "DRIVER_ASSIGNED",
        "PICKED_UP",
        "WASHING_DRYING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
      ],
      icon: "time-outline",
    },
    {
      key: "driver_assigned",
      title: "Driver Assigned",
      match: [
        "DRIVER_ASSIGNED",
        "PICKED_UP",
        "WASHING_DRYING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
      ],
      icon: "person-outline",
    },
    {
      key: "picked",
      title: "Picked Up",
      match: ["PICKED_UP", "WASHING_DRYING", "OUT_FOR_DELIVERY", "DELIVERED"],
      icon: "cube-outline",
    },
    {
      key: "washing",
      title: "Washing",
      match: ["WASHING_DRYING", "OUT_FOR_DELIVERY", "DELIVERED"],
      icon: "water-outline",
    },
    {
      key: "drying",
      title: "Drying",
      match: ["OUT_FOR_DELIVERY", "DELIVERED"],
      icon: "cloud-outline",
    },
    {
      key: "folding",
      title: "Folding",
      match: ["OUT_FOR_DELIVERY", "DELIVERED"],
      icon: "inbox-outline",
    },
    {
      key: "delivery",
      title: "Out for Delivery",
      match: ["OUT_FOR_DELIVERY", "DELIVERED"],
      icon: "bicycle-outline",
    },
    {
      key: "delivered",
      title: "Delivered",
      match: ["DELIVERED"],
      icon: "checkmark-done-circle-outline",
    },
  ];

  return orderSteps.map((step, index) => {
    const isDone = index < current;
    const isActive = index === current;

    return {
      ...step,
      status: isDone ? "done" : isActive ? "active" : "pending",
    };
  });
};

const getEffectiveBagCount = (order?: Order) =>
  Math.max(0, order?.bagCountAtDelivery ?? order?.bagCountAtPickup ?? order?.bags ?? 0);

export default function LiveTrackingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { data: ordersRes, refetch } = useGetMyOrdersQuery();
  const orders = ordersRes?.data ?? [];
  const clickedOrder = orderId
    ? orders.find((order) => order._id === orderId)
    : undefined;
  const activeOrder = orderId
    ? clickedOrder
    : orders.find(
        (order) =>
          !["DELIVERED", "COMPLETED", "CANCELED"].includes(order.status),
      );
  const driver = activeOrder?.driver ?? null;
  const driverName =
    activeOrder && typeof activeOrder.driver === 'object' && activeOrder.driver
      ? activeOrder.driver.name ?? 'Driver'
      : 'Driver';
  const driverImage =
    activeOrder && typeof activeOrder.driver === 'object' && activeOrder.driver
      ? activeOrder.driver.image ?? ''
      : '';
  const status = {
    label: activeOrder?.status?.replaceAll("_", " ") ?? "No active order",
    etaMinutes: activeOrder?.scheduledPickupAt ? 12 : 0,
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
      bags: getEffectiveBagCount(activeOrder),
      bagPrice: activeOrder?.pricePerBag ?? 0,
      tip: 0,
    },
  };

  const total =
    orderDetails.pricing.bags * orderDetails.pricing.bagPrice +
    orderDetails.pricing.tip;

  useOrderSocket({
    role: "CUSTOMER",
    orderId: activeOrder?._id,
    onCustomerUpdate: refetch,
  });

  return (
    <ScrollView className="flex-1">
      <SafeAreaView edges={["bottom"]} className="bg-[#F6F9FF] flex-1">
        {/* Map Placeholder */}
        <View className="h-[300px] bg-blue-100 relative">
          {/* Fake Map Grid Background */}
          <View className="absolute inset-0 opacity-40">
            <View className="flex-1 flex-row flex-wrap">
              {[...Array(100)]?.map((_, i) => (
                <View
                  key={i}
                  className="w-[10%] h-[10%] border border-blue-200"
                />
              ))}
            </View>
          </View>

          {/* Fake Location Marker */}
          <View className="absolute self-center top-1/2 -mt-10 items-center">
            <View className="w-[100px] h-[100px] p-4 items-center justify-center bg-transparent border-blue-400 border-[1px] rounded-full">
              <Ionicons name="location-sharp" size={30} color="#2563eb" />
              <View className="w-3 h-3 bg-blue-600 rounded-full mt-1" />
            </View>
          </View>

          {/* back icon */}
          <TouchableOpacity
            onPress={() => router.back()}
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

          {/* ETA Bubble */}
          <View className="absolute left-4 bottom-4 bg-white px-4 py-2 rounded-xl shadow">
            <Text className="text-sm text-gray-500">Estimated Ready Time</Text>
            <Text className="font-bold text-[22px]">
              {status.etaMinutes ? `${status.etaMinutes} mins` : "--"}
            </Text>
          </View>
        </View>

        {/* Order Progress */}
        <View className="px-5 mt-6">
          <View className="flex-row items-center mb-3 justify-between">
            <Text className="font-bold text-[22px]">Order Progress</Text>
            <Text className="text-sm bg-red-100 rounded-full px-3 py-2 font-bold text-red-500 ml-2">
              In Progress
            </Text>
          </View>
          <View className="bg-white rounded-2xl p-4 shadow">
              {buildSteps(activeOrder)?.map((step, index) => {
              if (step.status === "done") {
                return (
                  <View key={step.key}>
                    <View className="flex-row">
                      <View className="items-center mr-3">
                        <View className="w-9 h-9 rounded-full bg-green-200 justify-center items-center">
                          <Ionicons
                            name={step.icon as any}
                            size={22}
                            color={"green"}
                          />
                        </View>
                        <View className="w-[2px] flex-1 bg-green-500 mt-1" />
                      </View>

                      <View>
                        <Text className="font-medium">{step.title}</Text>
                        <Text className="text-xs text-gray-500">
                          {/* {step.time} */}
                        </Text>
                      </View>
                    </View>
                    {step.title !== "Delivered" ? (
                      <View className="bg-green-200 h-[30px] w-[1px] ml-4 my-2 rounded-full" />
                    ) : null}
                  </View>
                );
              }

              if (step.status === "active") {
                return (
                  <View key={step.key} className="flex-row mb-6">
                    <View className="items-center mr-3">
                      <View className="w-9 h-9 rounded-full bg-blue-100 justify-center items-center">
                        <Ionicons
                          name={step.icon as any}
                          size={22}
                          color="#3B82F6"
                        />
                      </View>
                    </View>

                    <View>
                      <Text className="font-medium text-black">
                        {step.title}
                      </Text>
                      <Text className="text-xs text-black">In Progress</Text>
                      <Text className="text-xs text-blue-500 font-semibold">
                        {/* {step.subtitle} */}
                      </Text>
                    </View>
                  </View>
                );
              }

              return (
                <View key={step.key} className="flex-row mb-5 opacity-40">
                  <View className="items-center mr-3">
                    <View className="w-9 h-9 rounded-full bg-gray-300 justify-center items-center">
                      <Ionicons
                        name={step.icon as any}
                        size={20}
                        color="#000"
                      />
                    </View>
                  </View>
                  <Text className="font-medium">{step.title}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Driver Card */}
        <View className="bg-white rounded-2xl p-4 shadow mx-5 mb-5 mt-4">
          <View className="flex-row items-center mb-3">
              <Image
                source={driverImage ? { uri: driverImage } : require("@/assets/images/profile.png")}
                style={{ width: 40, height: 40, borderRadius: 25 }}
                resizeMode="cover"
              />
            <View className="flex-1 ml-2">
              <Text className="font-semibold text-base">
                {driverName}
              </Text>
              <View className="flex-row items-center mt-1">
                <RatingStars rating={driverImage || driverName !== 'Driver' ? 4.9 : 0} />
                <Text className="text-sm ml-1 text-gray-600">
                  {driverImage || driverName !== 'Driver' ? "Assigned driver" : "No driver yet"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(common)/DriverDetails" as any,
                  params: {
                    orderId: String(activeOrder?._id ?? ""),
                    name: driver?.name ?? "Driver",
                    image: driverImage,
                    rating: "4.9",
                    trips: "0",
                    vehicle: "Vehicle info unavailable",
                  },
                })
              }
            >
              <Text
                style={{ color: Colors.primary }}
                className="text-sm font-semibold text-right"
              >
                View Details
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(common)/ChatScreen" as any,
                  params: {
                    orderId: String(activeOrder?._id ?? ""),
                    name: driverName,
                    avatar: driverImage,
                  },
                })
              }
              className="flex-1 border bg-blue-100 border-blue-400 rounded-xl py-3 flex-row justify-center items-center mr-2"
            >
              <AntDesign name="message" size={18} color={Colors.primary} />
              <Text
                style={{ color: Colors.primary }}
                className="ml-2 font-semibold"
              >
                Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(common)/CallScreen" as any,
                  params: {
                    name: driverName,
                    image: driverImage,
                  },
                })
              }
              className="flex-1 border bg-blue-100 border-blue-400 rounded-xl py-3 flex-row justify-center items-center ml-2"
            >
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
              <Text
                style={{ color: Colors.primary }}
                className="ml-2 font-semibold"
              >
                Call Driver
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mx-5 mb-5">
          <Text className="font-bold text-[20px] mb-3">Order Details</Text>

            <View className="bg-white rounded-2xl p-4 shadow mb-8">
              <View className="mb-3">
                <Text className="text-gray-500 text-xs">Order ID</Text>
                <Text className="font-medium">#{formatOrderNumber(activeOrder?._id ?? "")}</Text>
              </View>

              <View className="mb-3">
                <Text className="text-gray-500 text-xs">Service</Text>
                <Text className="font-medium">{orderDetails.service}</Text>
              </View>

            <View className="mb-3">
              <Text className="text-gray-500 text-xs">Pickup Address</Text>
              <Text className="font-medium">{orderDetails.address.street}</Text>
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

        {activeOrder?.status === "OUT_FOR_DELIVERY" && (
          <View className="px-5 mb-5">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(common)/DeliveredSuccessScreen" as any,
                  params: {
                    orderId: String(activeOrder?._id ?? ""),
                    name: driver?.name ?? "Driver",
                    image: driver?.image ?? "",
                    service: orderDetails.service,
                    address: orderDetails.address.street,
                    bags: String(orderDetails.pricing.bags),
                    bagPrice: String(orderDetails.pricing.bagPrice),
                    tip: String(orderDetails.pricing.tip),
                  },
                })
              }
              className="bg-green-600 gap-2 rounded-xl py-3 flex-row justify-center items-center"
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text className="text-white text-lg font-semibold">
                Complete Delivery
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}
