import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import debounce from "lodash/debounce";
import { useAuthStore } from "../store/useAuthStore";
import { CustomJwtPayload } from "../types/auth/CustomJwtPayload";
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const debouncedRefresh = debounce(
  async () => {
    if (isRefreshing) return refreshPromise;

    isRefreshing = true;
    refreshPromise = axios
      .post("/api/auth/refresh", {}, { withCredentials: true })
      .then((response) => {
        isRefreshing = false;
        refreshPromise = null;
        if (response.data.token) {
          const payload = jwtDecode<CustomJwtPayload>(response.data.token);
          const id = payload.id || "";
          useAuthStore.getState().login({
            id,
            email: payload.email || "",
            name: payload.name || "",
            email_verified_at: payload.email_verified_at
              ? new Date(payload.email_verified_at)
              : null,
          });
        }
      })
      .catch((error) => {
        console.error("Failed to refresh token:", error);
        isRefreshing = false;
        refreshPromise = null;
        useAuthStore.getState().logout();

        // Check if forcelogin is already in the URL
        const url = new URL(window.location.href);
        if (!url.searchParams.has("forcelogin")) {
          // Add forcelogin=true and reload only if it's not already present
          url.searchParams.set("forcelogin", "true");
          window.location.href = url.toString();
        }
      });

    return refreshPromise;
  },
  1000,
  { leading: true, trailing: false }
);

api.interceptors.request.use(
  async (config) => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)auth_token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (token) {
      const decodedToken = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime + 300) {
        // 5 minutes before expiration
        await debouncedRefresh();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to extract id from JWT token (same as in useAuth.ts)
const extractIdFromToken = (token: string): string => {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return payload.sub || "";
  } catch (e) {
    console.error("Failed to extract id from token:", e);
    return "";
  }
};

export default api;
