import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import RatingStars from "@/components/home/RatingStars";
import Colors from "@/constants/color";
import { useGetMyDriverJobsQuery } from "@/src/services/driverApi";
import { formatOrderNumber } from "@/src/utils/orderNumber";

const getEffectiveBagCount = (order: {
  bagCountAtDelivery?: number;
  bagCountAtPickup?: number;
  bags?: number;
}) =>
  Math.max(
    0,
    order.bagCountAtDelivery ?? order.bagCountAtPickup ?? order.bags ?? 0,
  );

const getEffectiveOrderTotal = (order: {
  pricePerBag?: number;
  bagCountAtDelivery?: number;
  bagCountAtPickup?: number;
  bags?: number;
  total?: number;
}) =>
  getEffectiveBagCount(order) * Number(order.pricePerBag ?? order.total ?? 0);

const getOrderDriverEarningPercentage = (order: {
  driverEarningPercentage?: number;
}) => Number(order.driverEarningPercentage ?? 70);

const getDriverEarning = (order: {
  pricePerBag?: number;
  bagCountAtDelivery?: number;
  bagCountAtPickup?: number;
  bags?: number;
  total?: number;
  driverEarningPercentage?: number;
}) =>
  (getEffectiveOrderTotal(order) * getOrderDriverEarningPercentage(order)) /
  100;

export default function Index() {
  const router = useRouter();

  const { data: jobsRes } = useGetMyDriverJobsQuery();

  const completedJobs = useMemo(() => {
    return (jobsRes?.data || []).filter((job: any) =>
      ["DELIVERED", "COMPLETED"].includes(job.status),
    );
  }, [jobsRes]);

  const recentOrders = useMemo(() => {
    return completedJobs.map((order: any) => ({
      id: order._id,
      quantity: getEffectiveBagCount(order),
      total: getEffectiveOrderTotal(order),
      earning: getDriverEarning(order),
      rating: 5,
      status: order.status.replaceAll("_", " "),
      date: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString()
        : "",
    }));
  }, [completedJobs]);

  const todayEarning = useMemo(() => {
    return completedJobs
      .filter(
        (job: any) =>
          job.createdAt &&
          new Date(job.createdAt).toDateString() === new Date().toDateString(),
      )
      .reduce((sum: number, job: any) => sum + getDriverEarning(job), 0);
  }, [completedJobs]);

  const totalEarning = useMemo(() => {
    return completedJobs.reduce(
      (sum: number, job: any) => sum + getDriverEarning(job),
      0,
    );
  }, [completedJobs]);

  const renderHeader = () => (
    <>
      {/* Header */}
      <View className="flex-row items-center justify-between py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-100 p-3 rounded-full"
        >
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-black">My Earnings</Text>

        <View className="w-12" />
      </View>

      {/* Summary Cards */}
      <View className="flex-row gap-4 mt-4 mb-6">
        {/* Today */}
        <View
          className="flex-1 rounded-3xl p-5"
          style={{
            backgroundColor: "#E8FFF1",
          }}
        >
          <View className="flex-row items-center justify-between">
            <View
              className="p-2 rounded-xl"
              style={{ backgroundColor: "#C6F6D5" }}
            >
              <Feather name="trending-up" size={20} color="green" />
            </View>

            <Text className="text-xs text-green-700 font-medium">TODAY</Text>
          </View>

          <Text className="text-3xl font-bold text-green-700 mt-5">
            ${todayEarning.toFixed(2)}
          </Text>

          <Text className="text-green-600 mt-1 text-sm">Today's income</Text>
        </View>

        {/* Total */}
        <View
          className="flex-1 rounded-3xl p-5"
          style={{
            backgroundColor: "#EEF4FF",
          }}
        >
          <View className="flex-row items-center justify-between">
            <View
              className="p-2 rounded-xl"
              style={{ backgroundColor: "#D9E8FF" }}
            >
              <AntDesign name="wallet" size={20} color="#2563EB" />
            </View>

            <Text className="text-xs text-blue-700 font-medium">TOTAL</Text>
          </View>

          <Text className="text-3xl font-bold text-blue-700 mt-5">
            ${totalEarning.toFixed(2)}
          </Text>

          <Text className="text-blue-600 mt-1 text-sm">Overall earnings</Text>
        </View>
      </View>

      {/* Section Title */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: "#EAF6FF" }}
          >
            <AntDesign name="dollar" size={20} color={Colors.primary} />
          </View>

          <Text
            style={{ color: Colors.primary }}
            className="ml-3 text-xl font-bold"
          >
            Earnings History
          </Text>
        </View>

        <Text className="text-gray-400 text-sm">
          {recentOrders.length} Orders
        </Text>
      </View>
    </>
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        // router.push({
        //   pathname: "/(common)/OrderDetailsDriver" as any,
        //   params: { id: item.id },
        // });
        router.push({
          pathname: "/(common)/OrderDetails",
          params: { id: String(item.id) },
        });
      }}
      className="bg-white rounded-3xl p-5 mb-4 border border-gray-100"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }}
    >
      {/* Top */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center">
            <View
              className="w-12 h-12 rounded-2xl items-center justify-center"
              style={{ backgroundColor: "#F1F7FF" }}
            >
              <Ionicons name="cube-outline" size={22} color={Colors.primary} />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-black font-bold text-base">
                Order #{formatOrderNumber(item.id)}
              </Text>

              <Text className="text-gray-500 text-sm mt-1">
                {item.quantity} bags
              </Text>
            </View>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-2xl font-bold text-green-600">
            ${item.earning.toFixed(2)}
          </Text>

          <Text className="text-xs text-gray-400 mt-1">Driver earning</Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-gray-100 my-4" />

      {/* Bottom */}
      <View className="flex-row items-center justify-between">
        <View>
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={16} color="green" />

            <Text className="text-green-600 ml-1 text-sm font-medium">
              {item.status}
            </Text>
          </View>

          <Text className="text-gray-400 text-xs mt-1">{item.date}</Text>
        </View>

        <View className="items-end">
          <View className="flex-row items-center">
            <RatingStars rating={item.rating} />

            <Text className="ml-1 text-sm font-semibold">
              {item.rating.toFixed(1)}
            </Text>
          </View>

          <Text
            style={{ color: Colors.primary }}
            className="font-semibold text-sm mt-2"
          >
            View Details
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] px-5">
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={recentOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View className="items-center justify-center mt-32">
            <Ionicons name="wallet-outline" size={70} color="#D1D5DB" />

            <Text className="text-xl font-bold text-gray-500 mt-4">
              No Earnings Yet
            </Text>

            <Text className="text-gray-400 text-center mt-2 px-10">
              Your completed orders and earnings will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
