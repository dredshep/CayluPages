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
    // Convert point to map projection if necessary
    const pointInMapProjection = fromLonLat(point);

    // Create a polygon in map projection
    const polygon = new OlPolygon([
      polygonCoordinates.map((coord) => fromLonLat(coord)),
    ]);

    // Perform the intersection check
    return polygon.intersectsCoordinate(pointInMapProjection);
  };

  const markerInside =
    markerPosition &&
    polygons.some((polygon) =>
      isPointInPolygon(markerPosition, polygon.coordinates)
    );

  return (
    (markerPosition ?? undefined) && (
      <div className="mt-4 text-gray-200">
        Marker Position: {JSON.stringify(markerPosition)} -{" "}
        {markerInside ? (
          <span className="text-green-400">Inside a Polygon</span>
        ) : (
          <span className="text-red-400">Outside Polygon</span>
        )}
      </div>
    )
  );
};

export default MarkerInfo;
