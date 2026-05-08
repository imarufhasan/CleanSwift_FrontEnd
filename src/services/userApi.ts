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
    // {{baseUrl}}/user/change-password
    changePassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user/change-password",
        method: "PATCH",
        body,
      }),
    }),
    // {{baseUrl}}/user/update-profile-photo
    updateProfilePhoto: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/user/update-profile-photo",
        method: "PUT",
        body: formData,
      }),
    }),

    //{{baseUrl}}/user/update-user-data
    updateUserData: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user/update-user-data",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUpdateProfilePhotoMutation,
  useUpdateUserDataMutation,
} = userApi;
