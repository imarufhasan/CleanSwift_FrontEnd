import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import { View, Text } from "react-native";

// A generic Toast message component
interface ShowToastProps {
  message?: string | null;
  type?: "success" | "error" | "info"; // Can be expanded if needed
  autoHide?: boolean; // If the toast should auto-hide after a timeout
  paddingTop?: number; // Optional custom padding from top
}

const ShowToast: React.FC<ShowToastProps> = ({
  message,
  type = "info",
  autoHide = true,
  paddingTop = 70, // Default paddingTop value
}) => {
  useEffect(() => {
    if (message) {
      Toast.show({
        type,
        text1: message,
        visibilityTime: autoHide ? 3000 : 0, // Auto-hide after 3 seconds
        position: "top", // Position the toast at the top
        topOffset: paddingTop, // Add custom padding from top
      });
    }
  }, [message, type, autoHide, paddingTop]);

  return (
    <View>
      {/* The Toast will be shown automatically, no need for any rendering here */}
    </View>
  );
};

export default ShowToast;
