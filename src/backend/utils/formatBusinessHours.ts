import { ApiCompany } from "@/pages/api/companies/[id]";

type BusinessHour = ApiCompany["business_hours"][0] | null;

export function formatBusinessHours(hours: BusinessHour | null): string | null {
  if (!hours) return null;
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  };
  if (!hours.open || !hours.close) return "No tiene horarios";

  const openTime = new Date(hours.open).toLocaleTimeString("es-ES", options);
  const closeTime = new Date(hours.close).toLocaleTimeString("es-ES", options);

  return `${openTime} - ${closeTime}`;
}
