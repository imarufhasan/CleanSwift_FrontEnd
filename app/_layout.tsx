import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SplashScreen from "@/components/initial/Splashscreen";
import Toast from "react-native-toast-message";
import "../global.css";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show the splash screen for 1 second
  // if (!ready || showSplash) {
  //   return (
  //     <>
  //       <StatusBar style="light" />
  //       <SplashScreen onFinish={() => setShowSplash(false)} />
  //     </>
  //   );
  // }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>

      {/* Toast Provider - Place it here so it's accessible globally */}
      <Toast />
    </>
  );
}
