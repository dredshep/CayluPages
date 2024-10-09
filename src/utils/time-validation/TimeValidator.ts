import moment, { Moment } from "moment";

interface BusinessHour {
  weekday: number; // 0 for Sunday, 1 for Monday, etc.
  start_time: string; // "09:00"
  end_time: string; // "17:00"
}

interface Holiday {
  holiday_date: string; // "DD-MM"
}

interface ProductHour {
  weekday: number;
  start_time: string;
  end_time: string;
  productshift_id: number;
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
    businessHour: BusinessHour,
  ): boolean {
    // Adjust the weekday to match the business hour format (1-7 instead of 0-6)
    // 1 is sunday, 2 is monday, 3 is tuesday, etc.

    const weekday = targetTime.day() + 1;

    // If it's not the same weekday, it's automatically out of range
    if (businessHour.weekday !== weekday) return false;

    const businessStart = moment(targetTime).set({
      hour: parseInt(businessHour.start_time.split(":")[0]),
      minute: parseInt(businessHour.start_time.split(":")[1]),
      second: 0,
    });

    const businessEnd = moment(targetTime).set({
      hour: parseInt(businessHour.end_time.split(":")[0]),
      minute: parseInt(businessHour.end_time.split(":")[1]),
      second: 0,
    });

    // Handle cases where end time is on the next day
    if (businessEnd.isBefore(businessStart)) {
      businessEnd.add(1, "day");
    }

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
    targetTime: Moment,
  ): boolean {
    const isHoliday = this.validateHoliday(targetTime);

    // If the day is a holiday, the business is closed
    if (isHoliday) return false;

    // Otherwise, validate the time against the business hours
    return this.validateBusinessHours(targetTime, businessHour);
  }

  // Validate if a given time is within the product hours for a specific weekday
  validateProductHours(targetTime: Moment, productHour: ProductHour): boolean {
    // Similar to validateBusinessHours, but for products
    const weekday = targetTime.day() + 1;
    console.log("weekday", weekday);
    console.log("productHour.weekday", productHour.weekday);
    if (productHour.weekday !== weekday) return false;

    const productStart = moment(
      targetTime.format("YYYY-MM-DD") + " " + productHour.start_time,
      "YYYY-MM-DD HH:mm",
    );
    const productEnd = moment(
      targetTime.format("YYYY-MM-DD") + " " + productHour.end_time,
      "YYYY-MM-DD HH:mm",
    );

    const isBetween = targetTime.isBetween(
      productStart,
      productEnd,
      undefined,
      "[]",
    );
    console.log("isBetween", isBetween);
    return isBetween;
  }

  // Check if a product is available at a specific time
  isProductAvailableAtTime(
    productHour: ProductHour,
    targetTime: Moment,
  ): boolean {
    const isHoliday = this.validateHoliday(targetTime);
    console.log("isHoliday", isHoliday);
    if (isHoliday) return false;
    return this.validateProductHours(targetTime, productHour);
  }
}

export default TimeValidator;
