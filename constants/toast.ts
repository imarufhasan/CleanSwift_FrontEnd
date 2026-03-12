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
  show: (message: any, duration: "short" | "long" = "short") => {
    const formattedMessage = formatMessage(message);

    if (Platform.OS === "android") {
      ToastAndroid.show(
        formattedMessage,
        duration === "long"
          ? ToastAndroid.LONG
          : ToastAndroid.SHORT
      );
    } else {
      Alert.alert("", formattedMessage);
    }
  },

  success: (message: any) => {
    ShowMessage.show(message);
  },

  error: (message: any) => {
    ShowMessage.show(message);
  },

  info: (message: any) => {
    ShowMessage.show(message);
  },
};

export default ShowMessage;