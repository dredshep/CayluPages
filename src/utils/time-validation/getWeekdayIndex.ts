// export function getWeekdayIndex(day: number | null): string {
//   if (!day) return -1;

//   // const daysMap: Record<string, number> = {
//   //   Domingo: 0,
//   //   Lunes: 1,
//   //   Martes: 2,
//   //   Miércoles: 3,
//   //   Jueves: 4,
//   //   Viernes: 5,
//   //   Sábado: 6,
//   // };
//   // lets do number, string instead.
//   const daysMap: Record<number, string> = {
//     0: "Domingo",
//     1: "Lunes",
//     2: "Martes",
//     3: "Miércoles",
//     4: "Jueves",
//     5: "Viernes",
//     6: "Sábado",
//   };
//   console.log("@/utils/time-validation/getWeekdayIndex.ts:13", {
//     day,
//     daysMap,
//   });

//   return daysMap[day] ?? -1;
// }
