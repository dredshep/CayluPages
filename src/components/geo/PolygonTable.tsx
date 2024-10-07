import React from "react";
import { Coordinate } from "ol/coordinate";
import { Polygon } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { toast } from "react-toastify";

interface PolygonTableProps {
  markerPosition: Coordinate | null;
  polygons: { id: string; coordinates: Coordinate[] }[];
  onRemovePolygon: (id: string) => void;
}

const PolygonTable: React.FC<PolygonTableProps> = ({
  markerPosition,
  polygons,
  onRemovePolygon,
}) => {
  const isPointInPolygon = (
    point: Coordinate,
    polygonCoordinates: Coordinate[]
  ) => {
    const pointInMapProjection = fromLonLat(point);
    const polygon = new Polygon([
      polygonCoordinates.map((coord) => fromLonLat(coord)),
    ]);
    return polygon.intersectsCoordinate(pointInMapProjection);
  };

  const copyPolygonCoordinates = (polygon: {
    id: string;
    coordinates: Coordinate[];
  }) => {
    const coordinatesString = polygon.coordinates
      .map((coord) => `${coord[0].toFixed(6)},${coord[1].toFixed(6)}`)
      .join(" ");
    navigator.clipboard.writeText(coordinatesString);
    toast.success("Polygon coordinates copied to clipboard");
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {polygons.map((polygon) => (
            <tr key={polygon.id}>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {polygon.id}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm">
                {markerPosition &&
                isPointInPolygon(markerPosition, polygon.coordinates) ? (
                  <span className="text-green-600">Inside</span>
                ) : (
                  <span className="text-red-600">Outside</span>
                )}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                <button
                  className="text-red-600 hover:text-red-900 mr-2"
                  onClick={() => onRemovePolygon(polygon.id)}
                >
                  Remove
                </button>
                <button
                  className="text-blue-600 hover:text-blue-900"
                  onClick={() => copyPolygonCoordinates(polygon)}
                >
                  Copy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PolygonTable;
