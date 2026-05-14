import React, { useState } from "react";
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import CustomerCard from "@/components/driver/home/CustomerCard";
import Colors from "@/constants/color";
import type { Order } from "@/src/services/orderApi";
import { formatOrderNumber } from "@/src/utils/orderNumber";

type Props = {
  order?: Order;
  isUpdating?: boolean;
  onStartWashing: () => Promise<void> | void;
};

const formatDateTime = (value?: string) => {
  if (!value) return "--";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function WashingStep({
  order,
  isUpdating,
  onStartWashing,
}: Props) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const customer = order ? order.customer : undefined;

  const onTimeChange = (_: any, time?: Date) => {
    setShowTimePicker(false);

    if (time) {
      setSelectedTime(time);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

      <View className="bg-white rounded-2xl p-4 mb-6 shadow-lg elevation-6">
        <Text className="font-semibold text-xl mb-1">
          Set Estimated Ready Time
        </Text>

        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          className="border-[1px] border-blue-500 rounded-xl p-3 my-4 items-center justify-between flex-row"
        >
          <Text className="text-gray-600 font-semibold text-base">
            {selectedTime ? formatTime(selectedTime) : "00:00"}
          </Text>
          <Ionicons name="time-outline" size={16} color={Colors.primary} />
        </TouchableOpacity>

        <Text className="text-sm text-center text-gray-500 mb-4">
          When will the laundry be ready?
        </Text>
      </View>

      <View className="bg-white rounded-2xl p-4 mb-6 items-center justify-center shadow-lg elevation-6">
        <View className="bg-blue-100 p-3 mb-4 rounded-full">
          <Feather name="box" size={22} color={Colors.primary} />
        </View>
        <Text className="font-semibold text-xl mb-1 text-center">
          Washing Status
        </Text>
        <Text className="text-sm text-center text-gray-500 mb-4">
          Order #{formatOrderNumber(order ? order._id : undefined)}
        </Text>

        <View className="bg-blue-50 rounded-2xl p-4 mt-4 w-[100%]">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-gray-500 font-medium">Status</Text>
            <Text className="text-sm text-blue-500 font-medium">
              {order && order.status ? order.status.replaceAll("_", " ") : "Waiting"}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-500 font-medium">
              Picked Up At
            </Text>
            <Text className="text-sm text-black font-semibold">
              {formatDateTime(order && order.timeline ? order.timeline.pickedUpAt : undefined)}
            </Text>
          </View>
        </View>
      </View>

      <View className="pb-6 mt-[50px]">
        <TouchableOpacity
          onPress={onStartWashing}
          disabled={isUpdating}
          style={{ backgroundColor: Colors.primary }}
          className="py-4 rounded-xl flex-row justify-center items-center gap-3"
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-white font-semibold ml-2">
                Start Washing
              </Text>
              <FontAwesome6 name="arrow-right-long" size={18} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}
    </View>
  );
}
