import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Splash from "expo-splash-screen";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { StripeProvider } from "@stripe/stripe-react-native";
import "../global.css";
import { Provider } from "react-redux";
import { store } from "@/src/store";
import { STRIPE_PUBLISHABLE_KEY } from "@/src/constants/api";

Splash.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <Stack screenOptions={{ headerShown: false }} />
      </StripeProvider>
    </Provider>
  );
}
