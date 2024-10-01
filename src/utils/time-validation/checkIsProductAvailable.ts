import moment from "moment";
import TimeValidator from "@/utils/time-validation/TimeValidator";

export function checkIsProductAvailable(
  productId: number,
  productHoursByProduct: Record<string, any[]>,
  holidaysByCompany: Record<string, any[]>,
  companyId: number,
  now = moment()
) {
  const productKey = productId.toString();
  const companyKey = companyId.toString();
  const productHoursForValidation = productHoursByProduct[productKey] || [];
  const holidaysForValidation = holidaysByCompany[companyKey] || [];

  const timeValidator = new TimeValidator([], holidaysForValidation);

  const todayProductHours = productHoursForValidation.filter(
    (hour) => hour.weekday === now.day()
  );

  for (const productHour of todayProductHours) {
    if (timeValidator.isProductAvailableAtTime(productHour, now)) {
      return true; // Product is available
    }
  }

  return false; // Product is not available
}
