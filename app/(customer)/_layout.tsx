import { Stack, Redirect, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useState } from "react";

export default function CustomerLayout() {
  // OPTIONAL: auth protection
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = "Maruf";

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return router.push("/(auth)/login");
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs (Home, Orders, Wallet, Profile) */}
      <Stack.Screen name="(tabs)" />

      {/* Non-tab screens */}
      {/* <Stack.Screen name="order-details/[id]" />
      <Stack.Screen name="address/index" /> */}
    </Stack>
  );
}
