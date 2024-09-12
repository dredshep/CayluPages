import { NextApiRequest, NextApiResponse } from "next";
import { fetchBusinessHoursAndHolidays } from "@/utils/time-validation/fetchBusinessHours";
import { checkIsOpen } from "@/utils/time-validation/checkIsOpen";
import moment from "moment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { companyIds } = req.query;

  try {
    const companyIdList = (companyIds as string)
      .split(",")
      .map((id) => parseInt(id, 10));

    if (companyIdList.length === 0) {
      return res.status(400).json({ error: "No company IDs provided." });
    }

    const { businessHoursByCompany, holidaysByCompany } =
      await fetchBusinessHoursAndHolidays(companyIdList);

    const now = moment();
    const results = companyIdList.map((companyId) => ({
      companyId,
      isOpen: checkIsOpen(
        companyId,
        businessHoursByCompany,
        holidaysByCompany,
        now
      ),
    }));

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
