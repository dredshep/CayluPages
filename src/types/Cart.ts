import { products } from "@prisma/client";
import { CartProduct } from "./CartProduct";
export type Cart = {
  company_id: number; // Identifies the company to which the cart belongs
  products: CartProduct[]; // An array of products currently in the cart
};
