import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ChangeLocation() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      {/* Title */}

      <TouchableOpacity className="mt-5" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>
      <Text className="text-[28px] font-bold text-gray-900 mt-6 mb-2">
        Set Your Location
      </Text>

      {/* Description */}
      <Text className="text-sm text-gray-700 leading-5 mb-6">
        Update your pickup location directly from the map to get faster laundry
        service. This helps us match you with nearby drivers for quick and
        reliable pickup and delivery.
      </Text>

      {/* Input */}
      <Text className="text-[16px] text-black font-semibold mt-4 mb-2">
        Enter your address
      </Text>

      <TextInput
        placeholder="Enter address"
        placeholderTextColor="#000"
        className="h-12 border bg-blue-100 border-blue-200 rounded-lg px-4 text-[15px] text-gray-900 mb-4"
      />

      {/* Use current location */}
      <TouchableOpacity className="h-12 flex-row border gap-2 border-blue-500 rounded-lg items-center justify-center mt-4 mb-6">
        
        <FontAwesome5 name="location-arrow" size={17} color="#3B82F6" />
        <Text className="text-blue-500 text-[16px] font-semibold">
          Use my current location
        </Text>
      </TouchableOpacity>

      {/* Save button */}
      <TouchableOpacity className="h-[50px] bg-blue-500 rounded-xl items-center justify-center mt-auto mb-4">
        <Text className="text-white text-[18px] font-semibold">
          Save
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
