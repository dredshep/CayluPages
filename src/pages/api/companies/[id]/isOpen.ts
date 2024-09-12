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
  const { id } = req.query; // company_id from the URL

  try {
    // Fetch business hours and holidays for the company
    const companyId = parseInt(id as string);

    const businessHours = await prisma.business_hours.findMany({
      where: {
        company_id: companyId,
        status: "Active",
      },
    });

    const holidays = await prisma.company_holidays.findMany({
      where: {
        company_id: companyId,
      },
    });

    // Convert fetched data into the format expected by TimeValidator
    const businessHoursForValidation = businessHours
      .map((hour) => {
        if (hour.open && hour.close) {
          // Filter out null values
          return {
            weekday: getWeekdayIndex(hour.day as string), // Handle string or enum day values
            start_time: moment(hour.open).format("HH:mm:ss"),
            end_time: moment(hour.close).format("HH:mm:ss"),
          };
        }
        return null;
      })
      .filter((hour) => hour !== null) as BusinessHour[]; // Filter out null entries

    const holidaysForValidation = holidays.map((holiday) => ({
      holiday_date: moment(holiday.holiday_date).format("DD-MM"),
    }));

    // Create an instance of TimeValidator with fetched data
    const timeValidator = new TimeValidator(
      businessHoursForValidation,
      holidaysForValidation
    );

    // Get current moment
    const now = moment();

    // Find all today's business hours (there can be more than one entry per day to indicate breaks)
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

    res.status(200).json({ isOpen });
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
