import React, { useState } from "react";
import axios from "axios";

const PointInPolygonTool: React.FC = () => {
  const [point, setPoint] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCheck = async () => {
    setIsLoading(true);
    try {
      const coord = JSON.parse(point) as [number, number];
      const response = await axios.post(
        "/api/geo/point-in-polygon",
        { point: coord },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the JWT token in localStorage
          },
        }
      );

      const { areaId, message } = response.data;
      setResult(areaId ? `Point is inside area ${areaId}` : message);
    } catch (error) {
      console.error("Error checking point:", error);
      setResult("Error checking point");
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-green-300"
        >
          {isLoading ? "Checking..." : "Check Point"}
        </button>
        {result && <p className="text-center">{result}</p>}
      </div>
    </div>
  );
};

export default PointInPolygonTool;
