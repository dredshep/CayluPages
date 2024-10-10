import { ApiCompany } from "@/pages/api/companies/[id]";
import { useEffect, useState } from "react";

// The hook that fetches business hours based on the current day or a specific day
function useBusinessHours(
  company: ApiCompany | null,
  day?: number
): ApiCompany["business_hours"][0] | null {
  const [todayHours, setTodayHours] = useState<
    ApiCompany["business_hours"][0] | undefined
  >(undefined);

  useEffect(() => {
    if (!company) return;

    const getBusinessHours = (): void => {
      // Find the business hours for the given day from the array
      const hours = company.business_hours.find(
        (hour) => hour.day_id === day
      ) as ApiCompany["business_hours"][0];
      setTodayHours(hours);
    };

    getBusinessHours();
  }, [company, day]); // Re-run when company or day changes

  return todayHours ?? null;
}

export default useBusinessHours;
