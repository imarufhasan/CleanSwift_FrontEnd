// home/components/RequestPickupCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";

type Props = {
  onPressAdd: () => void;
};

export default function RequestPickupCard({ onPressAdd }: Props) {
  return (
    <View className="px-5 -mt-12 z-10">
      <View
        style={{ backgroundColor: Colors.primary }}
        className="border border-white/40 shadow-xl rounded-2xl p-5 flex-row justify-between items-center"
      >
        <View>
          <Text className="text-white text-lg font-bold">Request Pickup</Text>
          <Text className="text-white/90 text-sm mt-1">
            Get your laundry picked up today
          </Text>
        </View>

        <TouchableOpacity
          onPress={onPressAdd}
          className="bg-white w-12 h-12 rounded-full justify-center items-center shadow"
        >
          <Ionicons name="add" size={26} color="#2563EB" />
        </TouchableOpacity>
      </View>
    </View>
  );
}