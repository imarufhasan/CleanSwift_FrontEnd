import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import BaseContainer from "@/components/shared/BaseContainer";
import AuthText from "./components/AuthText";
import { FullNameInput } from "@/components/shared/FullNameField";
import { MobileNumberInput } from "@/components/shared/PhoneNumberField";
import { EmailInput } from "@/components/shared/EmailField";
import { PasswordInput } from "@/components/shared/PasswordField";
import { Button } from "@/components/shared/Button";
import GoogleButton from "./components/GoogleButton";
import { AUTH_DATA } from "@/constants/auth";
import OTPVerificationModal from "./components/Modals/Otpverificationmodal";
import ShowToast from "@/components/shared/ShowToast";
import useRegister from "./services/hooks/useRegister";

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
    register();
  };

  const handleVerify = (code: string) => {
    console.log("OTP received:", code);
    setModalVisible(false);
    // Handle OTP verification here
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
          placeholder="+880 1234567890"
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
            <View
              className={`w-5 h-5 rounded border ${
                agreedToTerms
                  ? "bg-[#00a2ff] border-[#00a2ff]"
                  : "border-[#d1d5db]"
              } mr-2`}
            />
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

      <View className="flex-row items-center my-10">
        <View className="flex-1 h-[1px] bg-[#e5e7eb]" />
        <Text className="mx-4 text-[#7d848d] text-sm">or continue with</Text>
        <View className="flex-1 h-[1px] bg-[#e5e7eb]" />
      </View>

      <GoogleButton
        label="Sign Up with Google"
        onPress={() => {}}
        SvgComponent={AUTH_DATA[0].googleIcon}
      />

      <View className="mt-8 pb-6 flex-row justify-center">
        <Text className="text-[#7d848d] text-sm">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text className="text-[#1a1c1e] text-lg font-bold">Login</Text>
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
    </BaseContainer>
  );
};

export default Register;
