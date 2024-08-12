// pages/dashboard.tsx
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { latLngToCell, cellToBoundary, gridDisk } from "h3-js";
import "leaflet/dist/leaflet.css";

type Hexagon = {
  hex: string;
  boundary: [number, number][];
};

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polygon = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  { ssr: false }
);

const Dashboard: React.FC = () => {
  const [baseLat, setBaseLat] = useState<number>(37.7749);
  const [baseLng, setBaseLng] = useState<number>(-122.4194);
  const [resolution, setResolution] = useState<number>(9);
  const [checkLat, setCheckLat] = useState<number>(37.775);
  const [checkLng, setCheckLng] = useState<number>(-122.4184);
  const [hexagons, setHexagons] = useState<Hexagon[]>([]);
  const [isWithinHex, setIsWithinHex] = useState<boolean>(false);
  const [checkHexIndex, setCheckHexIndex] = useState<string>("");
  const [highlightHexagons, setHighlightHexagons] = useState<string[]>([]);

  useEffect(() => {
    const baseHexIndex = latLngToCell(baseLat, baseLng, resolution);
    const surroundingHexagons = gridDisk(baseHexIndex, 1);
    const hexBoundary = cellToBoundary(baseHexIndex, true) as [
      number,
      number
    ][];
    const hexes = surroundingHexagons.map((hex) => {
      const boundary = cellToBoundary(hex, true) as [number, number][];
      return { hex, boundary };
    });

    setHexagons(hexes);
    setHighlightHexagons(surroundingHexagons);

    const checkHex = latLngToCell(checkLat, checkLng, resolution);
    setCheckHexIndex(checkHex);
    setIsWithinHex(surroundingHexagons.includes(checkHex));
  }, [baseLat, baseLng, resolution, checkLat, checkLng]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Hexagon Dashboard
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Inputs for latitude, longitude, and resolution */}
          <InputField
            label="Base Latitude:"
            value={baseLat}
            onChange={(e) => setBaseLat(parseFloat(e.target.value))}
          />
          <InputField
            label="Base Longitude:"
            value={baseLng}
            onChange={(e) => setBaseLng(parseFloat(e.target.value))}
          />
          <InputField
            label="Resolution:"
            value={resolution}
            type="number"
            onChange={(e) => setResolution(parseInt(e.target.value))}
          />
          <InputField
            label="Check Latitude:"
            value={checkLat}
            onChange={(e) => setCheckLat(parseFloat(e.target.value))}
          />
          <InputField
            label="Check Longitude:"
            value={checkLng}
            onChange={(e) => setCheckLng(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <p className="text-lg font-medium text-gray-900">
            Check Hex Index: {checkHexIndex}
          </p>
          <p className="text-lg font-medium text-gray-900">
            Is Within Hex: {isWithinHex ? "Yes" : "No"}
          </p>
        </div>
      </div>
      <MapComponent
        center={[baseLat, baseLng]}
        hexagons={hexagons}
        highlightHexagons={highlightHexagons}
      />
    </div>
  );
};

interface InputFieldProps {
  label: string;
  value: number;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  type = "number",
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </label>
  </div>
);

interface MapComponentProps {
  center: [number, number];
  hexagons: Hexagon[];
  highlightHexagons: string[];
}

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  hexagons,
  highlightHexagons,
}) => (
  <div className="w-full max-w-4xl h-96">
    <MapContainer className="h-full rounded-lg shadow-md">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {hexagons.map(({ hex, boundary }) => (
        <Polygon
          key={hex}
          positions={boundary}
          pathOptions={{
            color: highlightHexagons.includes(hex) ? "red" : "blue",
          }}
        />
      ))}
    </MapContainer>
  </div>
);

export default Dashboard;
