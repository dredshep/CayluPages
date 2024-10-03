import api from "./api";

import { LoginResponse } from "@/pages/api/auth/login";
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.response) {
      console.error("Error response:", error.response);
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.response.data.error);
      }
    } else if (error.request) {
      console.error("Error request:", error.request);
      throw new Error("No response received from server");
    } else {
      console.error("Error message:", error.message);
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  dni: string
) => {
  try {
    const response = await api.post("/auth/register", {
      email,
      password,
      name,
      dni,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

export const recoverPassword = async (email: string) => {
  try {
    const response = await api.post("/auth/recover", { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
