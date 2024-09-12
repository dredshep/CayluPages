import { NextApiRequest, NextApiResponse } from "next";
import { fetchBusinessHoursAndHolidays } from "@/utils/time-validation/fetchBusinessHours";
import { checkIsOpen } from "@/utils/time-validation/checkIsOpen";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    const companyId = parseInt(id as string);

    const { businessHoursByCompany, holidaysByCompany } =
      await fetchBusinessHoursAndHolidays([companyId]);

    const isOpen = checkIsOpen(
      companyId,
      businessHoursByCompany,
      holidaysByCompany
    );

    res.status(200).json({ isOpen });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
