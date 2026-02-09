import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import BaseContainer from "@/components/shared/BaseContainer";
import { FullNameInput } from "@/components/shared/FullNameField";
import { MobileNumberInput } from "@/components/shared/PhoneNumberField";
import { EmailInput } from "@/components/shared/EmailField";
import { PasswordInput } from "@/components/shared/PasswordField";
import { Button } from "@/components/shared/Button";
import { AUTH_DATA } from "@/constants/auth";
import ShowToast from "@/components/shared/ShowToast";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import useRegister from "../services/hooks/useRegister";
import AuthText from "../components/AuthText";
import GoogleButton from "../components/GoogleButton";
import OTPVerificationModal from "../components/Modals/Otpverificationmodal";

const Register = () => {
  const router = useRouter();
  const {
    fullName,
    setFullName,
    mobileNumber,
    setMobileNumber,
    email,
    setEmail,
    password,
    setPassword,
    agreedToTerms,
    setAgreedToTerms,
    loading,
    error,
    successMessage,
    register,
  } = useRegister();

  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  // Open modal when registration succeeds
  useEffect(() => {
    if (successMessage) {
      setModalVisible(true);
    }
  }, [successMessage]);

  const handleRegisterClick = () => {
    //register();
    setModalVisible(true);
  };

  const handleVerify = (code: string) => {
    setModalVisible(false);
    router.push("/(auth)/selectRole");
  };

  const handleResend = () => {
    console.log("Resend OTP triggered");
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
        />
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
          label={loading ? "Registering..." : "Register"}
          onPress={handleRegisterClick}
          disabled={loading}
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
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text className="text-[#1a1c1e] text-base font-bold">Login</Text>
        </TouchableOpacity>
      </View>

      <OTPVerificationModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onVerify={handleVerify}
        onResend={handleResend}
        resendTimerSeconds={60}
      />

      {error || successMessage ? (
        <ShowToast
          message={error || successMessage}
          type={error ? "error" : "success"}
        />
      ) : null}

      {/* <OTPVerificationModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onVerify={handleVerify}
          onResend={() => console.log("Resend OTP")}
          resendTimerSeconds={60}
        /> */}
    </BaseContainer>
  );
};

export default Register;
