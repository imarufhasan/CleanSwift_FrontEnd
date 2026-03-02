import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as Splash from "expo-splash-screen";
import SplashScreen from "@/components/initial/Splashscreen";

type Role = "customer" | "driver";

export default function Index() {
  const role: Role = "driver";
  const [ready, setReady] = useState(false);

  const isLoggedIn = false;
  const hasSeenOnboarding = false;

  useEffect(() => {
    const prepare = async () => {
      // Keep native splash until React splash finishes
      await Splash.preventAutoHideAsync();

      // Simulate loading (API, auth, etc.)
      await new Promise(res => setTimeout(res, 3000));

      setReady(true);

      // Now hide the native splash
      await Splash.hideAsync();
    };

    prepare();
  }, []);

  if (!ready) {
    return <SplashScreen onFinish={() => {}} />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/(common)/onboarding" />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return null;
}