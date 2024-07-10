import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartProduct, Cart } from "@/types"; // Assuming you've defined these types elsewhere

interface CartState {
  cart: Cart | null;
  addProduct: (company_id: number, product: CartProduct) => void;
  updateProductQuantity: (product_id: number, quantity: number) => void;
  removeProduct: (product_id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null, // initial state

      addProduct: (company_id, product) => {
        const currentCart = get().cart;
        if (currentCart && currentCart.company_id === company_id) {
          const existingProductIndex = currentCart.products.findIndex(
            (p) => p.p_id === product.p_id
          );
          if (existingProductIndex !== -1) {
            // Product exists, just update quantity
            const updatedProducts = currentCart.products.map((p, index) =>
              index === existingProductIndex
                ? { ...p, quantity: p.quantity + product.quantity }
                : p
            );
            set({ cart: { ...currentCart, products: updatedProducts } });
          } else {
            // New product, add it
            set({
              cart: {
                ...currentCart,
                products: [...currentCart.products, product],
              },
            });
          }
        } else {
          // Different company or no cart, set new cart
          set({ cart: { company_id, products: [product] } });
        }
      },

      updateProductQuantity: (product_id, quantity) => {
        const currentCart = get().cart;
        if (currentCart) {
          const updatedProducts = currentCart.products.map((p) =>
            p.p_id === product_id ? { ...p, quantity } : p
          );
          set({ cart: { ...currentCart, products: updatedProducts } });
        }
      },

      removeProduct: (product_id) => {
        const currentCart = get().cart;
        if (currentCart) {
          const updatedProducts = currentCart.products.filter(
            (p) => p.p_id !== product_id
          );
          set({ cart: { ...currentCart, products: updatedProducts } });
        }
      },

      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: "cart-storage", // Name of the storage item
      getStorage: () => localStorage, // Returns the storage area
    }
  )
);
