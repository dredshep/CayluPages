import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartProduct = {
  p_id: number;
  price: number;
  currency: string;
  opts: Record<string, any>;
};

type Cart = {
  company_id: number;
  products: CartProduct[];
};

interface CartState {
  cart: Cart | null;
  addProduct: (company_id: number, product: CartProduct) => void;
  removeProduct: (product_id: number) => void;
  clearCart: () => void;
}

// Attempting to explicitly define mutators for the persist middleware
const useCartStore = create<CartState>(
  persist<CartState, any, any>(
    (set, get) => ({
      cart: null, // initial state

      addProduct: (company_id, product) => {
        const currentCart = get().cart;
        if (currentCart && currentCart.company_id === company_id) {
          set({
            cart: {
              ...currentCart,
              products: [...currentCart.products, product],
            },
          });
        } else {
          set({
            cart: {
              company_id: company_id,
              products: [product],
            },
          });
        }
      },

      removeProduct: (product_id) => {
        const currentCart = get().cart;
        if (currentCart) {
          set({
            cart: {
              ...currentCart,
              products: currentCart.products.filter((p) =>
                p.p_id !== product_id
              ),
            },
          });
        }
      },

      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    },
  ),
);

export default useCartStore;
