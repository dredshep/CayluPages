// authUtils.ts
import { useAuthStore, User } from "@/store/useAuthStore";

export async function handleLogin(
  email: string,
  password: string,
  setError: Function,
  onSuccess: Function
) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data: { user: User; token: string } = await response.json();
      useAuthStore.getState().login(data.user, data.token);
      onSuccess();
    } else {
      const errorData = await response.json();
      setError(errorData.error || "Login failed");
    }
  } catch (error) {
    setError("An error occurred during login");
  }
}

export async function handleRegister(
  email: string,
  password: string,
  setError: Function,
  setSuccess: Function
) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setSuccess("Registration successful! Check your email for verification.");
    } else {
      const errorData = await response.json();
      setError(errorData.error || "Registration failed.");
    }
  } catch (error) {
    setError("An error occurred during registration.");
  }
}

export async function handleRecovery(
  email: string,
  setError: Function,
  setSuccess: Function
) {
  try {
    const response = await fetch("/api/auth/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setSuccess("Recovery email sent. Please check your inbox.");
    } else {
      const errorData = await response.json();
      setError(errorData.error || "Failed to send recovery email.");
    }
  } catch (error) {
    setError("An error occurred while sending the recovery email.");
  }
}
