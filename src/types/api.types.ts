// types/auth.ts
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      _id: string;
      name: string;
      phone: string;
      email: string;
      image: string;
      role: string;
    };
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}