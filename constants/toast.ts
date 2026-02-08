import ShowToast from "@/components/shared/ShowToast";
import { Platform, ToastAndroid, Alert } from "react-native";

const ShowMessage = {
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
