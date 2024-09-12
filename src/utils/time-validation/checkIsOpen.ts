import moment from "moment";
import TimeValidator from "@/utils/time-validation/TimeValidator";

export function checkIsOpen(
  companyId: number,
  businessHoursByCompany: Record<string, any[]>,
  holidaysByCompany: Record<string, any[]>,
  now = moment()
) {
  const companyKey = companyId.toString();
  const businessHoursForValidation = businessHoursByCompany[companyKey] || [];
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

  // Iterate through all today's business hours and check if any are open
  for (const businessHour of todayBusinessHours) {
    if (timeValidator.isBusinessOpenAtTime(businessHour, now)) {
      return true; // Business is open
    }
  }

  return false; // Business is closed
}
