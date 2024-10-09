import moment from "moment";
import TimeValidator from "@/utils/time-validation/TimeValidator";

export function checkIsOpen(
  companyId: number,
  businessHoursByCompany: Record<string, any[]>,
  holidaysByCompany: Record<string, any[]>,
  now = moment(),
) {
  const companyKey = companyId.toString();
  const businessHoursForValidation = businessHoursByCompany[companyKey] || [];
  const holidaysForValidation = holidaysByCompany[companyKey] || [];

  console.log(
    `Checking company ${companyId} at ${now.format("YYYY-MM-DD HH:mm:ss")}`,
  );
  console.log(`Business hours:`, JSON.stringify(businessHoursForValidation));
  console.log(`Holidays:`, JSON.stringify(holidaysForValidation));

  console.log(`Current day of week: ${now.day()}`);

  // Create an instance of TimeValidator with fetched data
  const timeValidator = new TimeValidator(
    businessHoursForValidation,
    holidaysForValidation,
  );

  // Find all today's business hours for the company
  const todayBusinessHours = businessHoursForValidation.filter(
    (hour) => hour.weekday === now.day() + 1,
  );

  console.log(`Today's business hours:`, JSON.stringify(todayBusinessHours));

  // Iterate through all today's business hours and check if any are open
  for (const businessHour of todayBusinessHours) {
    console.log(`Checking business hour:`, JSON.stringify(businessHour));
    const isOpen = timeValidator.isBusinessOpenAtTime(businessHour, now);
    console.log(`Is open: ${isOpen}, Current time: ${now.format("HH:mm:ss")}`);
    if (isOpen) {
      console.log(`Company ${companyId} is open`);
      return true; // Business is open
    }
  }
  console.log(`Company ${companyId} is closed`);

  return false; // Business is closed
}
