import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Colors from "@/constants/color";

export default function CircularProgress({
  size = 120,
  strokeWidth = 12,
  progress = 60, // 👈 pass dynamic value (0-100)
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke="#E5E7EB"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle */}
        <Circle
          stroke={Colors.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Center Text */}
      <View className="absolute items-center">
        <Text className="text-2xl font-bold">{progress}%</Text>
      </View>
    </View>
  );
}
