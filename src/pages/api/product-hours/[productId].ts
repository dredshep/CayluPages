import { fetchProductHours } from "@/utils/time-validation/fetchProductHours";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { productId } = req.query as { productId: string };
  const productHours = await fetchProductHours([parseInt(productId)]);
  res.status(200).json(productHours[productId] || []);
}
