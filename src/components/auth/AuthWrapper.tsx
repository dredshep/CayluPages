import { useEffect, useRef, useState } from "react";
import LoginModal from "../sections/LoginForm/LoginModal";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import useAuth from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { CustomJwtPayload } from "@/types/auth/CustomJwtPayload";
import { jwtDecode } from "jwt-decode";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { openModal } = useLoginModalStore();
  const { logout, isAuthenticated } = useAuth();
  const hasHandledForceLogin = useRef(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const lastUrlRef = useRef("");

  const { isTokenValid, getToken } = useAuthStore();

  useEffect(() => {
    const handleUrlChange = () => {
      const newUrl = window.location.href;
      if (newUrl !== lastUrlRef.current) {
        lastUrlRef.current = newUrl;
        setCurrentUrl(newUrl);
      }
    };

    // Handle the initial URL
    handleUrlChange();

    // Listen for popstate events (back/forward navigation)
    window.addEventListener("popstate", handleUrlChange);

    // Create a MutationObserver to detect changes in the URL
    const observer = new MutationObserver(handleUrlChange);
    observer.observe(document.querySelector("body")!, {
      subtree: true,
      childList: true,
    });

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!currentUrl) return;

    try {
      const url = new URL(currentUrl);
      const forceLogin = url.searchParams.get("forcelogin");

      if (forceLogin === "true" && !hasHandledForceLogin.current) {
        const token = getToken();

        if (token) {
          const decoded = jwtDecode<CustomJwtPayload>(token);
        }

        if (token && isTokenValid()) {
          hasHandledForceLogin.current = true;
          url.searchParams.delete("forcelogin");
          window.history.replaceState({}, "", url.toString());
        } else {
          if (isAuthenticated) {
            logout();
          }
          openModal("login");
          hasHandledForceLogin.current = true;
        }
      }
    } catch (error) {
      console.error("Invalid URL or token:", error);
    }
  }, [currentUrl, isAuthenticated, logout, openModal, getToken, isTokenValid]);

  return (
    <>
      {children}
      <LoginModal onClose={() => {}} />
    </>
  );
}
