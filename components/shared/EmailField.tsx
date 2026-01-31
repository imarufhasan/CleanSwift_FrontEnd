import React from "react";
import { View, Text, TextInput } from "react-native";

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const EmailInput: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
}) => (
  <View className="mb-5 w-full">
    <Text className="text-[#1a1c1e] text-base font-bold mb-2 ml-1">
      {label}
    </Text>
    <View className="bg-[#eaf8ff] border border-[#a2dfff] rounded-xl px-4">
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#7d848d"
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        autoCapitalize="none"
        className="text-[#1a1c1e] text-base"
      />
    </View>
  </View>
);
