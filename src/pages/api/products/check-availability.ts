import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { checkIsProductAvailable } from "@/utils/time-validation/checkIsProductAvailable";
import { fetchProductHours } from "@/utils/time-validation/fetchProductHours";
import { fetchBusinessHoursAndHolidays } from "@/utils/time-validation/fetchBusinessHours";
import { transformBigIntToNumber } from "@/utils/transformBigIntToNumber";

export interface AvailabilityResult {
  isAvailable: boolean;
  productHours: any[];
}

export type CheckAvailabilityResponse = Record<number, AvailabilityResult>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { companyId, productIds, currentTime } = req.body as {
      companyId: number;
      productIds: number[];
      currentTime: string;
    };

    const [productHoursByProduct, { holidaysByCompany }] = await Promise.all([
      fetchProductHours(productIds),
      fetchBusinessHoursAndHolidays([companyId]),
    ]);
    // console.log(
    //   JSON.stringify(transformBigIntToNumber(productHoursByProduct[1]), null, 2)
    // );

    const now = moment(currentTime);

    const availabilityResult = productIds.reduce((acc, productId) => {
      const isAvailable = checkIsProductAvailable(
        productId,
        productHoursByProduct,
        holidaysByCompany,
        companyId,
        now
      );
      acc[productId] = {
        isAvailable,
        productHours: transformBigIntToNumber(
          productHoursByProduct[productId] || []
        ),
      };
      return acc;
    }, {} as Record<number, { isAvailable: boolean; productHours: any[] }>);

    res.status(200).json(availabilityResult);
  } catch (error) {
    console.error("Error checking product availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
