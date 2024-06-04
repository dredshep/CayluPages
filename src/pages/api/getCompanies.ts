import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import JSONbig from "json-bigint";
const prisma = new PrismaClient();
// import { getRestaurants } from '../../services/restaurants'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const restaurants = await getRestaurants()
//     res.status(200).json(restaurants)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const _companies = await prisma.companies.findMany();
    // join with business_hours
    const companies = await prisma.companies.findMany({
      include: {
        business_hours: true,
      },
    });
    res.status(200).json(JSONbig.parse(JSONbig.stringify(companies)));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
