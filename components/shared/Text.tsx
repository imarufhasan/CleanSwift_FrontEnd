import React from "react";
import { View, Text } from "react-native";

interface GeneralTextProps {
  title: string;
  description: string;
}

export const GeneralText: React.FC<GeneralTextProps> = ({
  title,
  description,
}) => (
  <View className="items-center px-8 mt-5">
    <Text className="text-[28px] font-bold text-[#1a1c1e] text-center leading-9 mb-4">
      {title}
    </Text>
    <Text className="text-[#7d848d] text-base text-center leading-6 font-normal pb-4">
      {description}
    </Text>
  </View>
);
