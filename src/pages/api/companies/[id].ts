// Path: src/pages/api/companies/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import JSONbig from "json-bigint";
import { JoinedCompany } from "@/types/JoinedCompany";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const _companyId = req.query;
    const companyId = parseInt(_companyId.id as string);
    const companies = await prisma.companies.findMany({
      where: {
        id: companyId,
      },
      include: {
        business_hours: true,
        additionals: true,
        category_products: true,
        cities: true,
        company_holidays: true,
        geolocations: true,
        offers: true,
        order_purchases: true,
        orders: true,
        products: true,
        states: true,
      },
    });
    const response: JoinedCompany[] = JSONbig.parse(
      JSONbig.stringify(companies as JoinedCompany[])
    );
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
