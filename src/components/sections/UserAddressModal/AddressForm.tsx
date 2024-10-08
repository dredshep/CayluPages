import { useState, useEffect } from "react";
import { Address } from "@/types/address";

interface AddressFormProps {
  editId: number | null;
  addresses: Address[];
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

  const handlePasteLatLng = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const match = text.match(/\[([-\d.]+),\s*([-\d.]+)\]/);
      if (match) {
        const [, lat, lng] = match;
        setFormLat(parseFloat(lat));
        setFormLng(parseFloat(lng));
      } else {
        alert(
          "Invalid format. Please copy a value like [-3.683067, 40.417325]"
        );
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      alert("Failed to paste coordinates. Please try again.");
    }
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
          onChange={(e) => setFormAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
      </div>
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
      <div>
        <button
          type="button"
          onClick={handlePasteLatLng}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Paste Lat/Long
        </button>
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
