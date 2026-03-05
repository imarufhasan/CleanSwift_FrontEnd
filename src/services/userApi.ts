import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
    }),

    updateProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user/update",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;
