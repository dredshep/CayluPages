// src/services/orderService.ts
import { CartProduct } from "@/types/CartProduct";

// Order creation service
export const createOrder = async (cart: {
  company_id: number;
  products: CartProduct[];
}) => {
  try {
    // Step 1: Create Order and Assign ID
    const orderResponse = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_id: cart.company_id,
        status: "Pending", // Initial order status
      }),
    });

    if (!orderResponse.ok) {
      throw new Error("Failed to create order");
    }

    const orderData = await orderResponse.json();
    const orderId = orderData.id;

    // Step 2: Generate Order Items and Additional Details
    const orderItems = cart.products.map((product) => ({
      product_id: product.p_id,
      quantity: product.quantity,
      price: product.price,
      additionals: product.additionals?.map((additional) => ({
        additional_id: additional.id,
        quantity: additional.quantity,
        price: additional.price,
      })),
    }));

    const orderItemsResponse = await fetch(`/api/orders/${orderId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderItems),
    });

    if (!orderItemsResponse.ok) {
      throw new Error("Failed to create order items");
    }

    // Step 3: Handle Payment Method (Placeholder)
    // This step will involve integrating with a payment gateway in the future.
    // For now, we'll just simulate this step.
    console.log("Order created successfully with ID:", orderId);

    return { success: true, orderId };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
};
