import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Colors from "@/constants/color";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CircularProgress({
  size = 80,
  strokeWidth = 10,
  progress = 60, // 0 - 100
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke={Colors.purple.light}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Animated Progress Circle */}
        <AnimatedCircle
          stroke={Colors.purple.dark}
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

      {/* Center Percentage */}
      {/* <View className="absolute items-center">
        <Text className="text-xl font-bold">{progress}%</Text>
      </View> */}
    </View>
  );
}
