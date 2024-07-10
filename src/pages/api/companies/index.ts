// Path: src/pages/api/companies/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import JSONbig from "json-bigint";
import { JoinedCompany } from "@/types/JoinedCompany";
const prisma = new PrismaClient();

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const companies = (await prisma.companies.findMany({
      include: {
        business_hours: true,
        additionals: true,
        category_products: true,
        products: true,
        cities: true,
        company_holidays: true,
        geolocations: true,
        offers: true,
        order_purchases: true,
        orders: true,
        states: true,
      },
    })) as JoinedCompany[];
    // }) as JoinedCompany[];
    res.status(200).json(JSONbig.parse(JSONbig.stringify(companies)));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
