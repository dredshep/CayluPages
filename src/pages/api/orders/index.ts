import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { company_id, status } = req.body;

      // Create a new order
      const newOrder = await prisma.orders.create({
        data: {
          company_id: BigInt(company_id), // Ensure this is converted to BigInt if necessary
          status: status,
        },
      });

      // Convert BigInt to string for JSON serialization
      const responseData = {
        id: newOrder.id.toString(), // Convert BigInt to string
      };

      res.status(201).json(responseData);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
