import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ACCESS_KEY, getAccessToken } from "./storage/tokenStorage";
import { BASE_URL } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";


const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  timeout: 15000,
});

const baseQueryWithToken = async (args: any, api: any, extraOptions: any) => {
  const token = await AsyncStorage.getItem(ACCESS_KEY);
  if (args.headers) {
    args.headers.Authorization = `Bearer ${token}`;
  } else {
    args.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return baseQuery(args, api, extraOptions);
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithToken,
  tagTypes: ["User", "Order", "Location"],
  endpoints: () => ({}),
});
