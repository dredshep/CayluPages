import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import moment from "moment";
import TimeValidator from "@/utils/time-validation/TimeValidator";

const prisma = new PrismaClient();
interface BusinessHour {
  id: number;
  weekday: number; // 0 for Sunday, 1 for Monday, etc.
  start_time: string; // "09:00"
  end_time: string; // "17:00"
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { companyIds } = req.query; // Expecting a comma-separated list of company IDs

  try {
    // Convert companyIds to an array of integers
    const companyIdList = companyIds
      ? (companyIds as string).split(",").map((id) => parseInt(id, 10))
      : [];

    if (companyIdList.length === 0) {
      return res.status(400).json({ error: "No company IDs provided." });
    }

    // Fetch business hours and holidays for all companies in the list
    const businessHours = await prisma.business_hours.findMany({
      where: {
        company_id: {
          in: companyIdList,
        },
        status: "Active",
      },
    });

    const holidays = await prisma.company_holidays.findMany({
      where: {
        company_id: {
          in: companyIdList,
        },
      },
    });

    // Group holidays by company ID (convert bigint to string)
    const holidaysByCompany = holidays.reduce((acc, holiday) => {
      const companyId = holiday.company_id.toString(); // Convert bigint to string
      if (!acc[companyId]) acc[companyId] = [];
      acc[companyId].push({
        holiday_date: moment(holiday.holiday_date).format("DD-MM"),
      });
      return acc;
    }, {} as Record<string, any[]>);

    // Group business hours by company ID (convert bigint to string)
    const businessHoursByCompany = businessHours.reduce((acc, hour) => {
      const companyId = hour.company_id.toString(); // Convert bigint to string
      if (!acc[companyId]) acc[companyId] = [];
      if (hour.open && hour.close) {
        acc[companyId].push({
          weekday: getWeekdayIndex(hour.day as string),
          start_time: moment(hour.open).format("HH:mm:ss"),
          end_time: moment(hour.close).format("HH:mm:ss"),
        });
      }
      return acc;
    }, {} as Record<string, any[]>);

    const now = moment();

    // Prepare the response: for each company, determine if it's open
    const results = companyIdList.map((companyId) => {
      const companyKey = companyId.toString(); // Convert to string to match the object keys
      const businessHoursForValidation =
        businessHoursByCompany[companyKey] || [];
      const holidaysForValidation = holidaysByCompany[companyKey] || [];

      // Create an instance of TimeValidator with fetched data
      const timeValidator = new TimeValidator(
        businessHoursForValidation,
        holidaysForValidation
      );

      // Find all today's business hours for the company
      const todayBusinessHours = businessHoursForValidation.filter(
        (hour) => hour.weekday === now.day()
      );

      let isOpen = false;

      // Iterate through all today's business hours and check if any are open
      for (const businessHour of todayBusinessHours) {
        if (timeValidator.isBusinessOpenAtTime(businessHour, now)) {
          isOpen = true;
          break; // If any period is open, the business is open
        }
      }

      return {
        companyId,
        isOpen,
      };
    });

    res.status(200).json(results);
  } catch (error: unknown) {
    const errorMessage = (error as Error).message; // Type assertion for error handling
    res.status(500).json({ error: errorMessage });
  }
}

// Utility function to map day names to weekday indices
function getWeekdayIndex(day: string | null): number {
  if (!day) return -1;

  const daysMap: Record<string, number> = {
    Domingo: 0,
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
  };

  return daysMap[day] ?? -1;
}
