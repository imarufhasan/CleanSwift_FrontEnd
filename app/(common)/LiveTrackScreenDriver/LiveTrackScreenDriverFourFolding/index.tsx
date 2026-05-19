import React from "react";
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import { AntDesign, Entypo, FontAwesome6 } from "@expo/vector-icons";
import CustomerCard from "@/components/driver/home/CustomerCard";
import Colors from "@/constants/color";
import type { Order } from "@/src/services/orderApi";

type Props = {
  order?: Order;
  isUpdating?: boolean;
  readOnly?: boolean;
  onStartDelivery: () => Promise<boolean | void> | boolean | void;
};

const formatDateTime = (value?: string) => {
  if (!value) return "--";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function FoldingStep({
  order,
  isUpdating,
  readOnly = false,
  onStartDelivery,
}: Props) {
  const customer = order ? order.customer : undefined;

  return (
    <View className="bg-white mb-6 px-4">
      <CustomerCard
        orderId={order ? order._id : undefined}
        name={customer && customer.name ? customer.name : "Customer"}
        address={
          order && order.address
            ? order.address
            : customer && customer.address
              ? customer.address
              : "Pickup address unavailable"
        }
        image={customer ? customer.image : undefined}
        instructionSubtitle={
          order && order.serviceType
            ? order.serviceType.replaceAll("_", " ")
            : "Service"
        }
        instructionDescription={
          order && order.specialInstructions
            ? order.specialInstructions
            : "No special instructions"
        }
      />

      <View className="bg-green-100 rounded-2xl px-4 py-6 my-4 w-full items-center justify-center">
        <View className="mb-4">
          <Entypo name="check" size={22} color="green" />
        </View>
        <Text className="font-bold text-2xl text-black">
          Folding & Packaging
        </Text>
        <Text className="text-base text-gray-500">
          {order ? order.bagCountAtPickup ?? order.bags ?? 0 : 0} bags almost ready for delivery
        </Text>
      </View>

      <View className="bg-white rounded-2xl p-4 shadow-lg mb-4">
        <Text className="font-bold text-black text-lg mb-4">
          Quality Checklist
        </Text>

        {[
          "All items washed",
          "All items dried",
          "Bag count matched",
          "Ready for delivery handoff",
        ].map(item => (
          <View key={item} className="bg-green-50 rounded-2xl px-2 py-2 w-full mb-2">
            <View className="flex-row gap-3 my-2">
              <AntDesign name="check-circle" size={18} color="green" />
              <Text className="font-semibold text-black text-sm">{item}</Text>
            </View>
          </View>
        ))}

        <View className="bg-blue-50 rounded-2xl p-4 mt-2">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-gray-500 font-medium">Drying Started</Text>
            <Text className="text-sm text-black font-semibold">
              {formatDateTime(order && order.timeline ? order.timeline.dryingAt : undefined)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-500 font-medium">Status</Text>
            <Text className="text-sm text-blue-500 font-medium">
              {order && order.status ? order.status.replaceAll("_", " ") : "Waiting"}
            </Text>
          </View>
        </View>
      </View>

      <View className="pb-6 mt-[50px]">
        <TouchableOpacity
          onPress={onStartDelivery}
          disabled={isUpdating || readOnly}
          style={{ backgroundColor: readOnly ? "gray" : Colors.primary }}
          className="py-4 rounded-xl flex-row justify-center items-center gap-3"
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-white font-semibold ml-2">
                {readOnly ? "Order Completed" : "Start Folding"}
              </Text>
              <FontAwesome6 name="arrow-right-long" size={18} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
