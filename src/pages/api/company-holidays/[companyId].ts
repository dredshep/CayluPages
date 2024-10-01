import { fetchBusinessHoursAndHolidays } from "@/utils/time-validation/fetchBusinessHours";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { companyId } = req.query as { companyId: string };
  const { holidaysByCompany } = await fetchBusinessHoursAndHolidays([
    parseInt(companyId),
  ]);
  res.status(200).json({ holidaysByCompany });
}
