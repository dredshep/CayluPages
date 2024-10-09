import { useState } from "react";
import axios from "axios";

interface GeocodingResult {
  lat: number;
  lng: number;
}

export const useGeocoding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = async (
    address: string,
  ): Promise<GeocodingResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/geo/geocoding", {
        params: { address },
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError("Geocoding failed. Please try again.");
      setLoading(false);
      return null;
    }
  };

  return { geocodeAddress, loading, error };
};
