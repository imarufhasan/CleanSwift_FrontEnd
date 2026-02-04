import { Platform, ToastAndroid, Alert } from "react-native";

const Toast = {
  show: (message : any, duration = "short") => {
    if (Platform.OS === "android") {
      ToastAndroid.show(
        message,
        duration === "long"
          ? ToastAndroid.LONG
          : ToastAndroid.SHORT
      );
    } else {
      Alert.alert("", message);
    }
  },

  success: (message: any) => {
    Toast.show(message);
  },

  error: (message: any) => {
    Toast.show(message);
  },

  info: (message: any) => {
    Toast.show(message);
  },
};

export default Toast;
