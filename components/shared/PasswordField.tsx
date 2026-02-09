import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface PasswordProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const PasswordInput: React.FC<PasswordProps> = ({
  label,
  value,
  onChangeText,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="mb-5 w-full">
      <Text className="text-[#1a1c1e] text-base font-bold mb-2 ml-1">
        {label}
      </Text>
      <View className="bg-[#eaf8ff] border border-[#a2dfff] rounded-xl px-2  flex-row items-center">
        <TextInput
          secureTextEntry={!isPasswordVisible}
          placeholder="********"
          placeholderTextColor="#7d848d"
          value={value}
          onChangeText={onChangeText}
          className="flex-1 text-[#1a1c1e] text-base"
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? (
            <Eye size={20} color="#7d848d" />
          ) : (
            <EyeOff size={20} color="#7d848d" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
