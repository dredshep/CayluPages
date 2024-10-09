import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api from "@/utils/api";
import { useAuthStore } from "./useAuthStore";

interface UserAddress {
  id: number;
  address: string;
  lat: number;
  lng: number;
}

interface UserState {
  addresses: UserAddress[];
  selectedAddressId: number | null;
  setAddresses: (addresses: UserAddress[]) => void;
  setSelectedAddressId: (id: number | null) => void;
  fetchAddresses: () => Promise<void>;
  createAddress: (address: Omit<UserAddress, "id">) => Promise<void>;
  updateAddress: (address: UserAddress) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      addresses: [],
      selectedAddressId: null,
      setAddresses: (addresses) => set({ addresses }),
      setSelectedAddressId: (id) => set({ selectedAddressId: id }),
      fetchAddresses: async () => {
        try {
          // check if user is authenticated
          const { token } = useAuthStore.getState();
          if (!token) {
            throw new Error("User is not authenticated");
          }

          const response = await api.get("/user/address");
          set({ addresses: response.data });
        } catch (error) {
          console.error("Error fetching user addresses:", error);
        }
      },
      createAddress: async (address) => {
        try {
          const response = await api.post("/user/address", address);
          const newAddress = response.data;
          set((state) => ({ addresses: [...state.addresses, newAddress] }));
        } catch (error) {
          console.error("Error creating user address:", error);
          throw error;
        }
      },
      updateAddress: async (address) => {
        try {
          await api.put(`/user/address`, address);
          set((state) => ({
            addresses: state.addresses.map((a) =>
              a.id === address.id ? address : a
            ),
          }));
        } catch (error) {
          console.error("Error updating user address:", error);
          throw error;
        }
      },
      deleteAddress: async (id) => {
        try {
          await api.delete(`/user/address`, { data: { id } });
          set((state) => ({
            addresses: state.addresses.filter((a) => a.id !== id),
            selectedAddressId: state.selectedAddressId === id
              ? null
              : state.selectedAddressId,
          }));
        } catch (error) {
          console.error("Error deleting user address:", error);
          throw error;
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
