import { Stack, Redirect } from "expo-router";

export default function CommonLayout() {
  // MOCK – replace with real auth later
  const isLoggedIn = true;

  // Protect common screens
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        animation: "slide_from_right",
      }}
    >
      {/* Notifications */}
      <Stack.Screen
        name="notifications/index"
        options={{ headerShown: false }}
      />

      <Stack.Screen name="onboarding" options={{ headerShown: false }} />

      <Stack.Screen
        name="ChangeLocation/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LiveTrackingScreen/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DriverDetails/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ChatScreen/index" options={{ headerShown: false }} />
      <Stack.Screen name="CallScreen/index" options={{ headerShown: false }} />
      <Stack.Screen name="profileSettings/index" options={{ headerShown: false }} />

      <Stack.Screen name="changePassword/index" options={{ headerShown: false }} />
      <Stack.Screen name="supportScreen/index" options={{ headerShown: false }} />
      <Stack.Screen name="PrivacyPolicyScreen/index" options={{ headerShown: false }} />
    </Stack>
  );
}
