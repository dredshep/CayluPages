import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";
import { CustomJwtPayload } from "@/types/auth/CustomJwtPayload";

interface AuthState {
  user: null | {
    id: string;
    email: string;
    name: string;
    email_verified_at: Date | null;
  };
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthState["user"], token: string) => void;
  logout: () => void;
  getToken: () => string | null;
  isTokenValid: () => boolean;
  refreshToken: () => Promise<void>;
  setToken: (token: string) => void;
}

export type User = AuthState["user"];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
        // Store the token in a secure cookie
        document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;
      },
      logout: () => {
        // Remove the JWT token from cookies
        document.cookie =
          "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Clear the user state
        set({ user: null, token: null, isAuthenticated: false });
      },
      getToken: () => get().token,
      isTokenValid: () => {
        const token = get().token;
        if (!token) return false;

        try {
          const decoded = jwtDecode<CustomJwtPayload>(token);
          const currentTime = Date.now() / 1000;
          return typeof decoded.exp === "number" && decoded.exp > currentTime;
        } catch (error) {
          console.error("Error decoding token:", error);
          return false;
        }
      },
      refreshToken: async () => {
        try {
          const response = await api.post("/auth/refresh");
          const { token } = response.data;
          const decoded = jwtDecode<CustomJwtPayload>(token);

          if (!decoded.id || !decoded.email || !decoded.name) {
            throw new Error("Invalid token payload");
          }

          set({
            token,
            user: {
              id: decoded.id,
              email: decoded.email,
              name: decoded.name,
              email_verified_at: decoded.email_verified_at
                ? new Date(decoded.email_verified_at)
                : null,
            },
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Error refreshing token:", error);
          get().logout();
        }
      },
      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
