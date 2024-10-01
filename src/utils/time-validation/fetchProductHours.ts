import { PrismaClient } from "@prisma/client";
import moment from "moment";
// import { getWeekdayIndex } from "./getWeekdayIndex";

const prisma = new PrismaClient();

export async function fetchProductHours(productIds: number[]) {
  const productHours = await prisma.product_hours.findMany({
    where: {
      product_id: {
        in: productIds,
      },
      status: "Active",
    },
    include: {
      days: true,
    },
  });

  const productHoursByProduct = productHours.reduce((acc, hour) => {
    const productId = hour.product_id.toString();
    if (!acc[productId]) acc[productId] = [];
    if (hour.open && hour.close) {
      acc[productId].push({
        weekday: Number(hour.days.id),
        start_time: moment(hour.open).format("HH:mm:ss"),
        end_time: moment(hour.close).format("HH:mm:ss"),
        productshift_id: hour.productshift_id,
      });
    }
    return acc;
  }, {} as Record<string, any[]>);

  return productHoursByProduct;
}
