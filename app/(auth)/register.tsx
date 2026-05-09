import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import BaseContainer from "../../components/shared/BaseContainer";
import { FullNameInput } from "../../components/shared/FullNameField";
import { MobileNumberInput } from "../../components/shared/PhoneNumberField";
import { EmailInput } from "../../components/shared/EmailField";
import { PasswordInput } from "../../components/shared/PasswordField";
import { Button } from "../../components/shared/Button";
import { AUTH_DATA } from "../../constants/auth";
import ShowToast from "../../components/shared/ShowToast";
import { Ionicons } from "@expo/vector-icons";
import AuthText from "./components/AuthText";
import OTPVerificationModal from "./components/Modals/Otpverificationmodal";
import GoogleButton from "./components/GoogleButton";
import {
  useRegisterMutation,
  useResendSignupOTPMutation,
  useVerifyOTPMutation,
} from "../../src/services/authApi";
import ShowMessage from "../../constants/toast";
import { UserRole, useUserInfo } from "../../src/core/store/userInfo";
import * as SecureStore from "expo-secure-store";
import { api } from "../../src/services/api";
import AppLoader from "@/components/shared/AppLoader";

const Register = () => {
  const router = useRouter();

  const [register, { data, error: registerError, isLoading, isSuccess }] =
    useRegisterMutation();

  const [
    verifyOTP,
    { data: verifyOtpData, error: verifyOtpError, isLoading: verifyOtpLoading },
  ] = useVerifyOTPMutation();

  const [
    resendSignupOTP,
    { isLoading: resendOtpLoading, error: resendOtpError },
  ] = useResendSignupOTPMutation();

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const setRole = useUserInfo((state) => state.setRole);
  const setTokens = useUserInfo((state) => state.setTokens);
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    if (successMessage) {
      setModalVisible(true);
    }
  }, [successMessage]);

  const handleRegisterClick = async () => {
    if (!fullName || !mobileNumber || !email || !password) {
      ShowMessage.error("All fields are required");
      return;
    }

    if (!agreedToTerms) {
      ShowMessage.error("Please agree to Terms and Policies");
      return;
    }

    try {
      const req = {
        name: fullName,
        phone: countryCode + "-" + mobileNumber,
        email,
        password,
      };
      console.log("register_req_data register: ", req);

      const res = await register(req).unwrap();
      console.log("register_res: ", res);
      if (res?.success) {
        const message =
          typeof res?.message === "string"
            ? res.message
            : res?.message?.text || "OTP sent successfully";
        console.log("message: ", message);

        setSuccessMessage(message);

        ShowMessage.success(message);
        setModalVisible(true);
      } else {
        console.log("res 11: ", res);
        ShowMessage.error("Failed to send OTP");
      }
    } catch (err: any) {
      let errorMsg = "Registration failed";

      if (err?.data) {
        if (typeof err.data === "string") errorMsg = err.data;
        else if (err.data?.message) errorMsg = err.data.message;
      } else if (err?.error) {
        errorMsg = err.error;
      }
      ShowMessage.error(errorMsg);
      if (!err.data?.isVerified) {
        console.log("Unverified account detected");
        setModalVisible(true);
      } else {
        setModalVisible(false);
      }

      setError(errorMsg);
    }
  };

  const handleVerify = async (code: string) => {
    try {
      const req = {
        userEmail: email,
        otp: code,
      };
      console.log("register_req_data verifyOTP: ", req);

      const res = await verifyOTP(req).unwrap();
      console.log("verifyOTP_res: ", res);

      const message =
        typeof res?.message === "string"
          ? res.message
          : res?.message?.text || "OTP verified successfully!";

      setRole(res?.data?.user?.role as UserRole);
      setTokens(res?.data?.accessToken, res?.data?.refreshToken);

      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");

      await SecureStore.setItemAsync("accessToken", res.data.accessToken);
      await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);

      api.util.resetApiState();

      ShowMessage.success(message);
      router.push("/(auth)/selectRole");

      setModalVisible(false);
    } catch (err: any) {
      // RTK Query error format
      let errorMsg = "Registration failed";

      if (err?.data) {
        if (typeof err.data === "string") errorMsg = err.data;
        else if (err.data?.message) errorMsg = err.data.message;
      } else if (err?.error) {
        errorMsg = err.error;
      }
      console.log("errorMsg22: ", errorMsg);
      ShowMessage.error(errorMsg, 3000);
      setError(errorMsg);
    }
  };

  const handleResend = async () => {
    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email");
        return;
      }

      const res = await resendSignupOTP({ userEmail: email });

      if (res?.data?.success) {
        ShowMessage.success(res?.data?.message);
        console.log("Resend OTP response: ", res?.data?.message);
      } else {
        ShowMessage.error(res?.data?.message || "Failed to resend OTP to register");
      }
    } catch (err) {
      console.log("Error resending OTP:", err);
      ShowMessage.error("Something went wrong");
    }
  };

  return (
    <BaseContainer>
      <AuthText
        title="Create Account"
        subtitle="Create your account and enjoy effortless laundry, door to door."
      />

      <View className="mt-10">
        <FullNameInput
          label="Full Name"
          placeholder="Ali Amin"
          value={fullName}
          onChangeText={setFullName}
        />
        <MobileNumberInput
          label="Mobile Number"
          placeholder="0123456789"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          setCountryCode={setCountryCode}

        />

        <View className="mt-6"/>
        <EmailInput
          label="Email"
          placeholder="aliamin@gmail.com"
          value={email}
          onChangeText={setEmail}
        />
        <PasswordInput
          label="Password"
          value={password}
          onChangeText={setPassword}
        />

        <View className="mb-8 mt-4">
          <TouchableOpacity
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            className="flex-row items-center"
          >
            <TouchableOpacity
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              className={`w-5 h-5 mr-2 rounded border items-center justify-center ${
                agreedToTerms
                  ? "border-black/20 border bg-white"
                  : "border-black/20 bg-white"
              }`}
            >
              {agreedToTerms && (
                <Ionicons name="checkmark" size={16} color="green" />
              )}
            </TouchableOpacity>
            <Text className="text-[#7d848d] text-sm font-medium">
              I agree to{" "}
              <Text className="text-[#00a2ff] font-medium">
                Terms and Policies
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          label={isLoading ? "Registering..." : "Register"}
          onPress={handleRegisterClick}
          disabled={isLoading}
        />
      </View>

      <View className="flex-row items-center my-5">
        <View className="flex-1 h-[1px] bg-[#e5e7eb]" />
        <Text className="mx-4 text-[#7d848d] text-base">or continue with</Text>
        <View className="flex-1 h-[1px] bg-[#e5e7eb]" />
      </View>

      <GoogleButton
        label="Sign Up with Google"
        onPress={() => {}}
        SvgComponent={AUTH_DATA[0].googleIcon}
      />

      <View className="mt-8 pb-6 flex-row justify-center">
        <Text className="text-[#7d848d] text-base">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text className="text-[#1a1c1e] text-base font-bold">Login</Text>
        </TouchableOpacity>
      </View>

      <OTPVerificationModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onVerify={handleVerify}
        onResend={handleResend}
        resendTimerSeconds={60}
        setParentCode={setOtpCode}
        code={otpCode}
      />

      <AppLoader visible={isLoading || verifyOtpLoading} />
    </BaseContainer>
  );
};

export default Register;
