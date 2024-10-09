import moment from "moment";
import TimeValidator from "@/utils/time-validation/TimeValidator";

export function checkIsProductAvailable(
  productId: number,
  productHoursByProduct: Record<string, any[]>,
  holidaysByCompany: Record<string, any[]>,
  companyId: number,
  now = moment(),
) {
  const productKey = productId.toString();
  const companyKey = companyId.toString();
  const productHoursForValidation = productHoursByProduct[productKey] || [];
  const holidaysForValidation = holidaysByCompany[companyKey] || [];

  const timeValidator = new TimeValidator([], holidaysForValidation);

  // Convert Moment.js day (0-6) to database day (1-7)
  //   const dbWeekday = now.day() === 0 ? 7 : now.day();
  const dayMap = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
  } as const;
  const dbWeekday = dayMap[now.day() as keyof typeof dayMap];

  const todayProductHours = productHoursForValidation.filter(
    (hour) => hour.weekday === dbWeekday,
  );

  for (const productHour of todayProductHours) {
    if (timeValidator.isProductAvailableAtTime(productHour, now)) {
      return true; // Product is available
    }
  }

  // return false; // Product is not available
  // TODO: Check if the product is available in the future
  return true;
}
