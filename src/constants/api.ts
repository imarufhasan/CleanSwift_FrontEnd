// src/constants/api.ts
export const BASE_URL = "http://10.10.20.30:7007/api/v1";
export const SOCKET_URL = BASE_URL.replace(/\/api\/v1$/, "");
export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
