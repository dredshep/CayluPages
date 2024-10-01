import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { checkIsProductAvailable } from "../time-validation/checkIsProductAvailable";
import { fetchBusinessHoursAndHolidays } from "../time-validation/fetchBusinessHours";
import { fetchProductHours } from "../time-validation/fetchProductHours";
import { transformBigIntToNumber } from "../transformBigIntToNumber";

const prisma = new PrismaClient();

export async function fetchCompanyProducts(
  companyId: number,
  filterByAvailability: boolean = false
) {
  // Fetch all products for the company
  const products = await prisma.products.findMany({
    where: {
      company_id: companyId,
      status: "Available",
    },
  });

  console.log({ products });

  if (!filterByAvailability) {
    return products.map((product) => ({
      ...product,
      id: Number(product.id),
      company_id: Number(product.company_id),
      categoryproduct_id: Number(product.categoryproduct_id),
      warehouse_id: Number(product.warehouse_id),
    }));
  }

  // Fetch product hours and holidays
  const productIds = products.map((product) => Number(product.id));
  const [productHoursByProduct, { holidaysByCompany }] = await Promise.all([
    fetchProductHours(productIds),
    fetchBusinessHoursAndHolidays([companyId]),
  ]);

  // Filter products by availability
  const availableProducts = products.filter((product) =>
    checkIsProductAvailable(
      Number(product.id),
      productHoursByProduct,
      holidaysByCompany,
      companyId,
      moment()
    )
  );

  return availableProducts.map((product) => ({
    ...product,
    id: Number(product.id),
    company_id: Number(product.company_id),
    categoryproduct_id: Number(product.categoryproduct_id),
    warehouse_id: Number(product.warehouse_id),
  }));
}
