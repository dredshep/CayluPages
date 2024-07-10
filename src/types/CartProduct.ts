// Assuming you might want to include options and other properties in CartProduct
export type CartProduct = {
  p_id: number;
  image?: string;
  company_id: number;
  price: number;
  currency: string;
  quantity: number;
  name: string;
  opts: Record<string, any>; // Flexible options field
};
