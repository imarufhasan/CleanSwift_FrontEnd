// steps/WashingStep.js
import CustomerCard from "@/components/driver/home/CustomerCard";
import Colors from "@/constants/color";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function WashingStep({ setActiveStep }: any) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

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
      <CustomerCard name="Customer" address="Live order address" />

      <View className="bg-white rounded-2xl p-4 mb-6  shadow-lg elevation-6">
        <Text className="font-semibold text-xl mb-1">
          Set Estimated Ready Time
        </Text>

        {/* <TouchableOpacity className="border-[1px] border-blue-500 rounded-xl p-3 my-4 items-center justify-between flex-row">
          <Text className="text-gray-400 font-semibold text-base">00:00</Text>
          <Ionicons name="time-outline" size={16} color={Colors.primary} />
        </TouchableOpacity> */}
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
          Set Estimated Ready Time
        </Text>
        <Text className="text-sm text-center text-gray-500 mb-4">
          When will the laundry be ready?
        </Text>

        <View className="bg-blue-50 rounded-2xl p-4 mt-4 w-[100%]">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-gray-500 font-medium">Status</Text>
            <Text className="text-sm text-blue-500 font-medium">
              Washing in Progress
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-500 font-medium">
              Started At
            </Text>
            <Text className="text-sm text-black font-semibold">14:45</Text>
          </View>
        </View>
      </View>

      <View className="pb-6 mt-[50px]">
        <TouchableOpacity
          onPress={() => setActiveStep(2)}
          style={{ backgroundColor: Colors.primary }}
          className="py-4 rounded-xl flex-row justify-center items-center gap-3"
        >
          <Text className="text-white font-semibold ml-2">
            Mark as "Now Drying"
          </Text>
          <FontAwesome6 name="arrow-right-long" size={18} color="white" />
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
