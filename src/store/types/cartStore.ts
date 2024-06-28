// Define a Product type with dynamic options
type CartProduct = {
  p_id: number; // Product ID
  price: number; // Price of the product
  currency: string; // Currency (e.g., "€", "$")
  opts: {
    amount: number; // Amount of the product
    toppings?: string[]; // Optional: toppings for pizzas, sandwiches, etc.
    relleno?: string; // Optional: filling for sandwiches
    cutlery?: boolean; // Optional: whether cutlery is requested
    // Add more dynamic options based on company requirements
  };
};

// Define the Cart type
type Cart = {
  company_id: number; // Company ID associated with the cart
  products: CartProduct[]; // Array of products in the cart
};
