import { LoginRequest, LoginResponse } from "../types/api.types";
import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/user/signin",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user/signup",
        method: "POST",
        body,
      }),
    }),

    // /user/verify-signup-otp
    verifyOTP: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user/verify-signup-otp",
        method: "POST",
        body,
      }),
    }),

    profileInfo: builder.query<any, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOTPMutation,
  useProfileInfoQuery,
} = authApi;
