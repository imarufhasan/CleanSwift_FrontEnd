import React from "react";
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import CircularProgress from "@/components/driver/home/CircularProgress";
import CustomerCard from "@/components/driver/home/CustomerCard";
import Colors from "@/constants/color";
import type { Order } from "@/src/services/orderApi";

type Props = {
  order?: Order;
  isUpdating?: boolean;
  onStartDrying: () => Promise<void> | void;
};

const formatDateTime = (value?: string) => {
  if (!value) return "--";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function DryingStep({
  order,
  isUpdating,
  onStartDrying,
}: Props) {
  const customer = order?.customer;

  return (
    <View className="bg-white mb-6 px-4">
      <CustomerCard
        orderId={order?._id}
        name={customer?.name ?? "Customer"}
        address={order?.address ?? customer?.address ?? "Pickup address unavailable"}
        image={customer?.image}
        instructionSubtitle={order?.serviceType?.replaceAll("_", " ") ?? "Service"}
        instructionDescription={order?.specialInstructions ?? "No special instructions"}
      />

      <View className="bg-purple-100 rounded-2xl p-4 my-4 w-full items-center justify-center">
        <CircularProgress />
        <Text className="font-bold text-2xl text-black mt-3">
          Drying in Progress
        </Text>
        <Text className="text-base text-gray-500">
          {order?.bagCountAtPickup ?? order?.bags ?? 0} bags are being dried
        </Text>
      </View>

      <View className="bg-white rounded-2xl border-gray-100 border-[1px] p-4 mt-4 w-[100%]">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-500 font-medium">Status</Text>
          <Text className="text-sm text-blue-500 font-medium">
            {order?.status?.replaceAll("_", " ") ?? "Waiting"}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-500 font-medium">Washing Started</Text>
          <Text className="text-sm text-black font-semibold">
            {formatDateTime(order?.timeline?.washingDryingAt)}
          </Text>
        </View>
      </View>

      <View className="pb-6 mt-[50px]">
        <TouchableOpacity
          onPress={onStartDrying}
          disabled={isUpdating}
          style={{ backgroundColor: Colors.primary }}
          className="py-4 rounded-xl flex-row justify-center items-center gap-3"
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-white font-semibold ml-2">
                Mark as Now Drying
              </Text>
              <FontAwesome6 name="arrow-right-long" size={18} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
