import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "@/constants/color";
import OTPVerificationModal from "./components/Modals/Otpverificationmodal";

export default function ForgetPassScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const handleVerify = (code: string) => {
    console.log("OTP received:", code);
    setModalVisible(false);
    router.push("/(auth)/selectRole");
  };

  const handleResend = () => {
    console.log("Resend OTP triggered");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 mb-4">
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
          Email Confirmation
        </Text>

        <Text className="text-[#7d848d] text-sm mb-8 leading-5">
          Enter your email for verification.
        </Text>

        {/* Email Input */}
        <View className="mb-6">
          <Text className="text-sm text-gray-500 mb-2">Email</Text>
          <View className="flex-row items-center border border-blue-400 rounded-xl px-4 py-3">
            <Ionicons name="mail-outline" size={18} color={Colors.primary} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="aliamin@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              cursorColor={Colors.primary}
              className="ml-3 flex-1 text-base"
              placeholderTextColor={"gray"}
            />
          </View>
        </View>
      </View>
      {/* Submit Button */}
      <TouchableOpacity
        className="bg-blue-500 py-4 rounded-xl items-center"
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text className="text-white font-semibold text-lg">Send Otp</Text>
      </TouchableOpacity>

      <OTPVerificationModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onVerify={handleVerify}
        onResend={handleResend}
        resendTimerSeconds={60}
      />
    </SafeAreaView>
  );
}
