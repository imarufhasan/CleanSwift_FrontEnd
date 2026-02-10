export type UserRole = "customer" | "driver" | "admin" | null;

export interface UserInfo {
  role: UserRole;
}
