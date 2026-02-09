import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BaseContainer from "@/components/shared/BaseContainer";
import { useRouter } from "expo-router";
import { EmailInput } from "@/components/shared/EmailField";
import { PasswordInput } from "@/components/shared/PasswordField";
import { Button } from "@/components/shared/Button";
import AuthText from "@/app/(auth)/components/AuthText";
import { AUTH_DATA } from "@/constants/auth";
import ShowToast from "@/components/shared/ShowToast";
import { Ionicons } from "@expo/vector-icons";
import useLogin from "../services/hooks/useLogin";
import GoogleButton from "../components/GoogleButton";

const Index: React.FC = () => {
  const router = useRouter();
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    successMessage,
    login,
  } = useLogin();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (successMessage) {
      router.push("./enableLocation");
    }
  }, [successMessage, router]);

  return (
    <BaseContainer>
      <AuthText
        title="Login"
        subtitle="Welcome back, your laundry is just a pickup away."
      />

      <ShowToast
        message={error || successMessage}
        type={error ? "error" : successMessage ? "success" : "info"}
      />

      <View className="mt-10">
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

        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            className="flex-row items-center"
          >
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              className={`w-5 h-5 mr-2 rounded border items-center justify-center ${
                rememberMe
                  ? "border-black/20 border bg-white"
                  : "border-black/20 bg-white"
              }`}
            >
              {rememberMe && (
                <Ionicons name="checkmark" size={16} color="green" />
              )}
            </TouchableOpacity>

            <Text className="text-black text-sm font-medium">Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/forgetPassScreen")}>
            <Text className="text-[#ff4d4d] text-sm font-medium">
              Forgot password
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          label={loading ? "Logging in..." : "Login"}
          onPress={login}
          disabled={loading}
        />
      </View>

      <View className="flex-row items-center my-7">
        <View className="flex-1 h-[1px] bg-[#e5e7eb]" />
        <Text className="mx-4 text-[#7d848d] text-lg">or continue with</Text>
        <View className="flex-1 h-[1px] bg-[#e5e7eb]" />
      </View>

      <GoogleButton
        label="Sign In with Google"
        onPress={() => {}}
        SvgComponent={AUTH_DATA[0].googleIcon}
      />

      <View className="mt-8 pb-6 flex-row justify-center">
        <Text className="text-[#7d848d] text-base">
          Don't have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text className="text-[#1a1c1e] text-base font-bold">Register</Text>
        </TouchableOpacity>
      </View>
    </BaseContainer>
  );
};

export default Index;
