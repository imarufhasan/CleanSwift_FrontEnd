import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SplashScreen from "@/components/initial/Splashscreen";
import { Redirect } from "expo-router";
import {
  AlertNotificationRoot,
  Toast,
  ALERT_TYPE,
} from "react-native-alert-notification";
import "../global.css";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const loadResources = async () => {
    try {
      setReady(true);
    } catch (error) {
      console.error("Error loading resources: ", error);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

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
      <AlertNotificationRoot
        theme="dark" 
        toastConfig={{
          autoClose: 4000, 
          titleStyle: {
            fontSize: 16,
            fontWeight: "600",
          },
          textBodyStyle: {
            fontSize: 14,
            fontWeight: "400",
          },
        }}
        colors={[
          {
            label: "#1f2937",
            card: "#ffffff",
            overlay: "rgba(0,0,0,0.6)",
            success: "#10b981",
            danger: "#ef4444",
            warning: "#f59e0b",
            info: "#3b82f6", 
          },
          {
            label: "#f9fafb",
            card: "#1f2937",
            overlay: "rgba(0,0,0,0.8)",
            success: "#22c55e",
            danger: "#f87171",
            warning: "#fbbf24",
            info: "#60a5fa", 
          },
        ]}
      >
        {/* <Redirect href="/(auth)/register" /> */}
        {/* <Redirect href="/(tabs)/home" /> */}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#fff" },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(auth)" />
        </Stack>
      </AlertNotificationRoot>
    </>
  );
}
