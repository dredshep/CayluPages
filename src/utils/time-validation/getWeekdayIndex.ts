export function getWeekdayIndex(day: string | null): number {
  if (!day) return -1;

  const daysMap: Record<string, number> = {
    Domingo: 0,
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
  };

  return daysMap[day] ?? -1;
}
