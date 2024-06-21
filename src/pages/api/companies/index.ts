// Path: src/pages/api/companies/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import {
  additionals,
  business_hours,
  category_products,
  cities,
  companies,
  company_holidays,
  geolocations,
  offers,
  order_purchases,
  orders,
  PrismaClient,
  products,
  states,
} from "@prisma/client";
import JSONbig from "json-bigint";
const prisma = new PrismaClient();

export type JoinedCompany = companies & {
  business_hours: business_hours[];
  additionals: additionals[];
  category_products: category_products[];
  cities: cities;
  company_holidays: company_holidays[];
  geolocations: geolocations;
  offers: offers[];
  order_purchases: order_purchases[];
  orders: orders[];
  products: products[];
  states: states;
};
export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const companies = await prisma.companies.findMany({
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
    }) as JoinedCompany[];
    // }) as JoinedCompany[];
    res.status(200).json(JSONbig.parse(JSONbig.stringify(companies)));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
