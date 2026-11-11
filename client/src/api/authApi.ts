import axiosClient from "./axiosClient";

import type {
  User,
  LoginPayload,
  RegisterPayload,
  ApiResponse,
  LoginData,
} from "../types/auth";

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const response = await axiosClient.post<ApiResponse<User>>(
      "/auth/register",
      payload,
    );

    return response.data;
  },

  login: async (payload: LoginPayload) => {
    const response = await axiosClient.post<ApiResponse<LoginData>>(
      "/auth/login",
      payload,
    );

    return response.data;
  },

  refresh: async () => {
    const response =
      await axiosClient.post<ApiResponse<{ accessToken: string }>>(
        "/auth/refresh",
      );

    return response.data;
  },

  me: async (accessToken: string) => {
    const response = await axiosClient.get<ApiResponse<User>>("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post<ApiResponse<null>>("/auth/logout");

    return response.data;
  },
};
