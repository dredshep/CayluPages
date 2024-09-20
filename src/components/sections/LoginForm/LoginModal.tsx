import { useState } from "react";
import { useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import bcrypt from "bcryptjs";
import InputField from "./InputField";
import Message from "./Message";
import TabNavigation from "./TabNavigation";
import { handleLogin, handleRegister, handleRecovery } from "./authUtils";

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
  const [activeTab, setActiveTab] = useState<"login" | "register" | "recovery">(
    "login"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    const emailLowerCase = data.email.toLowerCase();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(
      emailLowerCase + data.password,
      salt
    );

    if (activeTab === "login") {
      await handleLogin(data.email, hashedPassword, setErrorMessage, onClose);
    } else if (activeTab === "register") {
      if (data.password !== data.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      await handleRegister(
        data.email,
        hashedPassword,
        setErrorMessage,
        setSuccessMessage
      );
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

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Error and Success Messages */}
        <Message type="error" message={errorMessage} />
        <Message type="success" message={successMessage} />

        {/* Login or Register Forms */}
        {activeTab !== "recovery" ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Email"
              type="email"
              register={register("email", { required: "Email is required" })}
              error={errors.email?.message}
            />
            <InputField
              label="Password"
              type="password"
              register={register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={errors.password?.message}
            />

            {/* Forgot Password Link for Login Tab */}
            {activeTab === "login" && (
              <div className="text-right text-sm mb-4">
                <button
                  type="button"
                  className="text-teal-500 underline"
                  onClick={() => setActiveTab("recovery")}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {activeTab === "register" && (
              <InputField
                label="Confirm Password"
                type="password"
                register={register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                error={errors.confirmPassword?.message}
              />
            )}

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                className="mr-2"
                {...register("rememberMe")}
              />
              <span>Remember me</span>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
            >
              {activeTab === "login" ? "Login" : "Register"}
            </button>
          </form>
        ) : (
          // Password Recovery Form
          <form
            onSubmit={handleSubmit((data) =>
              handleRecovery(data.email, setErrorMessage, setSuccessMessage)
            )}
          >
            <InputField
              label="Email"
              type="email"
              register={register("email", { required: "Email is required" })}
              error={errors.email?.message}
            />
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
            >
              Send Recovery Email
            </button>
          </form>
        )}

        <div className="text-center mt-4">
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
