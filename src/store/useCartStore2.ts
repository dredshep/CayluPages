import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CartAdditional, CartProduct } from "@/types";
type Cart = {
  company_id: number;
  products: CartProduct[] | undefined;
};

interface CartState {
  cart: Cart | null;
  addProduct: (company_id: number, product: CartProduct) => void;
  updateProductQuantity: (product_id: number, quantity: number) => void;
  updateProductAdditionals: (
    product_id: number,
    additionals: CartAdditional[],
  ) => void;
  removeProduct: (product_id: number) => void;
  clearCart: () => void;
}

// Helper function to merge additionals quantities
const mergeAdditionals = (
  existingAdditionals: CartAdditional[] = [],
  newAdditionals: CartAdditional[] = [],
): CartAdditional[] => {
  const additionalsMap = new Map<number, CartAdditional>();

  [...existingAdditionals, ...newAdditionals].forEach((additional) => {
    const existing = additionalsMap.get(additional.id);

    if (existing) {
      additionalsMap.set(additional.id, {
        ...existing,
        amount: (existing.amount || 0) + (additional.amount || 0),
      });
    } else {
      additionalsMap.set(additional.id, additional);
    }
  });

  return Array.from(additionalsMap.values());
};

// Helper function to handle cart updates
const updateCart = (
  state: CartState,
  updateFn: (currentCart: Cart) => Cart,
): Cart => {
  const currentCart = state.cart;
  return updateFn(
    currentCart ? { ...currentCart } : { company_id: 0, products: [] },
  );
};

export const useCartStore2 = create<CartState>()(
  persist(
    (set) => ({
      cart: null, // Initial state

      addProduct: (company_id: number, product: CartProduct) => {
        set((state) => ({
          cart: updateCart(state, (currentCart: Cart) => {
            const isSameCompany = currentCart &&
              currentCart.company_id === company_id;
            const existingProduct = isSameCompany && currentCart.products
              ? currentCart.products.find((p) => p.p_id === product.p_id)
              : null;

            const updatedProducts = existingProduct
              ? currentCart.products?.map((p) =>
                p.p_id === product.p_id
                  ? {
                    ...p,
                    quantity: p.quantity + product.quantity,
                    additionals: mergeAdditionals(
                      p.additionals,
                      product.additionals,
                    ),
                  }
                  : p
              )
              : [...(currentCart?.products || []), product];

            return {
              company_id,
              products: updatedProducts,
            };
          }),
        }));
      },

      updateProductQuantity: (product_id, quantity) => {
        set((state) => ({
          cart: updateCart(state, (currentCart) => ({
            ...currentCart,
            products: currentCart.products?.map((p) =>
              p.p_id === product_id ? { ...p, quantity } : p
            ),
          })),
        }));
      },

      updateProductAdditionals: (product_id, additionals) => {
        set((state) => ({
          cart: updateCart(state, (currentCart) => ({
            ...currentCart,
            products: currentCart.products?.map((p) =>
              p.p_id === product_id ? { ...p, additionals } : p
            ),
          })),
        }));
      },

      removeProduct: (product_id) => {
        set((state) => ({
          cart: updateCart(state, (currentCart) => ({
            ...currentCart,
            products: currentCart.products?.filter(
              (p) => p.p_id !== product_id,
            ),
          })),
        }));
      },

      clearCart: () => {
        set({ cart: null });
      },
    }),
    {
      name: "cart-storage", // Name of the storage item
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
