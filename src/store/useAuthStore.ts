import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: null | {
    id: string;
    email: string;
    name: string;
    email_verified_at: Date | null;
  };
  isAuthenticated: boolean;
  login: (user: AuthState["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        // Remove the JWT token from cookies
        document.cookie =
          "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Clear the user state
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
