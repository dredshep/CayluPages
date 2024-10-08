import { useState } from "react";
import { useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import useAuth from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";

interface LoginModalProps {
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
  dni?: string;
  rememberMe: boolean;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "recovery">(
    "login"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const { login, register: registerUser, recover } = useAuth();
  const setUser = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>();

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    const emailLowerCase = data.email.toLowerCase();
    setInvalidCredentials(false);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (activeTab === "register") {
        if (data.password !== data.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        await registerUser(
          emailLowerCase,
          data.password,
          data.name || "",
          data.dni || ""
        );
        setSuccessMessage(
          "Registration successful. Please check your email to verify your account."
        );
      } else if (activeTab === "login") {
        const response = await login(emailLowerCase, data.password);
        if (response.token) {
          document.cookie = `auth_token=${response.token}; path=/; secure; samesite=strict`;
          setUser(
            {
              id: response.user.id.toString(),
              email: response.user.email,
              name: response.user.name,
              email_verified_at: response.user.email_verified_at,
            },
            response.token
          );
          onClose();
        }
      } else if (activeTab === "recovery") {
        await recover(emailLowerCase);
        setSuccessMessage("Recovery email sent. Please check your inbox.");
      }
    } catch (err: any) {
      if (activeTab === "register") {
        if (err.message === "User already exists") {
          setError("email", {
            type: "manual",
            message: "Email is already taken. Do you want to login instead?",
          });
        } else {
          setErrorMessage(
            err.message || "An error occurred during registration."
          );
        }
      } else if (activeTab === "login") {
        if (err.message === "Invalid credentials.") {
          setInvalidCredentials(true);
          setErrorMessage(
            "Invalid credentials. Please check your email and password."
          );
        } else {
          setErrorMessage(err.message || "An error occurred during login.");
        }
      } else {
        setErrorMessage(
          err.message || "An error occurred during password recovery."
        );
      }
    }
  };

  const handleTabChange = (tab: "login" | "register" | "recovery") => {
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
    clearErrors();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {activeTab === "login"
              ? "Login"
              : activeTab === "register"
              ? "Register"
              : "Recover Password"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            X
          </button>
        </div>

        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "login" ? "font-bold" : "text-gray-500"
            }`}
            onClick={() => handleTabChange("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "register" ? "font-bold" : "text-gray-500"
            }`}
            onClick={() => handleTabChange("register")}
          >
            Register
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "recovery" ? "font-bold" : "text-gray-500"
            }`}
            onClick={() => handleTabChange("recovery")}
          >
            Recover
          </button>
        </div>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {successMessage && (
          <div className="text-green-500 text-center mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          {activeTab !== "recovery" && (
            <div className="mb-4">
              <label className="block mb-1">Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>
          )}

          {activeTab === "register" && (
            <>
              <div className="mb-4">
                <label className="block mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <span className="text-red-500">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>
            </>
          )}

          {activeTab === "login" && (
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                className="mr-2"
                {...register("rememberMe")}
              />
              <span>Remember me</span>
            </div>
          )}

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
            >
              {activeTab === "login"
                ? "Login"
                : activeTab === "register"
                ? "Register"
                : "Send Recovery Email"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              console.log("Proceed without account");
              onClose();
            }}
            className="text-teal-500 underline"
          >
            Proceed without an account
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
