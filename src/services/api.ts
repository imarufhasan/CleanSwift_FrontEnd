import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ACCESS_KEY, REFRESH_KEY } from './storage/tokenStorage';
import { BASE_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  timeout: 15000,
});

const baseQueryWithToken = async (args: any, api: any, extraOptions: any) => {
  const token = await AsyncStorage.getItem(ACCESS_KEY);
  const requestArgs = typeof args === 'string' ? { url: args } : { ...args };

  if (token) {
    requestArgs.headers = {
      ...(requestArgs.headers ?? {}),
      Authorization: `Bearer ${token}`,
    };
  }

  let result = await baseQuery(requestArgs, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = await AsyncStorage.getItem(REFRESH_KEY);

    if (refreshToken) {
      const refreshResult: any = await baseQuery(
        {
          url: '/user/access-token',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
        api,
        extraOptions,
      );

      const nextAccessToken = refreshResult?.data?.data?.accessToken;

      if (nextAccessToken) {
        await AsyncStorage.setItem(ACCESS_KEY, nextAccessToken);
        requestArgs.headers = {
          ...(requestArgs.headers ?? {}),
          Authorization: `Bearer ${nextAccessToken}`,
        };
        result = await baseQuery(requestArgs, api, extraOptions);
      }
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithToken,
  tagTypes: ['User', 'Order', 'Driver', 'Location', 'Pricing', 'Page', 'Chat', 'Payment'],
  endpoints: () => ({}),
});
