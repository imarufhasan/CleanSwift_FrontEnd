import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Colors from "@/constants/color";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function CircularProgress({
  size = 80,
  strokeWidth = 12,
}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="items-center justify-center">
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg width={size} height={size}>
          <Circle
            stroke={Colors.purple.light}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />

          {/* Partial arc for loader look */}
          <Circle
            stroke={Colors.purple.dark}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.3} ${circumference}`}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
