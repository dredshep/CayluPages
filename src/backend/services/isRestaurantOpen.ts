import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Mi_rcoles",
  "Jueves",
  "Viernes",
  "S_bado",
] as const;

const today = new Date().getDay();
const todayName = days[today];

export async function isRestaurantOpen(restaurantId: bigint): Promise<boolean> {
  const businessHour = await prisma.business_hours.findFirst({
    where: {
      company_id: restaurantId,
      // day: todayName,
      day_id: today,
    },
    include: {
      companies: true, // Include related company data
    },
  });

  if (!businessHour) {
    throw new Error(
      "Restaurant not found or business hours not set for today.",
    );
  }

  // Add your business logic here to determine if the restaurant is open
  // Example: Check current time against working hours and holidays

  return true; // Placeholder result
}

// Test function to check the open status of all restaurants
// export const testRestaurantOpenStatus = async () => {
//   console.log("Testing restaurants...");

//   const restaurantsWithHours = await prisma.companies.findMany({
//     include: {
//       business_hours: {
//         where: {
//           day: todayName,
//         },
//       },
//     },
//   });

//   restaurantsWithHours.forEach((restaurant) => {
//     if (restaurant.business_hours.length === 0) {
//       console.log(
//         `Restaurant ${restaurant.id.toString()} is missing business hours.`,
//       );
//     } else {
//       console.log({ restaurant });
//       // console.log(`Restaurant ${restaurant.id.toString()} is Open.`);
//     }
//   });
// };

// Test function to log all business hours of all restaurants
export const testRestaurantOpenStatus = async () => {
  console.log("Testing restaurants...");

  // Fetch all restaurants with their business hours, not filtering by day
  const restaurantsWithHours = await prisma.companies.findMany({
    include: {
      business_hours: true, // This includes all business hours without filtering
    },
  });

  // Iterate through each restaurant and log their business hours
  restaurantsWithHours.forEach((restaurant) => {
    if (restaurant.business_hours.length === 0) {
      console.log(
        `Restaurant ${restaurant.id.toString()} has no business hours set.`,
      );
    } else {
      console.log(`Business hours for Restaurant ${restaurant.id.toString()}:`);
      restaurant.business_hours.forEach((hour) => {
        console.log(
          `Day: ${hour.day_id}, Open: ${hour.open?.toISOString()}, Close: ${hour.close?.toISOString()}`,
        );
      });
    }
  });
};

// Optionally, run the test function when this file is executed
// testRestaurantOpenStatus().finally(() => prisma.$disconnect());

// Optional: Uncomment the following line to run the test function when the file is executed
// isRestaurantOpenTester().finally(() => prisma.$disconnect());
