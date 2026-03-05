import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "@/constants/color";
import ShowMessage from "@/constants/toast";
import OTPVerificationModal from "./components/Modals/Otpverificationmodal";
import {
  useForgetpasswordMutation,
  useVerifyForgetPassOtpMutation,
} from "@/src/services/authApi";

export default function ForgetPassScreen() {
  const router = useRouter();
  const [forgetPassword, { isLoading }] = useForgetpasswordMutation();
  const [verifyForgetPassOtp, { isLoading: verifyForgetPassOtpLoading }] =
    useVerifyForgetPassOtpMutation();
  const [email, setEmail] = useState("");
  const [passwordResetToken, setPasswordResetToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const emailValid = isValidEmail(email);

  const handleSendOtp = async () => {
    try {
      const res = await forgetPassword({ email }).unwrap();
      if (res?.success) {
        setPasswordResetToken(res?.data?.token);
        ShowMessage.success(res?.message || "OTP sent to your email");
        setModalVisible(true);
      } else {
        ShowMessage.error("Something went wrong");
      }
    } catch (error: any) {
      ShowMessage.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleVerify = async (code: string) => {
    try {
      const req = {
        token: passwordResetToken,
        otp: code,
      };
      console.log("verifyForgetPassOtp_req_data: ", req);
      const res = await verifyForgetPassOtp(req).unwrap();
      if (res?.success) {
        ShowMessage.success(res?.message || "OTP verified successfully!");
        setModalVisible(false);
        router.replace({
          pathname: "/(auth)/resetPassword",
          params: {
            resetPasswordToken: res?.data?.resetPasswordToken,
          },
        });
      } else {
        ShowMessage.error("Something went wrong");
      }
    } catch (error: any) {
      ShowMessage.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleResend = () => {
    console.log("Resend OTP triggered");
  };

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
              Email Confirmation
            </Text>

            <Text className="text-[#7d848d] text-sm mb-8 leading-5">
              Enter your email for verification.
            </Text>

            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-sm text-gray-500 mb-2">Email</Text>
              <View className="flex-row items-center border border-blue-400 rounded-xl px-4 py-3">
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={Colors.primary}
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="aliamin@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  cursorColor={Colors.primary}
                  className="ml-3 flex-1 text-base"
                  placeholderTextColor="gray"
                />
              </View>
            </View>
          </View>

          {/* Button INSIDE ScrollView */}
          <TouchableOpacity
            disabled={!emailValid || isLoading}
            onPress={handleSendOtp}
            className={`py-4 rounded-xl items-center mb-4 ${
              emailValid ? "bg-blue-500" : "bg-blue-300"
            }`}
          >
            {isLoading ? (
              <Text className="text-white font-semibold text-lg">
                Sending...
              </Text>
            ) : (
              <Text className="text-white font-semibold text-lg">Send OTP</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        <OTPVerificationModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onVerify={handleVerify}
          loading={verifyForgetPassOtpLoading}
          onResend={handleResend}
          resendTimerSeconds={300}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
