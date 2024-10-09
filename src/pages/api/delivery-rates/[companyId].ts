import { NextApiRequest, NextApiResponse } from "next";
import { delivery_rates, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface ApiDeliveryRate
  extends Omit<delivery_rates, "id" | "company_id"> {
  id: number;
  company_id: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { companyId } = req.query;

  if (req.method === "GET") {
    try {
      const rates = await prisma.delivery_rates.findMany({
        where: {
          company_id: BigInt(companyId as string),
        },
        orderBy: {
          from_km: "asc",
        },
      });

      res.status(200).json(
        rates.map((rate) => ({
          ...rate,
          id: Number(rate.id),
          company_id: Number(rate.company_id),
        })),
      );
    } catch (error) {
      console.error("Error fetching delivery rates:", error);
      res.status(500).json({ error: "Failed to fetch delivery rates" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
