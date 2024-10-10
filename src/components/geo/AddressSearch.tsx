import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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
}

const AddressSearch: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [suggestions, setSuggestions] = useState<GeocodingSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (address.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<GeocodingSuggestion[]>(
        "/api/geo/geocoding",
        {
          params: { address },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setError("Failed to fetch address suggestions. Please try again.");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Address copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy address:", err);
        toast.error("Failed to copy address. Please try again.");
      });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Address Search</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:bg-purple-300"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {suggestions.length > 0 && (
          <ul className="mt-2 border rounded">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCopy(suggestion.display_name)}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddressSearch;
