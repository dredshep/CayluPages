import { useState } from "react";
import { useForm } from "react-hook-form";
import { createPortal } from "react-dom";

interface LoginModalProps {
  onClose: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string; // For register tab only
  rememberMe: boolean;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [loginError, setLoginError] = useState<string | null>(null);

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: FormData) => {
    const emailLowerCase = data.email.toLowerCase();

    if (activeTab === "register") {
      if (data.password !== data.confirmPassword) {
        setLoginError("Passwords do not match.");
        return;
      }
      console.log("Register with:", {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
    } else {
      console.log("Login with:", {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {activeTab === "login" ? "Login" : "Register"}
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
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "register" ? "font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {loginError && (
          <div className="text-red-500 text-center mb-4">{loginError}</div>
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

          {activeTab === "register" && (
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
          )}

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2"
              {...register("rememberMe")}
            />
            <span>Remember me</span>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
            >
              {activeTab === "login" ? "Login" : "Register"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              console.log("Proceed without account");
              // Logic to proceed without an account
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
