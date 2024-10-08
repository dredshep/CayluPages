import { useState, useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { createPortal } from "react-dom";
import InputField from "./InputField";
import Message from "./Message";
import TabNavigation from "./TabNavigation";
import useAuth from "@/hooks/useAuth";
import { handleRecovery } from "./authUtils";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { useAuthStore } from "@/store/useAuthStore";

interface LoginModalProps {
  onClose: () => void;
  initialActiveTab?: "login" | "register" | "recovery";
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string; // For register tab only
  dni: string; // Now optional
  rememberMe: boolean;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const {
    isOpen,
    activeTab,
    closeModal: closeModalStore,
    setActiveTab,
  } = useLoginModalStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { loading, error, login, register, recover } = useAuth();
  const { login: storeLogin } = useAuthStore();

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
    reset({ email: currentEmail });
  };

  const onSubmit = async (data: FormData) => {
    const emailLowerCase = data.email.toLowerCase();
    setInvalidCredentials(false);

    try {
      if (activeTab === "register") {
        if (data.password !== data.confirmPassword) {
          throw new Error("Las contraseñas no coinciden.");
        }
        await register(emailLowerCase, data.password, data.name, data.dni);
        setSuccessMessage(
          "Registro exitoso. Por favor, revisa tu correo electrónico para verificar tu cuenta."
        );
      } else if (activeTab === "login") {
        const response = await login(emailLowerCase, data.password);
        if (response.token) {
          document.cookie = `auth_token=${response.token}; path=/; secure; samesite=strict`;
          storeLogin(
            {
              id: response.user.id.toString(),
              email: response.user.email,
              name: response.user.name,
              email_verified_at: response.user.email_verified_at,
            },
            response.token
          );
          closeModal(); // Use the new closeModal function
        }
      } else if (activeTab === "recovery") {
        await recover(emailLowerCase);
        setSuccessMessage(
          "Correo de recuperación enviado. Por favor, revisa tu bandeja de entrada."
        );
      }
    } catch (err: any) {
      if (activeTab === "register") {
        if (err.message === "User already exists") {
          setError("email", {
            type: "manual",
            message:
              "El correo electrónico ya está registrado. ¿Quieres iniciar sesión en su lugar?",
          });
        }
      } else {
        if (err.message === "Invalid credentials.") {
          setInvalidCredentials(true);
          setErrorMessage(
            "Credenciales inválidas. Por favor, verifica tu correo electrónico y contraseña."
          );
        } else {
          console.error("Error en el envío en LoginModal:", err);
          setErrorMessage(err.message || "Ha ocurrido un error inesperado");
        }
      }
    }
  };

  const closeModal = () => {
    reset(); // Reset the form
    closeModalStore(); // Close the modal using the store function
  };

  useEffect(() => {
    if (!isOpen) {
      reset(); // Reset the form when the modal closes
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {activeTab === "login"
              ? "Iniciar sesión"
              : activeTab === "register"
              ? "Registro"
              : "Recuperar contraseña"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={closeModal} // Use the new closeModal function
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
              label="Correo electrónico"
              type="email"
              register={registerField("email", {
                required: "Es obligatorio introducir un correo electrónico",
              })}
              error={errors.email?.message}
              className={invalidCredentials ? "border-red-500" : ""}
            />
            <InputField
              label="Contraseña"
              type="password"
              register={registerField("password", {
                required: "Es obligatorio introducir una contraseña",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
              error={errors.password?.message}
              className={invalidCredentials ? "border-red-500" : ""}
            />
            {invalidCredentials && (
              <p className="text-red-500 text-sm mt-2 mb-4">
                Credenciales inválidas. Por favor, verifica tu correo
                electrónico y contraseña.
              </p>
            )}

            {activeTab === "register" && (
              <>
                <InputField
                  label="Nombre"
                  type="text"
                  register={registerField("name", {
                    required: "Es obligatorio introducir un nombre",
                  })}
                  error={errors.name?.message}
                />
                <InputField
                  label="DNI o NIE"
                  type="text"
                  register={registerField("dni", {
                    required: "Es obligatorio introducir un DNI o NIE",
                    pattern: {
                      value: /^[xyzXYZ]?([0-9]{7,8})([a-zA-Z])$/,
                      message: "El formato del DNI o NIE es incorrecto",
                    },
                  })}
                  error={errors.dni?.message}
                />
                <InputField
                  label="Confirmar contraseña"
                  type="password"
                  register={registerField("confirmPassword", {
                    required: "Es obligatorio confirmar la contraseña",
                    validate: (value) =>
                      value === password || "Las contraseñas no coinciden",
                  })}
                  error={errors.confirmPassword?.message}
                />
              </>
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
