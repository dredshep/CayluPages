import React, { useState } from "react";
import { findPolygonContainingPoint } from "@/utils/geo/geoUtils";
import { Coordinate } from "ol/coordinate";
import { Area } from "@/types/geo/Area";

interface PointInPolygonToolProps {
  areas: Area[];
}

const PointInPolygonTool: React.FC<PointInPolygonToolProps> = ({ areas }) => {
  const [point, setPoint] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);

  const handleCheck = () => {
    try {
      const coord = JSON.parse(point) as Coordinate;
      const polygonId = findPolygonContainingPoint(coord, areas);
      setResult(
        polygonId
          ? `Point is inside polygon ${polygonId}`
          : "Point is not inside any polygon"
      );
    } catch (error) {
      console.error("Invalid coordinate", error);
      setResult("Invalid coordinate");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Point in Polygon Tool</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={point}
          onChange={(e) => setPoint(e.target.value)}
          placeholder="Point (e.g. [lon, lat])"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleCheck}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Check Point
        </button>
        {result && <p className="text-center">{result}</p>}
      </div>
    </div>
  );
};

export default PointInPolygonTool;
