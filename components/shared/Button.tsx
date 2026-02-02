import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    className="bg-[#00a2ff] flex-row justify-center items-center w-full py-4 rounded-xl"
  >
    <Text className="text-white text-base font-semibold mr-2">{label}</Text>
  </TouchableOpacity>
);
