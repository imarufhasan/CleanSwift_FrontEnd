import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { ChevronRight } from "lucide-react-native";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    className="bg-[#00a2ff] flex-row justify-center items-center w-full py-4 rounded-xl"
  >
    <Text className="text-white text-base font-semibold mr-2">{label}</Text>
    <ChevronRight color="white" size={20} strokeWidth={2.5} />
  </TouchableOpacity>
);
