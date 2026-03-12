import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  license?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  disabled = false,
  license,
  loading,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={isDisabled ? () => {} : onPress}
      disabled={isDisabled}
      style={{
        backgroundColor: disabled ? "#d1d5db" : "#00a2ff",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingVertical: 16,
        borderRadius: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center"  }} className="gap-4">
        {loading && <ActivityIndicator size="small" color="#ffffff" />}
        <Text
          className={`text-white text-lg font-semibold ${
            disabled ? "text-[#7f7f7f]" : ""
          }`}
        >
          {label}
        </Text>

        {license && (
          <MaterialIcons
            name="keyboard-arrow-right"
            size={18}
            color="white"
            style={{ marginLeft: 4 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
