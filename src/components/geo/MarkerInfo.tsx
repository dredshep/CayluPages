import React from "react";
import { Coordinate } from "ol/coordinate";
import { Polygon as OlPolygon } from "ol/geom";
import { fromLonLat } from "ol/proj";

interface Polygon {
  id: string;
  coordinates: Coordinate[];
}

interface MarkerInfoProps {
  markerPosition: Coordinate | null;
  polygons: Polygon[];
}

const MarkerInfo: React.FC<MarkerInfoProps> = ({
  markerPosition,
  polygons,
}) => {
  const isPointInPolygon = (
    point: Coordinate,
    polygonCoordinates: Coordinate[]
  ): boolean => {
    const pointInMapProjection = fromLonLat(point);
    const polygon = new OlPolygon([
      polygonCoordinates.map((coord) => fromLonLat(coord)),
    ]);
    return polygon.intersectsCoordinate(pointInMapProjection);
  };

  const markerInside =
    markerPosition &&
    polygons.some((polygon) =>
      isPointInPolygon(markerPosition, polygon.coordinates)
    );

  return (
    markerPosition && (
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Marker Information</h3>
        <p className="text-sm">
          Position: [{markerPosition[0].toFixed(6)},{" "}
          {markerPosition[1].toFixed(6)}]
        </p>
        <p className="text-sm mt-1">
          Status:{" "}
          {markerInside ? (
            <span className="text-green-600 font-semibold">
              Inside a Polygon
            </span>
          ) : (
            <span className="text-red-600 font-semibold">Outside Polygons</span>
          )}
        </p>
      </div>
    )
  );
};

export default MarkerInfo;
