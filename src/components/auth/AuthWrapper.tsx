import { useEffect, useRef, useState } from "react";
import LoginModal from "../sections/LoginForm/LoginModal";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { openModal } = useLoginModalStore();
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();
  const hasHandledForceLogin = useRef(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const lastUrlRef = useRef("");

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
        hasHandledForceLogin.current = true;
        if (isAuthenticated) {
          logout();
        }
        openModal("login");
      }
    } catch (error) {
      console.error("Invalid URL:", currentUrl);
    }
  }, [currentUrl, isAuthenticated, logout, openModal]);

  return (
    <>
      {children}
      <LoginModal onClose={() => {}} />
    </>
  );
}
