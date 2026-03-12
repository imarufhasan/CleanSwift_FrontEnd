import { create } from "zustand";

export type UserRole = "CUSTOMER" | "DRIVER";

export interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
  image: string;
  role: UserRole;
  address?: string;
}

export interface UserInfo {
  role: UserRole | null;
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: User | null;
}

interface UserInfoState extends UserInfo {
  setRole: (role: UserRole | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUserInfo: (user: User) => void;
  clearAuth: () => void;
}

export const useUserInfo = create<UserInfoState>((set) => ({
  role: null,
  accessToken: null,
  refreshToken: null,
  userInfo: null,

  setRole: (role) =>
    set(() => ({
      role,
    })),

  setTokens: (accessToken, refreshToken) =>
    set(() => ({
      accessToken,
      refreshToken,
    })),

  setUserInfo: (user) =>
    set(() => ({
      userInfo: user,
      role: user.role,
    })),

  clearAuth: () =>
    set(() => ({
      role: null,
      accessToken: null,
      refreshToken: null,
      userInfo: null,
    })),
}));
