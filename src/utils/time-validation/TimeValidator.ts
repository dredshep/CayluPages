import moment, { Moment } from "moment";

interface BusinessHour {
  weekday: number; // 0 for Sunday, 1 for Monday, etc.
  start_time: string; // "09:00"
  end_time: string; // "17:00"
}

interface Holiday {
  holiday_date: string; // "DD-MM"
}

class TimeValidator {
  private businessHours: BusinessHour[];
  private holidays: Holiday[];

  constructor(businessHours: BusinessHour[], holidays: Holiday[]) {
    this.businessHours = businessHours;
    this.holidays = holidays;
  }

  // Validate if a given time is within the business hours for a specific weekday
  validateBusinessHours(
    targetTime: Moment,
    businessHour: BusinessHour
  ): boolean {
    const weekday = targetTime.day(); // Get the weekday (0 for Sunday, 1 for Monday, etc.)

    // If it's not the same weekday, it's automatically out of range
    if (businessHour.weekday !== weekday) return false;

    // Create Moment instances for the start and end time of this row
    const businessStart = moment(
      targetTime.format("YYYY-MM-DD") + " " + businessHour.start_time,
      "YYYY-MM-DD HH:mm"
    );
    const businessEnd = moment(
      targetTime.format("YYYY-MM-DD") + " " + businessHour.end_time,
      "YYYY-MM-DD HH:mm"
    );

    // Check if the target time falls within the business hours
    return targetTime.isBetween(businessStart, businessEnd, undefined, "[]");
  }

  // Validate if the given date is a holiday (based only on day/month)
  validateHoliday(targetDate: Moment): boolean {
    return this.holidays.some((holiday) => {
      const holidayMoment = moment(holiday.holiday_date, "DD-MM");
      return (
        targetDate.isSame(holidayMoment, "month") &&
        targetDate.isSame(holidayMoment, "day")
      );
    });
  }

  // Check if the business is open for a specific BusinessHour (considering holidays)
  // Check if the business is open for a specific BusinessHour (considering holidays)
  isBusinessOpenAtTime(
    businessHour: BusinessHour,
    targetTime: Moment
  ): boolean {
    const isHoliday = this.validateHoliday(targetTime);

    // If the day is a holiday, the business is closed
    if (isHoliday) return false;

    // Otherwise, validate the time against the business hours
    return this.validateBusinessHours(targetTime, businessHour);
  }
}

export default TimeValidator;
