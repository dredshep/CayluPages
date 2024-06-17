import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@googlemaps/google-maps-services-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const client = new Client({});
    try {
      const input = req.body.input;
      if (!input) {
        return res.status(400).json({ message: "Input is required" });
      }

      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "API key is not set" });
      }

      const params = {
        input,
        key: apiKey,
      };

      const response = await client.placeAutocomplete({
        params,
        timeout: 1000, // Optional: Set timeout in milliseconds
      });

      res.status(200).json(response.data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An error occurred: " + error });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "(outside) An error occurred: " + error });
  }
}
