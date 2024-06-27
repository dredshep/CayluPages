// Path: src/pages/api/companies/products/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import JSONbig from "json-bigint";
const prisma = new PrismaClient();

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const products = await prisma.products.findMany();

    res.status(200).json(JSONbig.parse(JSONbig.stringify(products)));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
