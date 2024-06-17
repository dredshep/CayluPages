import {
  Place,
  PlaceAutocompleteResponse,
} from "@googlemaps/google-maps-services-js";
import React, { useState } from "react";
import Map from "@/components/Map";

const AutocompleteInput = () => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<
    PlaceAutocompleteResponse["data"]["predictions"]
  >([]);
  const [selectedPlace, setSelectedPlace] = useState<Pick<Place, "geometry">>();

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInput(event.target.value);

    if (event.target.value.length > 2) {
      const response = await fetch("/api/maps/autocomplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: event.target.value }),
      });

      if (response.ok) {
        const data =
          (await response.json()) as PlaceAutocompleteResponse["data"];
        setSuggestions(data.predictions);
      } else {
        console.error("Failed to fetch suggestions");
      }
    }
  };

  const handleSelect = async (placeId: string) => {
    const response = await fetch("/api/maps/placeDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ placeId }),
    });

    if (response.ok) {
      const data = await response.json();
      setSelectedPlace(data.result);
    } else {
      console.error("Failed to fetch place details");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Search locations"
      />
      <ul>
        {suggestions.map((item) => (
          <li key={item.place_id} onClick={() => handleSelect(item.place_id)}>
            {item.description}
          </li>
        ))}
      </ul>
      {selectedPlace?.geometry ? (
        <Map location={selectedPlace.geometry.location} />
      ) : (
        <div>No location selected</div>
      )}
    </div>
  );
};

export default AutocompleteInput;
