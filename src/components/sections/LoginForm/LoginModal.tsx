import { useState, useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { createPortal } from "react-dom";
import InputField from "./InputField";
import Message from "./Message";
import TabNavigation from "./TabNavigation";
import useAuth from "@/hooks/useAuth";
import { handleRecovery } from "./authUtils";

interface LoginModalProps {
  onClose: () => void;
  initialActiveTab?: "login" | "register" | "recovery";
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string; // For register tab only
  rememberMe: boolean;
}

export default function LoginModal({
  onClose,
  initialActiveTab = "login",
}: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "recovery">(
    initialActiveTab
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { loading, error, login, register, recover } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
    reset,
    getValues,
  } = useForm<FormData>();

  const password = watch("password");

  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const handleTabChange = (tab: "login" | "register" | "recovery") => {
    const currentEmail = getValues("email");
    setActiveTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
    clearErrors();
    reset({ email: currentEmail }); // Reset form but keep the email
  };

  const onSubmit = async (data: FormData) => {
    const emailLowerCase = data.email.toLowerCase();
    setInvalidCredentials(false);

    try {
      if (activeTab === "register") {
        if (data.password !== data.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        await register(emailLowerCase, data.password, data.name);
        setSuccessMessage(
          "Registration successful. Please check your email to verify your account."
        );
      } else if (activeTab === "login") {
        const response = await login(emailLowerCase, data.password);
        if (response.token) {
          document.cookie = `auth_token=${response.token}; path=/; secure; samesite=strict`;
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
        }
      } else {
        if (err.message === "Invalid credentials.") {
          setInvalidCredentials(true);
          setErrorMessage(
            "Invalid credentials. Please check your email and password."
          );
        } else {
          console.error("Submit error in LoginModal:", err);
          setErrorMessage(err.message || "An unexpected error occurred");
        }
      }
    }
  };

  // Clear invalid credentials state when switching tabs
  useEffect(() => {
    setInvalidCredentials(false);
  }, [activeTab]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {activeTab === "login"
              ? "Login"
              : activeTab === "register"
              ? "Register"
              : "Password Recovery"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            X
          </button>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Error and Success Messages */}
        {/* <Message type="error" message={errorMessage} /> */}
        <Message type="success" message={successMessage} />

        {/* Login or Register Forms */}
        {activeTab !== "recovery" ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Email"
              type="email"
              register={registerField("email", {
                required: "Email is required",
              })}
              error={errors.email?.message}
              className={invalidCredentials ? "border-red-500" : ""}
            />
            <InputField
              label="Password"
              type="password"
              register={registerField("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={errors.password?.message}
              className={invalidCredentials ? "border-red-500" : ""}
            />
            {invalidCredentials && (
              <p className="text-red-500 text-sm mt-2 mb-4">
                Invalid credentials. Please check your email and password.
              </p>
            )}

            {activeTab === "register" && (
              <InputField
                label="Name"
                type="text"
                register={registerField("name", {
                  required: "Name is required",
                })}
                error={errors.name?.message}
              />
            )}

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
                register={registerField("confirmPassword", {
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
                {...registerField("rememberMe")}
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
              register={registerField("email", {
                required: "Email is required",
              })}
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
