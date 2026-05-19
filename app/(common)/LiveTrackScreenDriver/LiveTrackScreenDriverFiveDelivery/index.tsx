import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetMyDriverJobsQuery } from "@/src/services/driverApi";
import type { Order } from "@/src/services/orderApi";
import { formatOrderNumber } from "@/src/utils/orderNumber";

const getEffectiveBagCount = (order?: Order) =>
  Math.max(
    0,
    order?.bagCountAtDelivery ?? order?.bagCountAtPickup ?? order?.bags ?? 0,
  );

const getOrderDriverEarningPercentage = (
  order?: Pick<Order, "driverEarningPercentage">,
) => Number(order?.driverEarningPercentage ?? 70);

type Props = {
  order?: Order;
  readOnly?: boolean;
  onStartOutForDelivery: () => Promise<boolean | void> | boolean | void;
};

export default function DeliveryStep({
  order,
  readOnly = false,
  onStartOutForDelivery,
}: Props) {
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(
    order?.status === "OUT_FOR_DELIVERY",
  );
  const { data: myJobsRes } = useGetMyDriverJobsQuery();
  const activeJob =
    order ??
    (myJobsRes && myJobsRes.data
      ? myJobsRes.data.find(
          (order) =>
            !["DELIVERED", "COMPLETED", "CANCELED"].includes(order.status),
        )
      : undefined);
  const driverEarningPercentage = getOrderDriverEarningPercentage(activeJob);
  const isCompleted = readOnly || activeJob?.status === "COMPLETED";
  const canStartOutForDelivery = activeJob?.status === "FOLDING";
  const isButtonWaiting =
    !isCompleted &&
    (isWaitingForConfirmation || activeJob?.status === "OUT_FOR_DELIVERY");

  useEffect(() => {
    setIsWaitingForConfirmation(
      order?.status === "OUT_FOR_DELIVERY" ||
        activeJob?.status === "OUT_FOR_DELIVERY",
    );
  }, [activeJob?.status, order?.status]);

  const customer = activeJob ? activeJob.customer : null;
  const status = {
    label:
      activeJob && activeJob.status
        ? activeJob.status.replaceAll("_", " ")
        : "No active job",
    etaMinutes: activeJob && activeJob.scheduledPickupAt ? 6 : 0,
  };
  const orderDetails = {
    service:
      activeJob && activeJob.serviceType
        ? activeJob.serviceType.replaceAll("_", " ")
        : "Unavailable",
    address: {
      street:
        activeJob && activeJob.address
          ? activeJob.address
          : "No address available",
      city: "",
    },
    instructions:
      activeJob && activeJob.specialInstructions
        ? activeJob.specialInstructions
        : "No special instructions",
    pricing: {
      bags: getEffectiveBagCount(activeJob),
      bagPrice:
        activeJob && activeJob.pricePerBag !== undefined
          ? activeJob.pricePerBag
          : 0,
      tip: 0,
    },
  };

  const total =
    orderDetails.pricing.bags * orderDetails.pricing.bagPrice +
    orderDetails.pricing.tip;

  return (
    <ScrollView className="flex-1 bg-[#F6F9FF]">
      <SafeAreaView edges={["bottom"]} className="flex-1">
        {/* Status Header Banner (replaces map) */}
        <View
          style={{ backgroundColor: Colors.primary }}
          className="px-5 pt-6 pb-8"
        >
          {/* Status Badge */}
          <View className="flex-row items-center justify-center mb-4">
            <View className="bg-white/20 px-4 py-1.5 rounded-full flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full bg-white" />
              <Text className="text-white font-semibold text-sm tracking-wide">
                {status.label}
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white/15 rounded-2xl p-3 items-center">
              <Ionicons name="bag-outline" size={22} color="#fff" />
              <Text className="text-white/70 text-xs mt-1">Bags</Text>
              <Text className="text-white font-bold text-lg">
                {orderDetails.pricing.bags}
              </Text>
            </View>
            <View className="flex-1 bg-white/15 rounded-2xl p-3 items-center">
              <Ionicons name="time-outline" size={22} color="#fff" />
              <Text className="text-white/70 text-xs mt-1">ETA</Text>
              <Text className="text-white font-bold text-lg">
                {status.etaMinutes ? `${status.etaMinutes} min` : "--"}
              </Text>
            </View>
            <View className="flex-1 bg-white/15 rounded-2xl p-3 items-center">
              <Ionicons name="cash-outline" size={22} color="#fff" />
              <Text className="text-white/70 text-xs mt-1">Earnings</Text>
              <Text className="text-white font-bold text-lg">
                ${Number((total * driverEarningPercentage) / 100).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content Card */}
        <View className="px-4 -mt-4">
          <View className="bg-white rounded-3xl shadow-md overflow-hidden mb-4">
            {/* Customer Info */}
            <View className="px-4 pt-5 pb-4 flex-row items-center border-b border-gray-100">
              <Image
                source={
                  customer && customer.image
                    ? { uri: customer.image }
                    : require("@/assets/images/profile.png")
                }
                className="w-[56px] h-[56px] rounded-full border-2 border-gray-100"
              />
              <View className="ml-3 flex-1">
                <Text className="text-xs text-gray-400 mb-0.5">
                  Delivering to
                </Text>
                <Text className="text-xl font-bold text-gray-900">
                  {customer && customer.name ? customer.name : "Customer"}
                </Text>
                <Text className="text-xs text-gray-400">
                  Order #
                  {formatOrderNumber(activeJob ? activeJob._id : undefined)}
                </Text>
              </View>
              <View
                className={`px-3 py-1.5 rounded-full ${isCompleted ? "bg-green-50" : "bg-blue-50"}`}
              >
                <Text
                  className={`text-xs font-semibold ${isCompleted ? "text-green-600" : "text-blue-600"}`}
                >
                  {isCompleted ? "Completed" : "Active"}
                </Text>
              </View>
            </View>

            {/* Address */}
            <View className="px-4 py-4 border-b border-gray-100">
              <View className="flex-row items-start gap-3">
                <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center mt-0.5">
                  <Ionicons name="location-outline" size={18} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400 mb-0.5">
                    Delivery Address
                  </Text>
                  <Text className="font-semibold text-gray-900 text-base leading-snug">
                    {orderDetails.address.street}
                  </Text>
                  {orderDetails.address.city ? (
                    <Text className="text-xs text-gray-400 mt-0.5">
                      {orderDetails.address.city}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>

            {/* Service & Instructions */}
            <View className="px-4 py-4">
              <View className="flex-row items-start gap-3">
                <View className="w-9 h-9 rounded-full bg-orange-50 items-center justify-center mt-0.5">
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color="#F97316"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400 mb-0.5">
                    Service Type
                  </Text>
                  <Text className="font-semibold text-gray-900 text-base">
                    {orderDetails.service}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {orderDetails.instructions}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Summary Row */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-blue-50 rounded-2xl p-4">
              <Text className="text-gray-500 text-xs font-medium mb-1">
                Expected Bags
              </Text>
              <Text className="font-bold text-2xl text-gray-900">
                {orderDetails.pricing.bags}
              </Text>
            </View>
            <View className="flex-1 bg-green-50 rounded-2xl p-4">
              <Text className="text-gray-500 text-xs font-medium mb-1">
                Your Earnings
              </Text>
              <Text className="font-bold text-2xl text-green-600">
                ${Number((total * driverEarningPercentage) / 100).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Out for Delivery Button */}
        <View className="px-5 mb-6">
          <TouchableOpacity
            onPress={async () => {
              if (readOnly) return;
              if (!canStartOutForDelivery) return;
              const result = await onStartOutForDelivery();
              if (result !== false) {
                setIsWaitingForConfirmation(true);
              }
            }}
            disabled={isCompleted || !canStartOutForDelivery || isButtonWaiting}
            style={{
              backgroundColor: isCompleted
                ? "#16A34A"
                : isButtonWaiting
                  ? "gray"
                  : Colors.primary,
            }}
            className="gap-2 rounded-2xl py-4 flex-row justify-center items-center"
          >
            <Ionicons
              name={isCompleted ? "checkmark-circle-outline" : "car-outline"}
              size={20}
              color="#fff"
            />
            <Text className="text-white text-base font-bold">
              {isCompleted
                ? "Payment Confirmed"
                : isButtonWaiting
                  ? "Waiting for Customer Confirmation"
                  : "Out for Delivery"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
