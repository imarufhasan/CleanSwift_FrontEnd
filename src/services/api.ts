import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";
import { getAccessToken } from "./storage/tokenStorage";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://10.10.20.30:6000/api/v1",
  prepareHeaders: async (headers) => {
    const token = await getAccessToken();

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