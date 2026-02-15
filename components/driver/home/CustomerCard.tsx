import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { router } from "expo-router";

interface Props {
  name: string;
  address: string;
  image?: string;
  instructionTitle?: string;
  instructionSubtitle?: string;
  instructionDescription?: string;
}

export default function CustomerCard({
  name,
  address,
  image = "https://i.pravatar.cc/150?img=12",
  instructionTitle = "Instructions",
  instructionSubtitle = "Delicate Items",
  instructionDescription = "Light wash • Gentle wash for delicate clothes",
}: Props) {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-lg mb-4">
      {/* 🔹 USER INFO */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Image
            source={{ uri: image }}
            className="w-[60px] h-[60px] rounded-full border-2 border-white"
          />
          <View className="ml-3">
            <Text className="text-2xl font-semibold">{name}</Text>
            <Text className="text-sm text-gray-500">{address}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push("/OrderDetailsDriver")}>
          <Text
            style={{ color: Colors.primary }}
            className="text-sm font-semibold"
          >
            View Details
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 INSTRUCTION CARD */}
      <View className="bg-orange-50 rounded-2xl p-4 mt-4">
        <View className="flex-row items-start">
          <Ionicons name="alert-circle-outline" size={16} color="#F97316" />
          <View className="ml-2">
            <Text className="text-gray-500 text-sm">
              {instructionTitle}
            </Text>

            <Text className="font-bold text-lg my-1" >{instructionSubtitle}</Text>
            <Text className="text-xs text-gray-500">
              {instructionDescription}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
