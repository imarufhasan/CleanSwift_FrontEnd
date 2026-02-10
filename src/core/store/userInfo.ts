import { create } from "zustand";
import { UserInfo, UserRole } from "../types/user";

interface UserInfoState extends UserInfo {
  setRole: (role: UserRole) => void;
  clearUser: () => void;
}

export const useUserInfo = create<UserInfoState>((set) => ({
  role: null,

  setRole: (role) =>
    set(() => ({
      role,
    })),

  clearUser: () =>
    set(() => ({
      role: null,
    })),
}));
