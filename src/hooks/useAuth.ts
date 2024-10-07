import { useEffect, useState } from "react";
import { loginUser, recoverPassword, registerUser } from "../utils/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/types/auth/CustomJwtPayload";

const useAuth = () => {
  const { user, login: storeLogin, logout: storeLogout } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // console.log({ user });
      checkAdminStatus(user.id);
    } else {
      setIsAdmin(false);
      setToken(null);
    }
  }, [user]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/role`);
      const data = await response.json();
      setIsAdmin(data.role === "Admin");
    } catch (err) {
      console.error("Error checking admin status:", err);
      setIsAdmin(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(email, password);
      const { token } = data;
      const id = extractIdFromToken(token);
      const name = data.user.name;
      storeLogin({
        id: id.toString(),
        email,
        name,
        email_verified_at: data.user.email_verified_at,
      });
      setToken(token);
      await checkAdminStatus(id.toString());
      setLoading(false);
      return data;
    } catch (err: any) {
      console.error("Login error in useAuth:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    dni: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(email, password, name, dni);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(`${err.message}`);
      setLoading(false);
      throw err;
    }
  };

  const recover = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recoverPassword(email);
      setLoading(false);
      return data;
    } catch (err) {
      setError("Password recovery failed");
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    // Call logout API if needed
    storeLogout();
    setToken(null);
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    recover,
    loading,
    error,
    isAdmin,
    token,
  };
};

// Helper function to extract id from JWT token
const extractIdFromToken = (token: string): string => {
  try {
    const payload = jwtDecode<CustomJwtPayload>(token);
    return payload.id || "";
  } catch (e) {
    console.error("Failed to extract id from token:", e);
    return "";
  }
};

export default useAuth;
