import NetInfo from "@react-native-community/netinfo";
import { BASE_URL, SOCKET_URL } from "../constants/api";

export const checkInternetConnection = async () => {
  const state = await NetInfo.fetch();

  if (!state.isConnected) {
    return false;
  }

  return true;
};

export const checkServerConnection = async () => {
  try {
    // First check internet
    const hasInternet = await checkInternetConnection();
    if (!hasInternet) return false;

    // Add timeout (5 seconds)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(SOCKET_URL, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    return response.ok;
  } catch (error) {
    console.log("Server check failed:", error);
    return false;
  }
};