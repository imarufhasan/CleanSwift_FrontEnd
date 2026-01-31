import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { EmailInput } from "@/components/shared/EmailField"; // From previous step
import { PasswordInput } from "@/components/shared/PasswordField";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { SocialButton } from "@/components/auth/GoogleButton";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white px-8 justify-center">
      <View className="mt-10 ">
        <Text className="text-3xl font-bold text-[#1a1c1e]">Login</Text>
        <Text className="text-[#7d848d] text-base mt-2">
          Welcome back your laundry is just a pickup away.
        </Text>
      </View>

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

        {/* Remember Me & Forgot Password */}
        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            className="flex-row items-center"
          >
            <View
              className={`w-5 h-5 rounded border ${rememberMe ? "bg-[#00a2ff] border-[#00a2ff]" : "border-[#d1d5db]"} mr-2`}
            />
            <Text className="text-[#7d848d] text-sm font-medium">
              Remember me
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => router.push("/reset-password")}>
            <Text className="text-[#ff4d4d] text-sm font-medium">
              Forgot password
            </Text>
          </TouchableOpacity> */}
        </View>

        <PrimaryButton
          label="Login"
          onPress={() => console.log("Logging in...")}
        />
      </View>

      {/* Divider */}
      <View className="flex-row items-center my-10">
        <View className="flex-1 h-[1px] bg-[#e5e7eb]" />
        <Text className="mx-4 text-[#7d848d] text-sm">or continue with</Text>
        <View className="flex-1 h-[1px] bg-[#e5e7eb]" />
      </View>

      <SocialButton label="Sign In with Google" onPress={() => {}} />

      {/* Footer */}
      <View className="mt-auto pb-10 flex-row justify-center">
        <Text className="text-[#7d848d] text-sm">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text className="text-[#1a1c1e] text-sm font-bold">Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
