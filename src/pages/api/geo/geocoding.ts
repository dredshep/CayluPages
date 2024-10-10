import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface AddressDetails {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

interface GeocodingSuggestion {
  display_name: string;
  lat: string;
  lng: string;
  address: AddressDetails;
  fullResult: object;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeocodingSuggestion[] | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address } = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    const response = await axios.get<any[]>(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: address,
          format: "json",
          limit: 5,
          addressdetails: 1,
        },
      }
    );

    const results = response.data;

    if (results && results.length > 0) {
      const suggestions: GeocodingSuggestion[] = results.map((result) => ({
        // Example name: Avenida de Algorta, 14, San Fernand
        // display_name: `${result.address.road} ${result.}`
        display_name: result.display_name,
        lat: result.lat,
        lng: result.lon,
        address: result.address,
        fullResult: result,
      }));
      res.status(200).json(suggestions);
    } else {
      res.status(404).json({ error: "No results found" });
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    res.status(500).json({ error: "Geocoding failed" });
  }
}
