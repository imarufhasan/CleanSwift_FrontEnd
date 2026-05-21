import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { router } from "expo-router";

interface Props {
  name: string;
  address: string;
  image?: string | number;
  instructionTitle?: string;
  instructionSubtitle?: string;
  instructionDescription?: string;
  orderId?: string;
}

export default function CustomerCard({
  name,
  address,
  image = require("@/assets/images/profile.png"),
  instructionTitle = "Instructions",
  instructionSubtitle = "Special Instructions",
  instructionDescription = "No special instructions",
  orderId,
}: Props) {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-lg mb-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1 pr-3">
          <Image
            source={typeof image === "string" ? { uri: image } : image}
            className="w-[60px] h-[60px] rounded-full border-2 border-white"
          />
          <View className="ml-3 flex-1">
            <Text className="text-2xl font-semibold" numberOfLines={1}>
              {name}
            </Text>
            <Text className="text-sm text-gray-500" numberOfLines={2}>
              {address}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            // router.push({
            //   pathname: "/(common)/OrderDetailsDriver" as any,
            //   params: orderId ? { id: orderId } : undefined,
            // });
            router.push({
              pathname: "/(common)/OrderDetails",
              params: { id: String(orderId) },
            });
          }}
        >
          <Text
            style={{ color: Colors.primary }}
            className="text-sm font-semibold"
          >
            View Details
          </Text>
        </TouchableOpacity>
      </View>

      <View className="bg-orange-50 rounded-2xl p-4 mt-4">
        <View className="flex-row items-start">
          <Ionicons name="alert-circle-outline" size={16} color="#F97316" />
          <View className="ml-2 flex-1">
            <Text className="text-gray-500 text-sm">{instructionTitle}</Text>
            <Text className="font-bold text-lg my-1">
              {instructionSubtitle}
            </Text>
            <Text className="text-xs text-gray-500">
              {instructionDescription}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
