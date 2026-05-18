import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useLocalSearchParams, useRouter } from "expo-router";
import RatingStars from "@/components/home/RatingStars";
import { useGetMyOrdersQuery, type Order } from "@/src/services/orderApi";
import { useOrderSocket } from "@/src/hooks/useOrderSocket";
import { formatOrderNumber } from "@/src/utils/orderNumber";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const statusLabel = (status?: string) => (status ?? "").replaceAll("_", " ");

const serviceLabel: Record<string, string> = {
  WASH_DRY: "Washing & Drying",
  DRY_CLEAN: "Dry Cleaning",
};

const getEffectiveBagCount = (order?: Order) =>
  Math.max(0, order?.bagCountAtDelivery ?? order?.bagCountAtPickup ?? order?.bags ?? 0);

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

  return [
    { key: "requested", title: "Requested", icon: "clockcircleo" },
    { key: "driver", title: "Driver Assigned", icon: "user" },
    { key: "picked", title: "Picked Up", icon: "checkcircleo" },
    { key: "washing", title: "Washing", icon: "sync" },
    { key: "drying", title: "Drying", icon: "cloud" },
    { key: "folding", title: "Folding", icon: "inbox" },
    { key: "delivery", title: "Out for Delivery", icon: "car" },
    { key: "delivered", title: "Delivered", icon: "home" },
  ].map((step, index) => ({
    ...step,
    status: index < current ? "done" : index === current ? "active" : "pending",
    time: index < current ? "Completed" : "",
    subtitle: index === current ? "In Progress" : "",
  }));
};

const toActiveOrder = (order?: Order) => {
  const bags = Math.max(
    0,
    order?.bagCountAtDelivery ?? order?.bagCountAtPickup ?? order?.bags ?? 0,
  );

  return {
    id: order ? order._id : "-",
    status: order ? statusLabel(order.status) : "No active order",
    quantity: bags,
    bagPrice: order ? (order.pricePerBag ?? 0) : 0,
    tip: 0,
    estimatedDelivery: order
      ? order.scheduledPickupAt
        ? new Date(order.scheduledPickupAt).toLocaleString()
        : "As soon as possible"
      : "--",
    progressSteps: order ? buildSteps(order) : [],
  };
};

