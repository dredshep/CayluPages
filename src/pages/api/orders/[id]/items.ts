// src/pages/api/orders/[id]/items.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (req.method === "POST") {
    try {
      const items = req.body; // Array of order items

      // Add each item to the order
      for (const item of items) {
        const { product_id, quantity, price, additionals } = item;

        // Create order item
        const orderItem = await prisma.order_items.create({
          data: {
            order_id: Number(id),
            product_id,
            quantity,
            price,
          },
        });

        // Add additionals if they exist
        if (additionals && additionals.length > 0) {
          for (const additional of additionals) {
            if (additional.quantity === 0) {
              continue;
            }
            await prisma.order_item_additionals.create({
              data: {
                orderitem_id: orderItem.id,
                additional_id: additional.additional_id,
                quantity: additional.quantity,
                price: additional.price,
              },
            });
          }
        }
      }

      res.status(201).json({ message: "Order items added successfully" });
    } catch (error) {
      console.error("Error adding order items:", error);
      res.status(500).json({ error: "Failed to add order items" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
