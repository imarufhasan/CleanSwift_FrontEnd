// steps/PickupStep.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import CustomerCard from "@/components/driver/home/CustomerCard";

export default function PickupStep({ setActiveStep }: any) {
  const [bags, setBags] = useState(0);

  return (
    <View className="bg-white mb-6 px-4">
      <CustomerCard name="Ali Amin" address="123 Main Street, Apt 4B" />

      <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <Text className="font-bold text-2xl mb-1">Confirm Bag Count</Text>
        <Text className="text-sm text-gray-500 mb-4">
          How many bags are you picking up?
        </Text>

        <View className="flex-row justify-center items-center">
          <TouchableOpacity
            onPress={() => bags > 0 && setBags(bags - 1)}
            className="w-[45px] h-[45px] bg-gray-200 rounded-full justify-center items-center"
          >
            <FontAwesome6 name="minus" size={16} color={"black"} />
          </TouchableOpacity>

          <View className="mx-6 items-center">
            <Text className="text-3xl font-bold">{bags}</Text>
            <Text className="text-sm text-gray-400">bags</Text>
          </View>

          <TouchableOpacity
            onPress={() => setBags(bags + 1)}
            style={{ backgroundColor: Colors.primary }}
            className="w-[45px] h-[45px]  rounded-full justify-center items-center"
          >
            <FontAwesome6 name="add" size={18} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="pb-6 mt-[50px]">
        <TouchableOpacity
          onPress={() => setActiveStep(1)}
          style={{ backgroundColor: Colors.primary }}
          className="py-4 rounded-xl flex-row justify-center items-center"
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="white" />
          <Text className="text-white font-semibold ml-2">
            Confirm Pickup Complete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
