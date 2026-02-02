import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean; 
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  disabled = false, 
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={disabled ? () => {} : onPress} 
    className={`${
      disabled ? "bg-[#d1d5db]" : "bg-[#00a2ff]"
    } flex-row justify-center items-center w-full py-4 rounded-xl`} 
    disabled={disabled} 
  >
    <Text
      className={`text-white text-base font-semibold mr-2 ${disabled ? "text-[#7f7f7f]" : ""}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
