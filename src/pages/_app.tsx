import { useEffect } from "react";
import Footer from "@/components/sections/Footer";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Noto_Sans } from "next/font/google";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/utils/api";
import { appWithTranslation } from "next-i18next";
import AuthWrapper from "@/components/auth/AuthWrapper";
const noto = Noto_Sans({ subsets: ["latin"] });
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App({ Component, pageProps }: AppProps) {
  const { token } = useAuthStore();
  useEffect(() => {
    if (token) {
      const initializeAuth = async () => {
        try {
          const response = await api.get("/auth/me");
          if (response.data.user) {
            useAuthStore.getState().login(
              {
                id: response.data.user.id,
                email: response.data.user.email,
                name: response.data.user.name,
                email_verified_at: response.data.user.email_verified_at,
              },
              response.data.token
            );
          }
        } catch (error) {
          console.error("Failed to initialize auth:", error);
        }
      };

      initializeAuth();
    } else {
      useAuthStore.getState().logout();
    }
  }, []);

  return (
    <main className={noto.className}>
      <AuthWrapper>
        <Component {...pageProps} />
      </AuthWrapper>
      <Footer />
      <ToastContainer position="bottom-right" />
    </main>
  );
}

export default appWithTranslation(App);
