import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authApi } from "../api/authApi";

import type { User, LoginPayload, RegisterPayload } from "../types/auth";

// 1. Định nghĩa dữ liệu mà AuthContext cung cấp
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

// 2. Tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. AuthProvider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // 4. Đăng nhập
  const login = async (payload: LoginPayload) => {
    const response = await authApi.login(payload);

    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
  };

  // 5. Đăng ký
  const register = async (payload: RegisterPayload) => {
    await authApi.register(payload);
  };

  // 6. Đăng xuất
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  // 7. Khôi phục phiên đăng nhập khi reload
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const refreshResponse = await authApi.refresh();

        const token = refreshResponse.data.accessToken;

        const meResponse = await authApi.me(token);

        if (!active) return;

        setAccessToken(token);
        setUser(meResponse.data);
      } catch {
        if (!active) return;

        setAccessToken(null);
        setUser(null);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: Boolean(user && accessToken),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 8. Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
