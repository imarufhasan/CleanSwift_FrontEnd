import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PasswordInput } from "../../components/shared/PasswordField";
import ShowMessage from "../../constants/toast";
import { useResetPasswordMutation } from "../../src/services/authApi";

export default function Index() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { resetPasswordToken } = useLocalSearchParams();
  const [isModalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMatch, setpassMatch] = useState(false);

  const handlerResetPassword = async () => {
    // if (!passMatch) {
    //   ShowMessage.show("Passwords do not match");
    //   return;
    // }
    // ShowMessage.show("Password updated successfully");
    // router.replace("/(auth)/login");

    try {
      const req = {
        resetPasswordToken: resetPasswordToken,
        newPassword: newPassword,
      };
      const res = await resetPassword(req).unwrap();
      if (res?.success) {
        //setPasswordResetToken(res?.data?.token);
        ShowMessage.success(res?.message);
        router.replace("/(auth)/login");
      } else {
        ShowMessage.error("Something went wrong");
      }
    } catch (error: any) {
      ShowMessage.error(error?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!newPassword || !confirmPassword) {
      setpassMatch(false);
      return;
    }

    setpassMatch(newPassword.trim() === confirmPassword.trim());
  }, [newPassword, confirmPassword]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-white px-6">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center mt-4 mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-blue-100 p-2 rounded-full"
            >
              <Ionicons name="arrow-back" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className="text-[32px] font-bold text-black mb-2">
              Reset your password
            </Text>

            <Text className="text-[#7d848d] text-sm mb-8 leading-5">
              Create a new password for your account and make to choose a strong
              and unique password.
            </Text>

            {/* new pass */}
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {confirmPassword?.length > 0 && !passMatch && (
              <Text className="text-red-500 text-sm -mt-2">
                Passwords do not match
              </Text>
            )}
          </View>

          {/* Button INSIDE ScrollView */}
          <TouchableOpacity
            disabled={!passMatch}
            onPress={handlerResetPassword}
            className={`py-4 rounded-xl items-center mb-4 ${
              passMatch ? "bg-blue-500" : "bg-blue-300"
            }`}
          >
            <Text className="text-white font-semibold text-lg">Confirm</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
