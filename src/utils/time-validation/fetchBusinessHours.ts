import { PrismaClient } from "@prisma/client";
import moment from "moment";
// import { getWeekdayIndex } from "./getWeekdayIndex";

const prisma = new PrismaClient();

interface FormattedHoliday {
  holiday_date: string;
}

interface FormattedBusinessHour {
  weekday: number;
  start_time: string;
  end_time: string;
}

export async function fetchBusinessHoursAndHolidays(
  companyIds: number[]
): Promise<{
  businessHoursByCompany: Record<string, FormattedBusinessHour[]>;
  holidaysByCompany: Record<string, FormattedHoliday[]>;
}> {
  // Fetch business hours for the companies
  const businessHours = await prisma.business_hours.findMany({
    where: {
      company_id: {
        in: companyIds,
      },
      status: "Active",
    },
  });

  // Fetch holidays for the companies
  const holidays = await prisma.company_holidays.findMany({
    where: {
      company_id: {
        in: companyIds,
      },
    },
  });

  // Format holidays by company ID
  const holidaysByCompany = holidays.reduce<Record<string, FormattedHoliday[]>>(
    (acc, holiday) => {
      const companyId = holiday.company_id.toString();
      if (!acc[companyId]) acc[companyId] = [];
      acc[companyId].push({
        holiday_date: moment(holiday.holiday_date).format("DD-MM"),
      });
      return acc;
    },
    {}
  );

  // Format business hours by company ID
  const businessHoursByCompany = businessHours.reduce<
    Record<string, FormattedBusinessHour[]>
  >((acc, hour) => {
    const companyId = hour.company_id.toString();
    if (!acc[companyId]) acc[companyId] = [];
    if (hour.open && hour.close) {
      acc[companyId].push({
        weekday: Number(hour.day_id),
        start_time: moment(hour.open).format("HH:mm:ss"),
        end_time: moment(hour.close).format("HH:mm:ss"),
      });
    }
    return acc;
  }, {});

  return { businessHoursByCompany, holidaysByCompany };
}
