import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";
import Toast from "@/constants/toast";

export default function ChangePassword() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white px-5 mt-4">
      {/* Header */}
      <View className="flex-row items-center mb-10 relative">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-100 p-2 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View className="absolute left-0 right-0 items-center">
          <Text className="text-[24px] font-semibold">Change Password</Text>
        </View>
      </View>

      {/* Current Password */}
      <View className="mb-5">
        <Text className="text-lg text-black font-semibold mb-2">Old Password</Text>
        <View className="flex-row bg-blue-50 items-center border border-blue-400 rounded-xl px-4 py-3">
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="********"
            secureTextEntry={!showCurrent}
            className="flex-1 text-base text-black "
            placeholderTextColor={"gray"}
          />
          <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
            <Ionicons
              name={showCurrent ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* New Password */}
      <View className="mb-5">
        <Text className="text-lg text-black font-semibold mb-2">New Password</Text>
        <View className="flex-row bg-blue-50 items-center border border-blue-400 rounded-xl px-4 py-3">
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="********"
            secureTextEntry={!showNew}
            className="flex-1 text-base text-black"
            placeholderTextColor={"gray"}
          />
          <TouchableOpacity onPress={() => setShowNew(!showNew)}>
            <Ionicons
              name={showNew ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password */}
      <View className="mb-10">
        <Text className="text-lg text-black font-semibold mb-2">Confirm New Password</Text>
        <View className="flex-row bg-blue-50 items-center border border-blue-400 rounded-xl px-4 py-3">
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="********"
            secureTextEntry={!showConfirm}
            className="flex-1 text-base text-black"
            placeholderTextColor={"gray"}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons
              name={showConfirm ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={{ backgroundColor: Colors.primary }}
        className="py-4 rounded-xl mt-auto mb-10"
        onPress={() => {
          Toast.show("Password changed successfully");
        }}
      >
        <Text className="text-white text-center font-semibold text-[20px]">
          Save
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
