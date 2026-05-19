

import React, { useEffect, useRef, ReactNode } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


interface SkeletonPlaceholderProps {
  children: ReactNode;
  backgroundColor?: string;
  highlightColor?: string;
  speed?: number;    
  borderRadius?: number;
  enabled?: boolean;
}

interface ItemProps extends ViewStyle {
  children?: ReactNode;
}

const Item: React.FC<ItemProps> = ({ children, ...style }) => {
  return (
    <View style={[styles.item, style as ViewStyle]}>
      {children}
    </View>
  );
};


const SkeletonPlaceholder: React.FC<SkeletonPlaceholderProps> & {
  Item: typeof Item;
} = ({
  children,
  backgroundColor = "#E1E9EE",
  highlightColor = "#F2F8FC",
  speed = 1200,
  borderRadius,
  enabled = true,
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) return;

    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: speed,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer, speed, enabled]);

  // Translate the gradient from -1× width to +1× width
  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-350, 350],
  });

  if (!enabled) return <>{children}</>;

  return (
    <View style={borderRadius !== undefined ? { borderRadius, overflow: "hidden" } : undefined}>
      {/* Render children as the base "bone" shapes */}
      <View style={{ backgroundColor: "transparent" }}>
        {React.Children.map(children, (child) =>
          applyBackground(child, backgroundColor, borderRadius),
        )}
      </View>

      {/* Shimmer overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateX }] },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            "transparent",
            highlightColor + "CC",
            highlightColor,
            highlightColor + "CC",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};


function applyBackground(
  node: ReactNode,
  bg: string,
  defaultRadius?: number,
): ReactNode {
  if (!React.isValidElement(node)) return node;

  const el = node as React.ReactElement<any>;

  const existingStyle: ViewStyle = StyleSheet.flatten(el.props.style) || {};
  const radius =
    el.props.borderRadius ??
    existingStyle.borderRadius ??
    defaultRadius ??
    0;

  const newChildren = el.props.children
    ? React.Children.map(el.props.children, (child) =>
        applyBackground(child, bg, defaultRadius),
      )
    : undefined;

  return React.cloneElement(el, {
    style: [
      el.props.style,
      { backgroundColor: bg, borderRadius: radius, overflow: "hidden" },
    ],
    children: newChildren,
  });
}


SkeletonPlaceholder.Item = Item;


const styles = StyleSheet.create({
  item: {
    overflow: "hidden",
  },
});

export default SkeletonPlaceholder;
