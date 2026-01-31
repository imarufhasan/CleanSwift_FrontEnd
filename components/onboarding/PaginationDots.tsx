import React from "react";
import { View } from "react-native";

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  total,
  activeIndex,
}) => (
  <View className="flex-row justify-center items-center mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <View
        // ADD THE KEY PROP HERE
        key={`dot-${i}`}
        className={`h-1.5 rounded-full mx-1 ${
          i === activeIndex ? "w-8 bg-[#00a2ff]" : "w-2 bg-[#00a2ff] opacity-20"
        }`}
      />
    ))}
  </View>
);
