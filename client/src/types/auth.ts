export interface User {
  id: string;
  name: string | null;
  email: string;
  createdAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface LoginData {
  user: User;
  accessToken: string;
}
