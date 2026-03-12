import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Splash from "expo-splash-screen";
import { AlertNotificationRoot } from "react-native-alert-notification";
import "../global.css";
import { Provider } from "react-redux";
import { store } from "@/src/store";

Splash.preventAutoHideAsync();

// export default function RootLayout() {

//   return (
//     <>
//       <StatusBar style="dark" />
//       <AlertNotificationRoot theme="dark">
//         <Stack
//           screenOptions={{
//             headerShown: false,
//             animation: "slide_from_right",
//           }}
//         />
//       </AlertNotificationRoot>
//     </>
//   );
// }


export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}