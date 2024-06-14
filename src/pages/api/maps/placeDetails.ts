// Path: src/pages/api/placeDetails.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@googlemaps/google-maps-services-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const client = new Client();
  try {
    const { placeId } = req.body;
    if (!placeId) {
      return res.status(400).json({ message: "Place ID is required" });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message: "Server API key is not configured",
      });
    }

    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: apiKey,
        fields: [
          "name",
          "geometry",
          "formatted_address",
          "place_id",
          "type",
          "photo",
        ], // Specify the fields you need
      },
    });

    res.status(200).json(response.data.result); // Send back the detailed place information
  } catch (error: any) {
    console.error("Error fetching place details:", error);
    res.status(500).json({ error: error.message });
  }
}
