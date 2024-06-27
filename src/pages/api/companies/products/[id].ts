// Path: src/pages/api/companies/products/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import JSONbig from "json-bigint";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const _productId = req.query;
    const productId = parseInt(_productId.id as string);

    const product = await prisma.products.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(JSONbig.parse(JSONbig.stringify(product)));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
