import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY, getAccessToken } from "./storage/tokenStorage";
import { BASE_URL } from "../constants/api";
import { useUserInfo } from "../core/store/userInfo";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    //const token = getAccessToken();
    const token = await SecureStore.getItemAsync(ACCESS_KEY);
    // const token = useUserInfo.getState().accessToken;

    console.log("api call token: ", token);
    console.log("headers: ", headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Order", "Location"],
  endpoints: () => ({}),
});
