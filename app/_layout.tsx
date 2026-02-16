import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Splash from "expo-splash-screen";
import { AlertNotificationRoot } from "react-native-alert-notification";
import "../global.css";

Splash.preventAutoHideAsync();

export default function RootLayout() {

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
