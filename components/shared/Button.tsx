import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  license?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  disabled = false,
  license,
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={disabled ? () => {} : onPress}
    style={{
      backgroundColor: disabled ? "#d1d5db" : "#00a2ff",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingVertical: 16,
      borderRadius: 10,
    }}
    disabled={disabled}
  >
    <Text
      className={`text-white text-lg font-semibold ${disabled ? "text-[#7f7f7f]" : ""}`}
    >
      {label}
    </Text>
    {license && (
      <>
        {/* arrow right */}
        <MaterialIcons name="keyboard-arrow-right" size={18} color={"white"} />
      </>
    )}
  </TouchableOpacity>
);
