// AuthText.tsx
import React from "react";
import { View, Text } from "react-native";

// Define types for the props, if needed.
interface AuthTextProps {
  title: string;
  subtitle: string;
}

const AuthText: React.FC<AuthTextProps> = ({ title, subtitle }) => {
  return (
    <View className="mt-10">
      <Text className="text-3xl font-bold text-[#1a1c1e]">{title}</Text>
      <Text className="text-[#7d848d] text-base mt-2">{subtitle}</Text>
    </View>
  );
};

export default AuthText;
