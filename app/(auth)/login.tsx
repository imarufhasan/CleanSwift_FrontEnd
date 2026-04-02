import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BaseContainer from "../../components/shared/BaseContainer";
import { useRouter } from "expo-router";
import { EmailInput } from "../../components/shared/EmailField";
import { PasswordInput } from "../../components/shared/PasswordField";
import { Button } from "../../components/shared/Button";
import AuthText from "../../app/(auth)/components/AuthText";
import { AUTH_DATA } from "../../constants/auth";
import { Ionicons } from "@expo/vector-icons";
import { useLoginMutation } from "../../src/services/authApi";
import * as SecureStore from "expo-secure-store";
import ShowMessage from "../../constants/toast";
import {
  checkInternetConnection,
  checkServerConnection,
} from "../../src/utils/networkCheck";
import { api } from "../../src/services/api";
import { UserRole, useUserInfo } from "../../src/core/store/userInfo";
import GoogleButton from "./components/GoogleButton";
import { ACCESS_KEY } from "../../src/services/storage/tokenStorage";

const Index: React.FC = () => {
  const router = useRouter();
  const [login, { isLoading, error, data }] = useLoginMutation();

  const [email, setEmail] = useState("marufhasan60sta@gmail.com"); //customer
  //const [email, setEmail] = useState("maruf.hasan@sparktechagency.com"); //driver
  const [password, setPassword] = useState("1234567");
  const [rememberMe, setRememberMe] = useState(false);
  const setRole = useUserInfo((state) => state.setRole);
  const setTokens = useUserInfo((state) => state.setTokens);
  const setUserInfo = useUserInfo((state) => state.setUserInfo);
  const [loader, setLoader] = useState(false);
  const { userInfo } = useUserInfo();
  // const token = useUserInfo((state) => state.accessToken);
  // const role = useUserInfo((state) => state.role);

  const handleLogin = async () => {
    try {
      setLoader(true);
      const hasInternet = await checkInternetConnection();
      if (!hasInternet) {
        ShowMessage.show("No internet connection");
        return;
      }
      const serverUp = await checkServerConnection();
      console.log("serverUp: ", serverUp);
      if (!serverUp) {
        ShowMessage.show("Server is unavailable. Please try later.");
        return;
      }

      const res = await login({ email, password }).unwrap();
      const login_res_role = res?.data?.user?.role;

      console.log("login_res: ", res);
      setRole(login_res_role as UserRole);
      setTokens(res?.data?.accessToken, res?.data?.refreshToken);

      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.setItemAsync("accessToken", res.data.accessToken);
      await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);

      api.util.resetApiState();

      ShowMessage.show(res?.message || "Login Success");

      router.push("/(auth)/enableLocation");
      const token = useUserInfo.getState().accessToken;
      console.log("local token 2: ", token);
    } catch (err: any) {
      ShowMessage.show(err?.data?.message || "Login failed");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    // if (token) {
    //   console.log("logout token: ", token);
    // } else {
    //   console.log("logout token: ", "nothing");
    // }

    // if (role) {
    //   console.log("logout role: ", role);
    // } else {
    //   console.log("logout role: ", "nothing");
    // }
    const getAuthInfo = async () => {
      const token = await SecureStore.getItemAsync(ACCESS_KEY);
      console.log("token logout: ", token);
      
    }
    getAuthInfo();
  }, []);

  return (
    <BaseContainer>
      <AuthText
        title="Login"
        subtitle="Welcome back, your laundry is just a pickup away."
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
          label={loader ? "Logging in..." : "Login"}
          // onPress={handleLogin}
          onPress={() => router.push("/(auth)/enableLocation")}
          disabled={loader}
          loading={loader}
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
