import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="otpVerification" />
        <Stack.Screen name="resetPassword" />
        <Stack.Screen name="enableLocation" />
        <Stack.Screen name="selectRole" />
        <Stack.Screen name="driverRegistration" />
        <Stack.Screen name="HomeScreen" />
      </Stack>
    </SafeAreaProvider>
  );
}
