// pages/time-check.tsx
import { useState, useEffect, useMemo, ChangeEvent } from "react";
import moment, { Moment } from "moment";
import TimeValidator from "@/utils/time-validation/TimeValidator";
import ColoredTableRow from "@/components/demo/restaurants/ColoredTableRow";

interface BusinessHour {
  id: number;
  weekday: number; // 0 for Sunday, 1 for Monday, etc.
  start_time: string; // "09:00"
  end_time: string; // "17:00"
}

interface Holiday {
  id: number;
  holiday_date: string; // "DD-MM"
}

const TimeCheck: React.FC = () => {
  const [inputDateTime, setInputDateTime] = useState<string>("");
  const [now, setNow] = useState<Moment>(moment());

  // Memoize the business hours data to avoid redefining it on every render
  const businessHoursData = useMemo<BusinessHour[]>(() => {
    return [
      { id: 1, weekday: 0, start_time: "10:00", end_time: "14:00" }, // Sunday
      { id: 2, weekday: 1, start_time: "09:00", end_time: "17:00" }, // Monday
      { id: 3, weekday: 2, start_time: "09:00", end_time: "17:00" }, // Tuesday
      { id: 4, weekday: 3, start_time: "09:00", end_time: "17:00" }, // Wednesday
      { id: 5, weekday: 4, start_time: "09:00", end_time: "17:00" }, // Thursday
      { id: 6, weekday: 5, start_time: "09:00", end_time: "21:00" }, // Friday
      { id: 7, weekday: 6, start_time: "10:00", end_time: "15:00" }, // Saturday
      { id: 8, weekday: 0, start_time: "11:00", end_time: "14:00" }, // Another Sunday
      { id: 9, weekday: 3, start_time: "13:00", end_time: "17:00" }, // Wednesday afternoon
    ];
  }, []);

  // Memoize the holidays data to avoid redefining it on every render
  const holidaysData = useMemo<Holiday[]>(() => {
    return [
      { id: 1, holiday_date: "01-01" }, // New Year's Day
      { id: 2, holiday_date: "25-12" }, // Christmas Day
      { id: 3, holiday_date: "04-07" }, // Independence Day
      { id: 4, holiday_date: "11-11" }, // Veterans Day
      { id: 5, holiday_date: "31-10" }, // Halloween
      { id: 6, holiday_date: "11-09" }, // September 11
      { id: 7, holiday_date: "12-09" }, // Today (12th September, in DD-MM format)
      { id: 8, holiday_date: "31-12" }, // New Year's Eve
      { id: 9, holiday_date: "25-11" }, // Thanksgiving
      { id: 10, holiday_date: "14-02" }, // Valentine's Day
      { id: 11, holiday_date: "01-05" }, // Labor Day
      { id: 12, holiday_date: "15-08" }, // Assumption Day
      { id: 13, holiday_date: "21-06" }, // Summer Solstice
    ];
  }, []);

  // Memoize the TimeValidator to avoid re-creating it on every render
  const timeValidator = useMemo(() => {
    return new TimeValidator(businessHoursData, holidaysData);
  }, [businessHoursData, holidaysData]);

  // Validate the current time and input time for each business hour row
  const validateRow = (businessHour: BusinessHour) => {
    const nowMoment = moment();
    const inputMoment = inputDateTime ? moment(inputDateTime) : null;

    // Check if current time is within this row's hours
    const isWithinNow = timeValidator.validateBusinessHours(
      nowMoment,
      businessHour
    );

    // Check if input time (from the datetime picker) is within this row's hours
    const isWithinInput = inputMoment
      ? timeValidator.validateBusinessHours(inputMoment, businessHour)
      : false;

    // Check if the business would be open for this row at the current time (considering holidays)
    const isBusinessOpen = timeValidator.isBusinessOpenAtTime(
      businessHour,
      nowMoment
    ); // <-- Pass `nowMoment` or `inputMoment`

    return { isWithinNow, isWithinInput, isBusinessOpen };
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputDateTime(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex justify-center p-4">
      {/* Container with max width */}
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl mb-4">Time Check Module</h1>

        {/* Date & Time input */}
        <div className="mb-6">
          <label className="block mb-2 text-xl">Select Date & Time:</label>
          <input
            type="datetime-local"
            className="p-2 bg-gray-800 text-white border border-gray-700 rounded-md w-full"
            value={inputDateTime}
            onChange={handleDateChange}
          />
        </div>

        {/* Business Hours Table */}
        <h2 className="text-2xl mb-2">Business Hours</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2">Business Hour</th>
              <th className="p-2">Is Input Time Within Range?</th>
              <th className="p-2">Is Current Time Within Range?</th>
              <th className="p-2">Is Business Open?</th>
              <th className="p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {businessHoursData.map((row) => {
              const { isWithinNow, isWithinInput, isBusinessOpen } =
                validateRow(row);
              return (
                <ColoredTableRow
                  key={row.id}
                  date={`${moment().day(row.weekday).format("ddd")} (${
                    row.start_time
                  } - ${row.end_time})`}
                  isWithinInput={isWithinInput}
                  isWithinNow={isWithinNow}
                  isBusinessOpen={isBusinessOpen}
                  description="Business Hours" // Static description
                />
              );
            })}
          </tbody>
        </table>

        {/* Holidays Table */}
        <h2 className="text-2xl mt-6 mb-2">Holidays</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2">Holiday Date</th>
              <th className="p-2">Is Input Date a Holiday?</th>
              <th className="p-2">Is Today a Holiday?</th>
              <th className="p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {holidaysData.map((row) => {
              const isTodayHoliday = moment().isSame(
                moment(row.holiday_date, "DD-MM"),
                "day"
              );
              const isInputHoliday = inputDateTime
                ? moment(inputDateTime).isSame(
                    moment(row.holiday_date, "DD-MM"),
                    "day"
                  )
                : false;

              return (
                <ColoredTableRow
                  key={row.id}
                  date={moment(row.holiday_date, "DD-MM").format("DD-MM")}
                  isWithinInput={isInputHoliday} // Check if input date is a holiday
                  isWithinNow={isTodayHoliday} // Check if today is a holiday
                  description="Holiday" // Static description for holidays
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeCheck;
