import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useGetMyOrdersQuery, type Order } from "@/src/services/orderApi";
import { useOrderSocket } from "@/src/hooks/useOrderSocket";
import ActiveOrderCard from "@/components/home/components/ActiveOrderCard";
import { AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useFocusEffect } from "expo-router";
import ShowMessage from "@/constants/toast";
import { RefreshControl } from "react-native";
import { useDispatch } from "react-redux";
import { orderApi } from "@/src/services/orderApi";

const getOrderProgress = (order: Order) => {
  const steps = [
    "Requested",
    "Picked Up",
    "Washing",
    "Drying",
    "Folding",
    "Delivery",
  ];
  const currentStep =
    order.status === "OUT_FOR_DELIVERY" ||
    order.status === "DELIVERED" ||
    order.status === "COMPLETED"
      ? 5
      : order.timeline?.foldingAt
        ? 4
        : order.timeline?.dryingAt
          ? 3
          : order.status === "WASHING_DRYING"
            ? 2
            : order.status === "PICKED_UP"
              ? 1
              : 0;

  return {
    steps,
    currentStep,
    progress: Math.min(100, Math.max(15, Math.round(((currentStep + 1) / steps.length) * 100))),
  };
};

const mapOrderToCard = (order: Order) => {
  const progress = getOrderProgress(order);

  return {
    id: order._id,
    status: order.status.replaceAll("_", " "),
    quantity: order.bags,
    price: order.total,
    estimatedDelivery: order.scheduledPickupAt
      ? new Date(order.scheduledPickupAt).toLocaleString()
      : "As soon as possible",
    ...progress,
  };
};

export default function Orders() {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const VISIBLE_LIMIT = 5;
  const [showAllOrders, setShowAllOrders] = useState(false);

  const {
    data: ordersRes,
    isLoading,
    isFetching,
    refetch: refetchOrders,
  } = useGetMyOrdersQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const orders = ordersRes?.data ?? [];

  const activeOrders = orders.filter(
    (order) => !["DELIVERED", "COMPLETED", "CANCELED"].includes(order.status),
  );

  const activeOrder = activeOrders[0] ? mapOrderToCard(activeOrders[0]) : null;

  const activeOrdersMapped = activeOrders.map(mapOrderToCard);

  const visibleOrders = showAllOrders
    ? activeOrdersMapped
    : activeOrdersMapped.slice(0, VISIBLE_LIMIT);

  const hiddenCount = activeOrdersMapped.length - VISIBLE_LIMIT;

  useOrderSocket({
    role: "CUSTOMER",
    orderId: activeOrder?.id,
    onCustomerUpdate: refetchOrders,
  });


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchOrders();
      ShowMessage.show("Updated");
    } finally {
      setRefreshing(false);
    }
  }, [refetchOrders]);

  useFocusEffect(
    useCallback(() => {
      refetchOrders();
    }, [refetchOrders]),
  );

  const renderFooter = () => {
    if (activeOrdersMapped.length <= VISIBLE_LIMIT) return null;

    return (
      <TouchableOpacity
        onPress={() => setShowAllOrders((prev) => !prev)}
        className="flex-row items-center justify-center gap-2 mt-3 mb-5 py-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50"
        activeOpacity={0.7}
      >
        <AntDesign
          name={showAllOrders ? "up" : "down"}
          size={14}
          color={Colors.primary}
        />

        <Text style={{ color: Colors.primary }} className="text-sm font-medium">
          {showAllOrders
            ? "Show less"
            : `View ${hiddenCount} more order${hiddenCount !== 1 ? "s" : ""}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#F6F9FF]">
      <FlatList
        data={visibleOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-2xl font-bold text-black">Active Orders</Text>

            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-blue-600 text-xs font-semibold">
                {activeOrdersMapped.length} Active
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => <ActiveOrderCard data={item} />}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? (
            <View className="bg-white rounded-2xl p-5">
              <Text className="text-gray-500">Loading orders...</Text>
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-5 items-center">
              <Text className="text-gray-500">No active orders</Text>
            </View>
          )
        }
      />
    </View>
  );
}
