import { create } from "zustand";

interface LoginModalState {
  isOpen: boolean;
  activeTab: "login" | "register" | "recovery";
  openModal: (tab?: "login" | "register" | "recovery") => void;
  closeModal: () => void;
  setActiveTab: (tab: "login" | "register" | "recovery") => void;
}

export const useLoginModalStore = create<LoginModalState>((set) => ({
  isOpen: false,
  activeTab: "login",
  openModal: (tab = "login") => set({ isOpen: true, activeTab: tab }),
  closeModal: () => set({ isOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