export default function OrderTrackingForCustomer() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const router = useRouter();
  const { data: ordersRes, isLoading, refetch } = useGetMyOrdersQuery();

  const orders = ordersRes && ordersRes.data ? ordersRes.data : [];
  const activeOrderFromApi = orderId
    ? orders.find((o) => o._id === orderId)
    : orders.find(
        (order) =>
          !["DELIVERED", "COMPLETED", "CANCELED"].includes(order.status),
      );

  useOrderSocket({
    role: "CUSTOMER",
    orderId: activeOrderFromApi?._id,
    onCustomerUpdate: refetch,
  });

  const activeOrder = toActiveOrder(activeOrderFromApi);
  const pastOrders = orders
    .filter((order) => ["DELIVERED", "COMPLETED"].includes(order.status))
    .map((order) => ({
      id: order._id,
      quantity: order.bags,
      price: order.total,
      status: statusLabel(order.status),
      rating: 5,
      date: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString()
        : "",
    }));

  const totalAmount =
    activeOrder.quantity * activeOrder.bagPrice + activeOrder.tip;

  const activeChatOrder = activeOrderFromApi;
  const driver = activeChatOrder ? activeChatOrder.driver : null;
  const orderDetails = activeChatOrder ?? null;
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className="flex-1 bg-[#F6F9FF]"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 30,
      }}
    >
      <View
        style={{ backgroundColor: Colors.primary }}
        className="pt-14 pb-16 px-5 rounded-b-[32px]"
      >
        {/* Top Row */}
        <View className="flex-row items-center mb-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-300 justify-center items-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>

          <Text className="text-white text-[20px] font-bold ml-3">
            Order Tracking
          </Text>
        </View>

        <Text className="text-white/80">Track your laundry in real-time</Text>
      </View>

      {/* Active Order Card */}
      <View className="px-5 -mt-10">
        <View className="bg-white rounded-2xl p-4 shadow">
          <View className="flex-row justify-between items-center mb-2">
            <View>
              <Text className="font-semibold">
                Order #{formatOrderNumber(activeOrder.id)}
              </Text>
              <Text className="text-gray-500 text-sm">
                {activeOrder.quantity} bags • $
                {activeOrder.quantity * activeOrder.bagPrice}
              </Text>
            </View>

            <View className="bg-orange-100 px-3 py-1 rounded-full">
              <Text className="text-orange-500 text-xs font-semibold">
                {activeOrder.status}
              </Text>
            </View>
          </View>

          <View className="bg-blue-50 rounded-xl p-3 mt-3">
            <Text className="text-xs text-gray-500">Estimated Delivery</Text>
            <Text className="font-semibold mt-1">
              {activeOrder.estimatedDelivery}
            </Text>
          </View>
        </View>
      </View>

      {/* Order Progress */}
      <View className="px-5 mt-6">
            <Text className="font-bold text-lg mb-4">Order Progress</Text>

        <View className="bg-white rounded-2xl p-4 shadow">
          {activeOrder.progressSteps.map((step, index) => {
            if (step.status === "done") {
              return (
                <View key={step.key}>
                  <View className="flex-row">
                    <View className="items-center mr-3">
                      <View className="w-9 h-9 rounded-full bg-green-200 justify-center items-center">
                        {step.title === "Delivered" ? (
                          <Ionicons
                            name="home-outline"
                            size={22}
                            color={"green"}
                          />
                        ) : (
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={22}
                            color={"green"}
                          />
                        )}
                      </View>
                      <View className="w-[2px] flex-1 bg-green-500 mt-1" />
                    </View>

                    <View>
                      <Text className="font-medium">{step.title}</Text>
                      <Text className="text-xs text-gray-500">{step.time}</Text>
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
                <View key={step.key}>
                  <View className="flex-row">
                    <View className="items-center mr-3">
                      {/* loader icon */}
                      <View className="w-9 h-9 rounded-full bg-blue-100 justify-center items-center">
                        <Ionicons
                          name="refresh-outline"
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
                        {step.subtitle}
                      </Text>
                    </View>
                  </View>
                  {step.title !== "Delivered" ? (
                    <View className="bg-blue-300 h-[30px] w-[1px] ml-4 my-2 rounded-full" />
                  ) : null}
                </View>
              );
            }

            return (
              <View key={step.key}>
                <View className="flex-row">
                  <View className="flex-row opacity-40">
                    <View className="items-center mr-3">
                      <View className="w-9 h-9 rounded-full bg-gray-300 justify-center items-center">
                        <AntDesign
                          name={step.icon as any}
                          size={16}
                          color="#000"
                        />
                      </View>
                    </View>
                    <Text className="font-medium">{step.title}</Text>
                  </View>
                </View>
                {step.title !== "Delivered" ? (
                  <View className="bg-gray-300 h-[30px] w-[1px] ml-4 my-2 rounded-full" />
                ) : null}
              </View>
            );
          })}
        </View>
      </View>

      {/* Driver Card */}
      <View className="px-5 mt-6 mb-6">
        <View className="bg-white rounded-2xl p-4 shadow">
          <View className="flex-row items-center mb-4">
            <Image
              source={
                driver && driver.image
                  ? { uri: driver.image }
                  : require("@/assets/images/profile.png")
              }
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="font-semibold">
                {driver && driver.name ? driver.name : "Driver not assigned"}
              </Text>
              <View className="flex-row items-center mt-1">
                <RatingStars rating={driver ? 4.9 : 0} size={14} />
                <Text className="text-sm ml-1 text-gray-600">
                  {driver ? "Assigned driver" : "No driver yet"}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row">
            <TouchableOpacity
              onPress={() =>
                activeChatOrder && activeChatOrder.driver
                  ? router.push({
                      pathname: "/(common)/ChatScreen" as any,
                      params: {
                        orderId: activeChatOrder._id,
                        name:
                          activeChatOrder.driver && activeChatOrder.driver.name
                            ? activeChatOrder.driver.name
                            : activeChatOrder.customer &&
                                activeChatOrder.customer.name
                              ? activeChatOrder.customer.name
                              : "Chat",
                        avatar:
                          activeChatOrder.driver && activeChatOrder.driver.image
                            ? activeChatOrder.driver.image
                            : activeChatOrder.customer &&
                                activeChatOrder.customer.image
                              ? activeChatOrder.customer.image
                              : "",
                      },
                    })
                  : router.push("/(common)/MessagesScreen")
              }
              className="flex-1 border bg-blue-100 border-blue-500 rounded-xl py-3 flex-row justify-center items-center mr-2"
            >
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={Colors.primary}
              />
              <Text className="ml-2 text-lg text-blue-500 font-semibold">
                Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(common)/CallScreen" as any,
                  params: {
                    name: driver && driver.name ? driver.name : "Driver",
                    image: driver && driver.image ? driver.image : "",
                  },
                })
              }
              className="flex-1 border bg-blue-100 border-blue-500 rounded-xl py-3 flex-row justify-center items-center ml-2"
            >
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
              <Text className="ml-2 text-lg text-blue-500 font-semibold">
                Call Driver
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Order Details */}
      <View className="px-5 mb-6">
        <Text className="font-bold text-[20px] mb-3">Order Details</Text>

        <View className="bg-white rounded-2xl p-4 shadow">
          {!orderDetails && (
            <Text className="mb-3 text-sm text-gray-500">No active order</Text>
          )}
          <View className="mb-3">
            <Text className="text-gray-500 text-xs">Service</Text>
            <Text className="font-medium">
              {activeOrderFromApi && activeOrderFromApi.serviceType
                ? (serviceLabel[activeOrderFromApi.serviceType] ??
                  activeOrderFromApi.serviceType)
                : "Unavailable"}
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-500 text-xs">Pickup Address</Text>
            <Text className="font-medium">
              {activeOrderFromApi && activeOrderFromApi.address
                ? activeOrderFromApi.address
                : "No address available"}
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-500 text-xs">Special Instructions</Text>
            <Text className="font-medium">
              {activeOrderFromApi && activeOrderFromApi.specialInstructions
                ? activeOrderFromApi.specialInstructions
                : "No special instructions"}
            </Text>
          </View>

          <View className="border-t border-gray-200 pt-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">
                {getEffectiveBagCount(activeOrderFromApi)} bags × $
                {activeOrderFromApi ? (activeOrderFromApi.pricePerBag ?? 0) : 0}
              </Text>
              <Text>
                $
                {Number(
                  getEffectiveBagCount(activeOrderFromApi) *
                    (activeOrderFromApi ? (activeOrderFromApi.pricePerBag ?? 0) : 0),
                ).toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Tip</Text>
              <Text>${activeOrder.tip}</Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold text-blue-600">
                $
                {Number(
                  activeOrderFromApi ? (activeOrderFromApi.total ?? 0) : 0,
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Past Orders */}
      <View className="px-5 mb-6">
        <Text className="text-lg font-bold mb-3">Past Orders</Text>

        {isLoading && (
          <Text className="text-gray-500 mb-3">Loading orders...</Text>
        )}

        {pastOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            className="bg-white rounded-2xl p-4 mb-2 border border-gray-100 flex-row"
            onPress={() =>
              router.push({
                pathname: "/(common)/OrderDetails",
                params: { id: String(order.id) },
              })
            }
          >
            <View className="w-9 h-9 rounded-full bg-gray-200 justify-center items-center">
              <Ionicons name="cube-outline" size={20} />
            </View>

            <View className="flex-1 ml-3">
              <Text className="font-semibold">
                Order #{formatOrderNumber(order.id)}
              </Text>
              <Text className="text-sm text-gray-500">
                {order.quantity} bag • Estimate cost ${order.price}
              </Text>

              <View className="flex-row items-center mt-1">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={14}
                  color="green"
                />
                <Text className="ml-1 text-green-600 text-sm">
                  {order.status}
                </Text>
              </View>
            </View>

            <View className="items-end justify-between">
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#FACC15" />
                <Text className="ml-1 text-sm">{order.rating.toFixed(1)}</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  console.log("recet_item: ", order);
                  router.push({
                    pathname: "/(common)/OrderDetails",
                    params: { id: String(order.id) },
                  });
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
    </ScrollView>
  );
}
