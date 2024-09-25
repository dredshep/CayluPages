import { products as ProductType } from "@prisma/client";
import { useCartStore2 } from "@/store/useCartStore2";

export function handleAddToCart(product: ProductType, company_id: number) {
  if (!product) return; // Ensure the product exists before proceeding
  useCartStore2.getState().addProduct(Number(product.company_id), {
    p_id: Number(product.id), // Use the actual product ID
    name: product.name,
    currency: "EUR", // Assuming EUR is your default or derived from some state
    price: parseFloat(product.price.toString()), // Assuming price needs conversion from Decimal
    quantity: 1,
    company_id,
    additionals: [], // Assuming no additional data for
  });
}
