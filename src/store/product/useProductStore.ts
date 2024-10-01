import { create } from "zustand";
import { ApiCompany, ApiProduct } from "@/pages/api/companies/[id]";
import moment from "moment";
import api from "@/utils/api";
import {
  AvailabilityResult,
  CheckAvailabilityResponse,
} from "@/pages/api/products/check-availability";

interface ProductHour {
  weekday: number;
  start_time: string;
  end_time: string;
}

interface ProductWithAvailability extends ApiProduct {
  isAvailable: boolean;
  productHours: ProductHour[];
}

interface ProductState {
  products: Record<number, ProductWithAvailability[]>;
  fetchProducts: (companyId: number) => Promise<void>;
  checkAvailability: (
    companyId: number,
    currentTime?: moment.Moment
  ) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: {},
  fetchProducts: async (companyId: number) => {
    const response = await api.get(`/companies/${companyId}`);
    const products = (response.data as ApiCompany).products;

    const productsWithAvailability: ProductWithAvailability[] = products.map(
      (product) => ({
        ...product,
        isAvailable: true,
        productHours: [],
      })
    );

    set((state) => ({
      products: { ...state.products, [companyId]: productsWithAvailability },
    }));

    // Check availability after fetching
    await get().checkAvailability(companyId);
  },
  checkAvailability: async (companyId: number, currentTime = moment()) => {
    const companyProducts = get().products[companyId];
    if (!companyProducts) return; // No products for this company

    try {
      const response = await api.post("/products/check-availability", {
        companyId,
        productIds: companyProducts.map((product) => product.id),
        currentTime: currentTime.toISOString(),
      });

      const availabilityData = response.data as CheckAvailabilityResponse;

      set((state) => {
        const updatedProducts = companyProducts.map((product) => ({
          ...product,
          isAvailable: availabilityData[product.id].isAvailable || false,
          productHours: availabilityData[product.id].productHours || [],
        }));

        return {
          products: { ...state.products, [companyId]: updatedProducts },
        };
      });
    } catch (error) {
      console.error("Failed to check product availability:", error);
    }
  },
}));
