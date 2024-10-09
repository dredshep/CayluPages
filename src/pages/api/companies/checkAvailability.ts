import { NextApiRequest, NextApiResponse } from "next";
import { fetchBusinessHoursAndHolidays } from "@/utils/time-validation/fetchBusinessHours";
import { checkIsOpen } from "@/utils/time-validation/checkIsOpen";
import moment from "moment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // console.log("Request method:", req.method);
  // console.log("Request body:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { companyIds, currentTime } = req.body;

  if (!companyIds || !Array.isArray(companyIds) || companyIds.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid or missing companyIds in request body" });
  }

  try {
    const { businessHoursByCompany, holidaysByCompany } =
      await fetchBusinessHoursAndHolidays(companyIds);

    // console.log("Business hours:", businessHoursByCompany);
    // console.log("Holidays:", holidaysByCompany);

    const now = currentTime ? moment(currentTime) : moment();
    // console.log("Current time:", now.format());

    if (!now.isValid()) {
      return res.status(400).json({ error: "Invalid currentTime provided" });
    }

    const results = companyIds.map((companyId) => {
      try {
        const companyHours = businessHoursByCompany[companyId.toString()] || [];
        const todayHours = companyHours.find(
          (hour) => hour.weekday === now.day(),
        );

        const isOpen = checkIsOpen(
          companyId,
          businessHoursByCompany,
          holidaysByCompany,
          now,
        );
        return {
          companyId,
          isOpen,
          openTime: todayHours ? todayHours.start_time : null,
          closeTime: todayHours ? todayHours.end_time : null,
        };
      } catch (error) {
        console.error(`Error processing company ${companyId}:`, error);
        return {
          companyId,
          isOpen: false,
          openTime: null,
          closeTime: null,
          error: "Error processing company availability",
        };
      }
    });

    // console.log("Final results:", results);

    res.status(200).json(results);
  } catch (error) {
    // console.error("Error in checkAvailability:", error);
    res.status(500).json({
      error: "Internal server error",
      details: (error as Error).message,
    });
  }
}
