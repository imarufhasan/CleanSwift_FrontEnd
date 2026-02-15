// steps/DryingStep.js
import CircularProgress from "@/components/driver/home/CircularProgress";
import CustomerCard from "@/components/driver/home/CustomerCard";
import Colors from "@/constants/color";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function DryingStep({ setActiveStep }: any) {
  return (
    <View className="bg-white mb-6 px-4">
      <CustomerCard name="Ali Amin" address="123 Main Street, Apt 4B" />

      <View className="bg-purple-100 rounded-2xl p-4 my-4 w-full items-center justify-center">
        <CircularProgress />
        <Text className="font-bold text-2xl text-black mt-3">
          Drying in Progress
        </Text>
        <Text className="text-base text-gray-500">Items are being dried</Text>
      </View>

      <View className="bg-white rounded-2xl border-gray-100 border-[1px] p-4 mt-4 w-[100%]">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-500 font-medium">Status</Text>
          <Text className="text-sm text-blue-500 font-medium">
            Washing in Progress
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-500 font-medium">Started At</Text>
          <Text className="text-sm text-black font-semibold">14:45</Text>
        </View>
      </View>

      <View className="pb-6 mt-[50px]">
        <TouchableOpacity
          onPress={() => setActiveStep(3)}
          style={{ backgroundColor: Colors.primary }}
          className="py-4 rounded-xl flex-row justify-center items-center gap-3"
        >
          <Text className="text-white font-semibold ml-2">
            Mark as "Now Folding"
          </Text>
          <FontAwesome6 name="arrow-right-long" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
