import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { getWeekdayIndex } from "./getWeekdayIndex";

const prisma = new PrismaClient();

export async function fetchBusinessHoursAndHolidays(companyIds: number[]) {
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
  const holidaysByCompany = holidays.reduce((acc, holiday) => {
    const companyId = holiday.company_id.toString();
    if (!acc[companyId]) acc[companyId] = [];
    acc[companyId].push({
      holiday_date: moment(holiday.holiday_date).format("DD-MM"),
    });
    return acc;
  }, {} as Record<string, any[]>);

  // Format business hours by company ID
  const businessHoursByCompany = businessHours.reduce((acc, hour) => {
    const companyId = hour.company_id.toString();
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

  return { businessHoursByCompany, holidaysByCompany };
}
