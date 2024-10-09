import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    );

    console.log({ response: response.data });
    const { results } = response.data;

    if (results && results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      res.status(200).json({ lat, lng });
    } else {
      res.status(404).json({ error: "No results found" });
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    res.status(500).json({ error: "Geocoding failed" });
  }
}
