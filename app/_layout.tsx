import React, { useEffect, useRef, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SplashScreen from "@/components/initial/Splashscreen";
import * as Splash from "expo-splash-screen";
import { AlertNotificationRoot } from "react-native-alert-notification";
import "../global.css";

Splash.preventAutoHideAsync();

export default function RootLayout() {
  // const router = useRouter();
  // const [appReady, setAppReady] = useState(false);
  // const [showSplash, setShowSplash] = useState(true);

  // const nativeSplashHidden = useRef(false);
  // const isLoggedIn = false;

  // useEffect(() => {
  //   setAppReady(true);
  // }, []);
  // useEffect(() => {
  //   if (appReady && !showSplash && !nativeSplashHidden.current) {
  //     nativeSplashHidden.current = true;
  //     Splash.hideAsync();
  //     if (!isLoggedIn) {
  //       router.replace("/(common)/onboarding/index");
  //     }
  //   }
  // }, [appReady, showSplash]);
  // if (!appReady || showSplash) {
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
      <AlertNotificationRoot theme="dark">
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </AlertNotificationRoot>
    </>
  );
}
