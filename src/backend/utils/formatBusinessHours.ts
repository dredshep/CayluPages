import { JoinedCompany } from "@/types/JoinedCompany";

type BusinessHour = JoinedCompany["business_hours"][0];

export function formatBusinessHours(hours: BusinessHour | null): string | null {
  if (!hours) return null;
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  };

  const openTime = new Date(hours.open).toLocaleTimeString("es-ES", options);
  const closeTime = new Date(hours.close).toLocaleTimeString("es-ES", options);

  return `${openTime} - ${closeTime}`;
}
