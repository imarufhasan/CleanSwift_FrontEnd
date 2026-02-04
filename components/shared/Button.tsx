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
    style={{
      backgroundColor: disabled ? "#d1d5db" : "#00a2ff",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "100%", // Make sure it spans the full width
      paddingVertical: 16, // Adjust padding to make the button larger
      borderRadius: 16, // Rounded corners for the button
    }}
    disabled={disabled}
  >
    <Text
      style={{
        color: disabled ? "#7f7f7f" : "white",
        fontSize: 16,
        fontWeight: "600",
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
