import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";
import Toast from "@/constants/toast";
import ShowMessage from "@/constants/toast";
import { useChangePasswordMutation } from "@/src/services/userApi";
import AppLoader from "@/components/shared/AppLoader";

export default function ChangePassword() {
  const router = useRouter();

  // api fetch
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    console.log("handleChangePassword called");
    if (newPassword !== confirmPassword) {
      ShowMessage.error("New password and confirm password do not match");
      return;
    }
    console.log("same new and conf pass");

    try {
      const reqData = {
        oldPassword: currentPassword,
        newPassword: newPassword,
      };
      console.log("reqData pass: ", reqData);

      const response: any = await changePassword(reqData).unwrap();

      if (response?.success) {
        ShowMessage.success(
          "Success",
          response.message || "Password changed successfully",
        );
        router.back();
      } else {
        ShowMessage.error(
          "Error",
          response.message || "Failed to change password",
        );
      }
    } catch (error: unknown) {
      const err = error as any;
      if (
        err?.status === "FETCH_ERROR" ||
        err?.message === "Network request failed"
      ) {
        ShowMessage.error(
          "Server is not reachable. Please check your internet or try again later.",
        );
        return;
      }
      if (err?.status === "PARSING_ERROR") {
        ShowMessage.error("Server response error. Please try again.");
        return;
      }
      ShowMessage.error(
        err?.data?.message ||
          "An error occurred while updating. Please try again.",
      );
      return false;
    }
  };

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
        <Text className="text-lg text-black font-semibold mb-2">
          Old Password
        </Text>
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
              name={!showCurrent ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* New Password */}
      <View className="mb-5">
        <Text className="text-lg text-black font-semibold mb-2">
          New Password
        </Text>
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
              name={!showNew ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password */}
      <View className="mb-10">
        <Text className="text-lg text-black font-semibold mb-2">
          Confirm New Password
        </Text>
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
              name={!showConfirm ? "eye-off-outline" : "eye-outline"}
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
        onPress={handleChangePassword}
      >
        <Text className="text-white text-center font-semibold text-[20px]">
          Save
        </Text>
      </TouchableOpacity>

      <AppLoader visible={isLoading} />
    </SafeAreaView>
  );
}
