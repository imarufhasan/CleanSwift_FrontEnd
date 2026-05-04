import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as Splash from "expo-splash-screen";
import SplashScreen from "@/components/initial/Splashscreen";
import { useUserInfo } from "@/src/core/store/userInfo";
import { useStore } from "zustand";
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY, ROLE, USER } from "@/src/services/storage/tokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Role = "customer" | "driver";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const hasSeenOnboarding = false;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const prepare = async () => {
      try {
        const token = await AsyncStorage.getItem(ACCESS_KEY);
        const userString = await AsyncStorage.getItem(USER);
        const userJson = userString ? JSON.parse(userString) : null;
        console.log("user role from local index: ", userJson?.role);
        setUser(userJson);

        if (token && userJson) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }

        await Splash.hideAsync();
      } catch (error) {
        console.log("Auth check error:", error);
        setIsLoggedIn(false);
      } finally {
        setReady(true);
      }
    };

    setTimeout(prepare, 3000);
  }, []);

  if (!ready || isLoggedIn === null) {
    return <SplashScreen onFinish={() => {}} />;
  }

  // onboarding
  if (!isLoggedIn) {
    return <Redirect href="/(common)/onboarding" />;
  }

  // not logged in
  // if (!token) {
  //   return <Redirect href="/(auth)/login" />;
  // }

  console.log("user?.role index: ", user?.role);
  console.log("isLoggedIn index: ", isLoggedIn);
  
  

  // logged in
  if (user?.role === "CUSTOMER" && isLoggedIn) {
    return <Redirect href="/(customer)/(tabs)/home" />;
  }

  if (user?.role === "DRIVER" && isLoggedIn) {
    return <Redirect href="/(driver)/(tabs)/home" />;
  }
}
