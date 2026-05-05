import { Platform, ToastAndroid, Alert } from "react-native";

const formatMessage = (message: any): string => {
  if (!message) return "Something went wrong";

  if (typeof message === "string") return message;

  if (typeof message === "object") {
    if (message.message && typeof message.message === "string") {
      return message.message;
    }

    return JSON.stringify(message);
  }

  return String(message);
};

const ShowMessage = {
  show: (
    message: any,
    duration: number | "short" | "long" = "short"
  ) => {
    const formattedMessage = formatMessage(message);

    if (Platform.OS === "android") {
      if (typeof duration === "number") {
        // fallback mapping
        ToastAndroid.show(
          formattedMessage,
          duration > 3000
            ? ToastAndroid.LONG
            : ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show(
          formattedMessage,
          duration === "long"
            ? ToastAndroid.LONG
            : ToastAndroid.SHORT
        );
      }
    } else {
      Alert.alert("", formattedMessage);
    }
  },

  success: (message: any, duration?: number | "short" | "long") => {
    ShowMessage.show(message, duration);
  },

  error: (message: any, duration?: number | "short" | "long") => {
    ShowMessage.show(message, duration);
  },

  info: (message: any, duration?: number | "short" | "long") => {
    ShowMessage.show(message, duration);
  },
};

export default ShowMessage;