import { api } from "./api";

type DriverProfileBody = {
  data: {
    insuranceProvider: string;
    insurancePolicyNumber: string;
    insuranceExpiration: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    vehiclePlate: string;
    role: string;
  };
  license?: any;
  selfie?: any;
  insuranceDocument?: any;
};

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
   
    // {{baseUrl}}/user/change-password
    changePassword: builder.mutation<any, any>({
      query: (body) => {
        console.log("🔥 changePassword API called with body: ", body);
        return {
          url: "/user/change-password",
          method: "PATCH",
          body,
        };
      },
    }),
    // {{baseUrl}}/user/update-profile-photo
    updateProfilePhoto: builder.mutation<any, FormData>({
      query: (formData) => {
        console.log(
          "🔥 updateProfilePhoto API called with formData: ",
          formData,
        );
        return {
          url: "/user/update-profile-photo",
          method: "PUT",
          body: formData,
        };
      },
    }),

    //{{baseUrl}}/user/update-user-data
    updateUserData: builder.mutation<any, any>({
      query: (body) => {
        console.log("🔥 updateUserData API called with body: ", body);
        return {
          url: "/user/update-user-data",
          method: "PATCH",
          body,
        };
      },
    }),

    profileInfo: builder.query<any, void>({
      query: () => {
        console.log("🔥 profileInfo API fetching...");

        return {
          url: "/user/profile",
          method: "GET",
        };
      },
    }),

    ///user/create-driver-profile
    createDriverProfile: builder.mutation<any, DriverProfileBody>({
      query: ({ data, license, selfie, insuranceDocument }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        if (license) {
          formData.append("license", license);
        }
        if (selfie) {
          formData.append("selfie", selfie);
        }
        if (insuranceDocument) {
          formData.append("insuranceDocument", insuranceDocument);
        }
        return {
          url: "/user/create-driver-profile",
          method: "POST",
          body: formData,
        };
      },
    }),

    //{{baseUrl}}/user/create-driver-profile
  }),
});

export const {
  useChangePasswordMutation,
  useUpdateProfilePhotoMutation,
  useUpdateUserDataMutation,
  useProfileInfoQuery,
  useCreateDriverProfileMutation,
} = userApi;
