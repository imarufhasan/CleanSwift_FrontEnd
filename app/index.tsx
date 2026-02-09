import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as Splash from "expo-splash-screen";
import SplashScreen from "@/components/initial/Splashscreen";

type Role = "customer" | "driver";

export default function Index() {
  const role: Role = "customer";

  const [ready, setReady] = useState(false);

  const isLoggedIn = false;
  const hasSeenOnboarding = false;

  useEffect(() => {
    const prepare = async () => {
      await Splash.hideAsync();
      setReady(true);
    };

    setTimeout(prepare, 3000);
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

  if (role === "customer") {
    return <Redirect href="/(customer)/(tabs)/home" />;
  }

  if (role === "driver") {
    return <Redirect href="/(driver)/(tabs)/home" />;
  }

  return null;
}
