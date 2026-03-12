import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as Splash from "expo-splash-screen";
import SplashScreen from "@/components/initial/Splashscreen";
import { useUserInfo } from "@/src/core/store/userInfo";
import { useStore } from "zustand";
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY, ROLE } from "@/src/services/storage/tokenStorage";

type Role = "customer" | "driver";

export default function Index() {
  //const role: Role = "driver";
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<string | null>("");
  const [token, setToken] = useState<string | null>("");

  // const token = useUserInfo.getState().accessToken;
  // const role = useUserInfo.getState().role;
  const isLoggedIn = false;
  const hasSeenOnboarding = false;

  // console.log("app token: ", token);

  useEffect(() => {
    const prepare = async () => {
      await Splash.preventAutoHideAsync();
      await new Promise((res) => setTimeout(res, 3000));
      setReady(true);
      await Splash.hideAsync();
    };

    const getAuth = async () => {
      const tok = await SecureStore.getItemAsync(ACCESS_KEY);
      setToken(tok);
      const rol = await SecureStore.getItemAsync(ROLE);
      setRole(rol);
    };

    prepare();
    getAuth();
  }, []);

  if (!ready) {
    return <SplashScreen onFinish={() => {}} />;
  }

  if (!hasSeenOnboarding && !token) {
    return <Redirect href="/(common)/onboarding" />;
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  } else {
    if (role === "CUSTOMER") {
      return <Redirect href="/(customer)/(tabs)/home" />;
    } else {
      return <Redirect href="/(driver)/(tabs)/home" />;
    }
  }

  return null;
}
