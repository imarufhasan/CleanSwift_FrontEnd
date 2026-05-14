import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import CustomerCard from "@/components/driver/home/CustomerCard";
import type { Order } from "@/src/services/orderApi";

type Props = {
  order?: Order;
  isUpdating?: boolean;
  onCompletePickup: (bagCount: number) => Promise<void> | void;
};

export default function PickupStep({
  order,
  isUpdating,
  onCompletePickup,
}: Props) {
  const [bags, setBags] = useState(order?.bagCountAtPickup ?? order?.bags ?? 1);
  const customer = order?.customer;

  useEffect(() => {
    setBags(order?.bagCountAtPickup ?? order?.bags ?? 1);
  }, [order?.bagCountAtPickup, order?.bags]);

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

      <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <Text className="font-bold text-2xl mb-1">Confirm Bag Count</Text>
        <Text className="text-sm text-gray-500 mb-4">
          Expected {order?.bags ?? 0} bags. Update it if pickup count differs.
        </Text>

        <View className="flex-row justify-center items-center">
          <TouchableOpacity
            onPress={() => bags > 0 && setBags(bags - 1)}
            className="w-[45px] h-[45px] bg-gray-200 rounded-full justify-center items-center"
          >
            <FontAwesome6 name="minus" size={16} color="black" />
          </TouchableOpacity>

          <View className="mx-6 items-center">
            <Text className="text-3xl font-bold">{bags}</Text>
            <Text className="text-sm text-gray-400">bags</Text>
          </View>

          <TouchableOpacity
            onPress={() => setBags(bags + 1)}
            style={{ backgroundColor: Colors.primary }}
            className="w-[45px] h-[45px] rounded-full justify-center items-center"
          >
            <FontAwesome6 name="add" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="pb-6 mt-[50px]">
        <TouchableOpacity
          onPress={() => onCompletePickup(bags)}
          disabled={isUpdating}
          style={{ backgroundColor: Colors.primary }}
          className="py-4 rounded-xl flex-row justify-center items-center"
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color="white" />
              <Text className="text-white font-semibold ml-2">
                Confirm Pickup Complete
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
