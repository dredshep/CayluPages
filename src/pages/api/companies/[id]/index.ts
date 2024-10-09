// Path: src/pages/api/companies/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import {
  additionals,
  business_hours,
  catalogue_sorts,
  category_products,
  cities,
  companies,
  company_holidays,
  geolocations,
  offers,
  order_items,
  order_purchases,
  orders,
  PrismaClient,
  products,
  products_status,
  states,
  warehouses,
} from "@prisma/client";
import JSONbig from "json-bigint";
import Decimal from "decimal.js";

const prisma = new PrismaClient();

const getCompany = (companyId: number) =>
  prisma.companies.findMany({
    where: {
      id: companyId,
    },
    include: {
      business_hours: {
        select: {
          days: true,
          open: true,
          close: true,
        },
      },
      additionals: true,
      category_products: true,
      cities: true,
      company_holidays: true,
      geolocations: true,
      offers: true,
      order_purchases: true,
      orders: true,
      products: {
        include: {
          additionals: {
            include: {
              category_products: {
                select: {
                  id: true,
                  name: true,
                },
              },
              catalogue_sorts: {
                select: {
                  additional_id: true,
                  product_id: true,
                  categoryproduct_id: true,
                  sort: true,
                },
              },
            },
          },
          category_products: true,
          order_items: true,
          warehouses: true,
          companies: {
            select: {
              id: true, // Ensure company_id is included here
            },
          },
          _count: {
            select: { order_items: true },
          },
        },
      },
      states: true,
    },
  });

// Utility type to convert bigint and Decimal to number
type ConvertBigIntToNumber<T> = {
  [K in keyof T]: T[K] extends bigint ? number
    : T[K] extends Decimal ? Decimal
    : T[K];
};

// Extend Prisma types to convert bigint and Decimal fields to number
export interface ApiProduct
  extends Omit<ConvertBigIntToNumber<products>, "price"> {
  id: number;
  company_id: number;
  categoryproduct_id: number;
  warehouse_id: number;
  name: string;
  description: string;
  status: products_status;
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
  sku: string;
  amount: number;
  price: Decimal; // Changed from number to Decimal
  product_image: string | null;
  product_hours: {
    weekday: number;
    start_time: string;
    end_time: string;
  }[];
  // Optional fields that may not always be present
  additionals?: ApiAdditional[];
  category_products?: ConvertBigIntToNumber<category_products>;
  order_items?: ConvertBigIntToNumber<order_items>[];
  warehouses?: ConvertBigIntToNumber<warehouses>;
  companies?: { id: number };
  _count?: { order_items: number };
}

export interface ApiCompany extends ConvertBigIntToNumber<companies> {
  category_products: category_products[];
  products: ApiProduct[];
  business_hours: ConvertBigIntToNumber<business_hours>[];
  additionals: ConvertBigIntToNumber<additionals>[];
  cities: ConvertBigIntToNumber<cities>[];
  company_holidays: ConvertBigIntToNumber<company_holidays>[];
  geolocations: ConvertBigIntToNumber<geolocations>[];
  offers: ConvertBigIntToNumber<offers>[];
  order_purchases: ConvertBigIntToNumber<order_purchases>[];
  orders: ConvertBigIntToNumber<orders>[];
  states: ConvertBigIntToNumber<states>[];
}

export type ApiAdditional = ConvertBigIntToNumber<additionals> & {
  category_products: {
    id: number;
    name: string;
  };
  catalogue_sorts: ConvertBigIntToNumber<catalogue_sorts>[];
};

export type ApiCategoryProducts = ConvertBigIntToNumber<category_products> & {
  additionals: ApiAdditional[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const _companyId = req.query;
    const companyId = parseInt(_companyId.id as string);
    const companies = await getCompany(companyId);
    const response = JSONbig.parse(
      JSONbig.stringify(companies[0]),
    ) as ApiCompany;
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
