import { products as ProductType } from "@prisma/client";
import { useCartStore } from "@/store/useCartStore";

export function handleAddToCart(product: ProductType, company_id: number) {
  if (!product) return; // Ensure the product exists before proceeding
  useCartStore.getState().addProduct(Number(product.company_id), {
    p_id: Number(product.id), // Use the actual product ID
    name: product.name,
    currency: "EUR", // Assuming EUR is your default or derived from some state
    price: parseFloat(product.price.toString()), // Assuming price needs conversion from Decimal
    quantity: 1,
    opts: {
      // Optionally include more complex options here
    },
    company_id,
  });
}
