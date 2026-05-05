import Colors from "@/constants/color";
import React from "react";
import { View, Text, Modal, ActivityIndicator } from "react-native";
interface AppLoaderProps {
  visible: boolean;
  message?: string;
}

export default function AppLoader({
  visible,
  message = "Please wait…",
}: AppLoaderProps) {

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 32,
            alignItems: "center",
            gap: 16,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ color: "#1f2937", fontSize: 15, fontWeight: "500" }}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
