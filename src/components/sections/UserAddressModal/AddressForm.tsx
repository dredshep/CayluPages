import { useState, useEffect, useCallback } from "react";
import { Address } from "@/types/Address";
import axios from "axios";
import { toast } from "react-toastify";
import { GeocodingSuggestion } from "@/types/geo/Geocoding";
import debounce from "lodash/debounce";
import { UserAddress } from "@/store/useUserStore";

interface AddressFormProps {
  editId: number | null;
  addresses: UserAddress[];
  onSubmit: (formData: { address: string; lat: number; lng: number }) => void;
  onCancel: () => void;
}

export default function AddressForm({
  editId,
  addresses,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const [formAddress, setFormAddress] = useState("");
  const [formLat, setFormLat] = useState(0);
  const [formLng, setFormLng] = useState(0);
  const [suggestions, setSuggestions] = useState<GeocodingSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editId) {
      const address = addresses.find((a) => a.id === editId);
      if (address) {
        setFormAddress(address.address);
        setFormLat(address.lat);
        setFormLng(address.lng);
      }
    } else {
      setFormAddress("");
      setFormLat(0);
      setFormLng(0);
    }
  }, [editId, addresses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ address: formAddress, lat: formLat, lng: formLng });
  };

  const fetchSuggestions = async (address: string) => {
    if (address.length < 10) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
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
      toast.error("Failed to fetch address suggestions. Please try again.");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    []
  );

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setFormAddress(newAddress);
    debouncedFetchSuggestions(newAddress);
  };

  const handleSuggestionClick = (suggestion: GeocodingSuggestion) => {
    setFormAddress(suggestion.display_name);
    setFormLat(parseFloat(suggestion.lat));
    setFormLng(parseFloat(suggestion.lng));
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          value={formAddress}
          onChange={handleAddressChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
      </div>
      {isLoading && <p>Loading suggestions...</p>}
      {suggestions.length > 0 && (
        <ul className="mt-2 border rounded">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
      <div>
        <label
          htmlFor="lat"
          className="block text-sm font-medium text-gray-700"
        >
          Latitude
        </label>
        <input
          type="number"
          id="lat"
          value={formLat}
          onChange={(e) => setFormLat(parseFloat(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
          step="any"
        />
      </div>
      <div>
        <label
          htmlFor="lng"
          className="block text-sm font-medium text-gray-700"
        >
          Longitude
        </label>
        <input
          type="number"
          id="lng"
          value={formLng}
          onChange={(e) => setFormLng(parseFloat(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
          step="any"
        />
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {editId ? "Update Address" : "Add Address"}
        </button>
      </div>
    </form>
  );
}
