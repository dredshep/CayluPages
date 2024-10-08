import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/utils/api";

interface UserAddress {
  address: string;
  lat: number;
  lng: number;
}

interface UserState {
  address: UserAddress | null;
  setAddress: (address: UserAddress) => void;
  fetchAddress: () => Promise<void>;
  updateAddress: (address: UserAddress) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      address: null,
      setAddress: (address) => set({ address }),
      fetchAddress: async () => {
        try {
          const response = await api.get("/user/address");
          set({ address: response.data });
        } catch (error) {
          console.error("Error fetching user address:", error);
        }
      },
      updateAddress: async (address) => {
        try {
          await api.put("/user/address", address);
          set({ address });
        } catch (error) {
          console.error("Error updating user address:", error);
          throw error;
        }
      },
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage,
    }
  )
);
