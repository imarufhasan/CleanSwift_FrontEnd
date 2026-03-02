import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
} = userApi;