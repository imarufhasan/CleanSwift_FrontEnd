import * as SecureStore from "expo-secure-store";

export const ACCESS_KEY = "accessToken";
export const REFRESH_KEY = "refreshToken";
export const ROLE = "role";
export const USER = "user";

export const setTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
};
export const setRole = async (role: string) => {
  await SecureStore.setItemAsync(ROLE, role);
};

export const getRole = async () => {
  return await SecureStore.getItemAsync(ROLE);
};
export const getAccessToken = async () => {
  return await SecureStore.getItemAsync(ACCESS_KEY);
};

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync(REFRESH_KEY);
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
};
