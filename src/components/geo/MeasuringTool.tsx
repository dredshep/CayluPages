import React, { useState } from "react";
import { measureDistance } from "@/utils/geo/geoUtils";
import { Coordinate } from "ol/coordinate";

const MeasuringTool: React.FC = () => {
  const [point1, setPoint1] = useState<string>("");
  const [point2, setPoint2] = useState<string>("");
  const [distance, setDistance] = useState<number | null>(null);

  const handleMeasure = () => {
    try {
      const coord1 = JSON.parse(point1) as Coordinate;
      const coord2 = JSON.parse(point2) as Coordinate;
      const measuredDistance = measureDistance(coord1, coord2);
      setDistance(measuredDistance);
    } catch (error) {
      console.error("Invalid coordinates", error);
      setDistance(null);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Measuring Tool</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={point1}
          onChange={(e) => setPoint1(e.target.value)}
          placeholder="Point 1 (e.g. [lon, lat])"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={point2}
          onChange={(e) => setPoint2(e.target.value)}
          placeholder="Point 2 (e.g. [lon, lat])"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleMeasure}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Measure Distance
        </button>
        {distance !== null && (
          <p className="text-center">Distance: {distance.toFixed(2)} meters</p>
        )}
      </div>
    </div>
  );
};

export default MeasuringTool;
