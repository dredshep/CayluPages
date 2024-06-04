import { testRestaurantOpenStatus } from "@/backend/services/isRestaurantOpen";
import { NextApiRequest, NextApiResponse } from "next";
// import { getRestaurants } from '../../services/restaurants'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const restaurants = await getRestaurants()
//     res.status(200).json(restaurants)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  testRestaurantOpenStatus();
  res.status(200).json({ message: "Testing restaurants" });
}
