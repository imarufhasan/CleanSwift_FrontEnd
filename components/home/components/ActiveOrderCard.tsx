// home/components/ActiveOrderCard.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";
import { formatOrderNumber } from "@/src/utils/orderNumber";

type ActiveOrder = {
  id: string | number;
  status: string;
  quantity: number;
  price: number;
  progress: number;
  estimatedDelivery: string;
  steps: string[];
  currentStep: number;
};

const formatPrice = (value: number) => `$${Number(value ?? 0).toFixed(2)}`;

type Props = {
  data: ActiveOrder;
};

export default function ActiveOrderCard({ data }: Props) {
  const router = useRouter();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Washing":
        return "bg-orange-100 text-orange-500";
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Delivery":
        return "bg-blue-100 text-blue-500";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm mb-3 border border-gray-100">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 flex-row items-center">
          <View
            className="w-9 h-9 rounded-full justify-center items-center"
            style={{ backgroundColor: "rgba(37, 99, 235, 0.2)" }}
          >
            <Ionicons name="cube-outline" size={20} color={Colors.primary} />
          </View>

        <TouchableOpacity
          disabled={data?.status === "REQUESTED"}
          onPress={() =>
            router.push({
              pathname: "/LiveTrackingScreen",
              params: { orderId: String(data.id) },
            })
          }
            activeOpacity={0.7}
            className="ml-2 w-[80%]"
          >
            <Text numberOfLines={1} className=" font-semibold">
              Order #{formatOrderNumber(data.id)}
            </Text>
            <Text className="text-sm text-gray-500 mb-3">
              {data.quantity} bags • {formatPrice(data.price)}
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(data.status)}`}
        >
          {data.status}
        </Text>
      </View>

      <View className="flex-row justify-between mb-2">
        {data.steps.map((step, index) => (
          <Text
            key={step}
            className={`text-xs ${index <= data.currentStep ? "text-blue-500" : "text-gray-400"}`}
          >
            {step}
          </Text>
        ))}
      </View>

      <View className="h-2 bg-gray-200 rounded-full mb-3">
        <View
          className="h-2 bg-blue-500 rounded-full"
          style={{ width: `${data.progress}%` }}
        />
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text numberOfLines={2} className="text-xs mr-4 text-gray-500">
            Estimated delivery: {data.estimatedDelivery}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/LiveTrackingScreen",
              params: { orderId: String(data.id) },
            })
          }
          className="flex-row gap-3 items-center"
          disabled={data?.status === "REQUESTED"}
        >
          <Text
            style={{
              color: data?.status === "REQUESTED" ? "gray" : Colors.primary,
            }}
            className="text-[14px] font-bold"
          >
            Track Live
          </Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={data?.status === "REQUESTED" ? "gray" : Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
