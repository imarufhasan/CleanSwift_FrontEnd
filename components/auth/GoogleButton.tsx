import React from "react";
import { TouchableOpacity, Text, Image, View } from "react-native";

interface SocialButtonProps {
  label: string;
  onPress: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  label,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-center w-full bg-[#eaf8ff] py-4 rounded-xl border border-[#a2dfff]"
  >
    <Image
      source={{
        uri: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
      }}
      className="w-5 h-5 mr-3"
      resizeMode="contain"
    />
    <Text className="text-[#1a1c1e] text-base font-bold">{label}</Text>
  </TouchableOpacity>
);
