import { useState } from "react";
import { loginUser, registerUser, recoverPassword } from "../utils/authApi";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(email, password);
      setLoading(false);
      return data;
    } catch (err: any) {
      console.error("Login error in useAuth:", err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(email, password);
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

  return { loading, error, login, register, recover };
};

export default useAuth;
