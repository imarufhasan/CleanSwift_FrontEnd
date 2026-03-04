import { create } from "zustand";

export type UserRole = "CUSTOMER" | "DRIVER";

export interface UserInfo {
  role: UserRole | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface UserInfoState extends UserInfo {
  setRole: (role: UserRole | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useUserInfo = create<UserInfoState>((set) => ({
  role: null,
  accessToken: null,
  refreshToken: null,

  setRole: (role) =>
    set(() => ({
      role,
    })),

  setTokens: (accessToken, refreshToken) =>
    set(() => ({
      accessToken,
      refreshToken,
    })),

  clearAuth: () =>
    set(() => ({
      role: null,
      accessToken: null,
      refreshToken: null,
    })),
}));