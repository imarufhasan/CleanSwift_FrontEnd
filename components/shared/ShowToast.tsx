import React, { useEffect } from "react";
import { View } from "react-native";
import { Toast, ALERT_TYPE } from "react-native-alert-notification";

// A generic Toast message component
interface ShowToastProps {
  message?: string | null;
  type?: "success" | "error" | "warning" | "info"; // Expanded types
  position?: "top" | "bottom";
  autoClose?: boolean | number; // Can be boolean or milliseconds
  paddingTop?: number;
  width?: number | string;
  height?: number | string;
  onPress?: () => void;
  onShow?: () => void;
  onHide?: () => void;
}

const ShowToast: React.FC<ShowToastProps> = ({
  message,
  type = "info",
  autoClose = 4000, // 4 seconds default
  paddingTop = 70,
  position = "top",
  width = "92%",
  height = 60,
  onPress,
  onShow,
  onHide,
}) => {
  useEffect(() => {
    if (!message) return;

    // Map type to ALERT_TYPE
    const alertTypeMap = {
      success: ALERT_TYPE.SUCCESS,
      error: ALERT_TYPE.DANGER,
      warning: ALERT_TYPE.WARNING,
      info: ALERT_TYPE.SUCCESS, // Use SUCCESS styling for info
    };

    // Map type to titles
    const titleMap = {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info",
    };

    const toastConfig = {
      type: alertTypeMap[type],
      title: titleMap[type],
      textBody: message,
      autoClose: autoClose,
      onPress: onPress,
      onShow: onShow,
      onHide: onHide,
      // Custom styling for title and text
      titleStyle: {
        fontSize: 16,
        fontWeight: "600" as const,
      },
      textBodyStyle: {
        fontSize: 14,
        fontWeight: "400" as const,
      },
    };

    Toast.show(toastConfig);
  }, [
    message,
    type,
    autoClose,
    paddingTop,
    position,
    width,
    height,
    onPress,
    onShow,
    onHide,
  ]);

  return <View />;
};

export default ShowToast;
