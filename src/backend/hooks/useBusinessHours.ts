import { ApiCompany } from "@/pages/api/companies/[id]";
import { useState, useEffect } from "react";

// The hook that fetches business hours based on the current day or a specific day
function useBusinessHours(
  company: ApiCompany | null,
  day?: string
): ApiCompany["business_hours"][0] | null {
  const [todayHours, setTodayHours] = useState<
    ApiCompany["business_hours"][0] | undefined
  >(undefined);

  useEffect(() => {
    if (!company) return;

    const getBusinessHours = (): void => {
      // Use the provided 'day' or determine today's day based on Spain's timezone
      const today = new Date().toLocaleString("en-US", {
        timeZone: "Europe/Madrid",
      });
      const dayOfWeek =
        day || new Date(today).toLocaleDateString("es-ES", { weekday: "long" });

      // Capitalize the first letter to match the format in the database
      const formattedDay =
        dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
      console.log({ formattedDay });

      // Find the business hours for the given day from the array
      const hours = company.business_hours.find(
        (hour) => hour.day === formattedDay
      ) as ApiCompany["business_hours"][0];
      setTodayHours(hours);
    };

    getBusinessHours();
  }, [company, day]); // Re-run when company or day changes

  return todayHours ?? null;
}

export default useBusinessHours;
