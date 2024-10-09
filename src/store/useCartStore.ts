import { create } from "zustand";
import { CartProduct } from "@/types/CartProduct";

interface CartStore {
  cart: {
    company_id: string;
    products: CartProduct[];
  };
  clearCart: () => void;
  calculateProductTotal: (product: CartProduct) => number;
  calculateRestaurantTotal: () => number;
  calculateTotalWithTaxes: (deliveryFee: number) => {
    total: number;
    foodIVA: number;
    deliveryIVA: number;
  };
}

export const useCartStore2 = create<CartStore>((set, get) => ({
  cart: {
    company_id: "",
    products: [],
  },
  clearCart: () => set({ cart: { company_id: "", products: [] } }),
  calculateProductTotal: (product: CartProduct) => {
    const basePrice = product.price * product.quantity;
    const additionalsPrice = product.additionals?.reduce(
      (sum, additional) =>
        sum + Number(additional.price) * (additional.quantity || 0),
      0,
    ) || 0;
    return basePrice + additionalsPrice;
  },
  calculateRestaurantTotal: () => {
    const { cart, calculateProductTotal } = get();
    return cart.products.reduce(
      (sum, product) => sum + calculateProductTotal(product),
      0,
    );
  },
  calculateTotalWithTaxes: (deliveryFee: number) => {
    const { calculateRestaurantTotal } = get();
    const restaurantTotal = calculateRestaurantTotal();
    const taxableAmount = restaurantTotal + deliveryFee;
    const foodIVA = restaurantTotal * 0.1;
    const deliveryIVA = deliveryFee * 0.21;
    const totalIVA = foodIVA + deliveryIVA;
    const total = taxableAmount + totalIVA;
    return { total, foodIVA, deliveryIVA };
  },
}));
