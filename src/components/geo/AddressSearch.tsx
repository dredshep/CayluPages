import React, { useState } from "react";

const AddressSearch: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = async () => {
    if (address.length < 3) {
      setSuggestions([]);
      return;
    }

    // Here you would typically call an API to get address suggestions
    // For this example, we'll just use some dummy data
    const dummySuggestions = [
      `${address} Street, City`,
      `${address} Avenue, Town`,
      `${address} Road, Village`,
    ];
    setSuggestions(dummySuggestions);
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
          className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
        >
          Search
        </button>
        {suggestions.length > 0 && (
          <ul className="mt-2 border rounded">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="p-2 hover:bg-gray-100">
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddressSearch;
