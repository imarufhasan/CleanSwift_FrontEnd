import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";

export default function ProfileSettings() {
  return (
    <View className="flex-1 bg-white px-5">
      {/* Header */}
      <View className="flex-row items-center mt-12 mb-8">
        <TouchableOpacity className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Profile Setting</Text>
      </View>

      {/* Profile Image */}
      <View className="items-center mb-10">
        <View className="relative">
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=8" }}
            className="w-24 h-24 rounded-full"
          />
          <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 w-8 h-8 rounded-full items-center justify-center border-2 border-white">
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Full Name */}
      <View className="mb-5">
        <Text className="text-sm text-gray-500 mb-2">Full Name</Text>
        <TextInput
          value="Ali Amin"
          placeholder="Full Name"
          className="border border-blue-400 rounded-xl px-4 py-3 text-base"
        />
      </View>

      {/* Mobile Number */}
      <View className="mb-10">
        <Text className="text-sm text-gray-500 mb-2">Mobile Number</Text>
        <View className="flex-row items-center border border-blue-400 rounded-xl px-4 py-3">
          <Ionicons name="call-outline" size={18} color={Colors.primary} />
          <TextInput
            value="+92 301 1234567"
            placeholder="Mobile Number"
            className="ml-3 flex-1 text-base"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity className="bg-blue-500 py-4 rounded-xl mt-auto mb-10">
        <Text className="text-white text-center font-semibold text-base">
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
}
