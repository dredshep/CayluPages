import { ApiAdditional } from "@/pages/api/companies/[id]";
import { additionals } from "@prisma/client";

// Assuming you might want to include options and other properties in CartProduct
export type CartProduct = {
  p_id: number;
  image?: string;
  company_id: number;
  price: number;
  currency: string;
  quantity: number;
  name: string;
  additionals?: CartAdditional[];
  // opts: Record<string, any>; // Flexible options field
};

export interface CartAdditional extends ApiAdditional {
  quantity?: number;
  category_name: string;
  category_id: number;
}
