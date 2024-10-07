import React, { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat, toLonLat } from "ol/proj";
import { Polygon as OlPolygon, Point } from "ol/geom";
import Feature from "ol/Feature";
import { Style, Fill, Stroke, Icon } from "ol/style";
import OSM from "ol/source/OSM";
import Draw from "ol/interaction/Draw";
import { booleanPointInPolygon, Coord } from "@turf/turf";
import { Polygon } from "geojson";

type Coordinate = [number, number];

interface Area {
  id: number;
  coordinates: Coordinate[];
}

const isValidLatLng = (value: number, type: "lat" | "lng") => {
  if (isNaN(value)) return false;
  if (type === "lat" && (value < -90 || value > 90)) return false;
  if (type === "lng" && (value < -180 || value > 180)) return false;
  return true;
};

const isValidPolygon = (coordinates: Coordinate[]) => {
  for (let i = 0; i < coordinates.length - 1; i++) {
    for (let j = i + 1; j < coordinates.length - 1; j++) {
      // Exclude last point in this loop
      if (
        doLineSegmentsIntersect(
          coordinates[i],
          coordinates[(i + 1) % coordinates.length],
          coordinates[j],
          coordinates[(j + 1) % coordinates.length]
        )
      ) {
        return false;
      }
    }
  }
  return true;
};

const doLineSegmentsIntersect = (
  p: Coordinate,
  p2: Coordinate,
  q: Coordinate,
  q2: Coordinate
) => {
  const orientation = (p: Coordinate, q: Coordinate, r: Coordinate) => {
    const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (val === 0) return 0;
    return val > 0 ? 1 : 2;
  };

  const onSegment = (p: Coordinate, q: Coordinate, r: Coordinate) => {
    if (
      q[0] <= Math.max(p[0], r[0]) &&
      q[0] >= Math.min(p[0], r[0]) &&
      q[1] <= Math.max(p[1], r[1]) &&
      q[1] >= Math.min(p[1], r[1])
    ) {
      return true;
    }
    return false;
  };

  const o1 = orientation(p, p2, q);
  const o2 = orientation(p, p2, q2);
  const o3 = orientation(q, q2, p);
  const o4 = orientation(q, q2, p2);

  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  if (o1 === 0 && onSegment(p, q, p2)) return true;
  if (o2 === 0 && onSegment(p, q2, p2)) return true;
  if (o3 === 0 && onSegment(q, p, q2)) return true;
  if (o4 === 0 && onSegment(q, p2, q2)) return true;

  return false;
};

const isPointInPolygon = (point: Coordinate, polygon: Coordinate[]) => {
  const turfPoint = { type: "Point", coordinates: point } as Coord;
  const turfPolygon = {
    type: "Polygon",
    coordinates: [polygon],
  } as Polygon;
  return booleanPointInPolygon(turfPoint, turfPolygon);
};

const CustomizablePolygons: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [currentArea, setCurrentArea] = useState<Area>({
    id: 0,
    coordinates: [],
  });
  const [areaIdCounter, setAreaIdCounter] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [markerPosition, setMarkerPosition] = useState<Coordinate | null>(null);
  const [markerInside, setMarkerInside] = useState<boolean | null>(null);

  const mapRef = useRef<Map | null>(null);
  const drawRef = useRef<Draw | null>(null);
  const sourceRef = useRef(new VectorSource());
  const markerRef = useRef(new VectorSource());

  const saveCurrentArea = (coordinates: Coordinate[]) => {
    if (!isValidPolygon(coordinates)) {
      setError(
        "The polygon is self-intersecting. Please draw a valid polygon."
      );
      return;
    }

    // Save the current area
    const newArea = { id: areaIdCounter, coordinates };
    setAreas([...areas, newArea]);
    setCurrentArea({ id: 0, coordinates: [] });
    setAreaIdCounter(areaIdCounter + 1);
    setError(null);
  };

  const refreshPolygons = () => {
    // Clear all polygons
    sourceRef.current.clear();
    setAreas([]);
    setAreaIdCounter(1);
  };

  const refreshMarker = () => {
    markerRef.current.clear();
    setMarkerPosition(null);
    setMarkerInside(null);
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({
            source: sourceRef.current,
          }),
          new VectorLayer({
            source: markerRef.current,
          }),
        ],
        view: new View({
          center: fromLonLat([-3.7038, 40.4168]), // Madrid, Spain
          zoom: 12,
        }),
      });

      drawRef.current = new Draw({
        source: sourceRef.current,
        type: "Polygon",
      });

      mapRef.current.addInteraction(drawRef.current);

      drawRef.current.on("drawend", (event: any) => {
        const polygon = event.feature.getGeometry();
        const coordinates = polygon
          .getCoordinates()[0]
          .map((coord: any) => fromLonLat(coord));
        saveCurrentArea(coordinates);
      });

      const mapElement = mapRef.current.getTargetElement();

      // Add right-click event listener for marker placement
      mapElement.addEventListener("mousedown", (e: MouseEvent) => {
        if (e.button === 2) {
          // right-click
          e.preventDefault();
          if (drawRef.current) {
            drawRef.current.abortDrawing(); // Stop drawing on right-click
          }

          const coordinate = mapRef.current?.getEventCoordinate(e);
          if (coordinate) {
            const lonLat = toLonLat(coordinate) as Coordinate;

            setMarkerPosition(lonLat);
            markerRef.current.clear();

            const markerFeature = new Feature({
              geometry: new Point(coordinate),
            });

            markerFeature.setStyle(
              new Style({
                image: new Icon({
                  src: "https://openlayers.org/en/latest/examples/data/icon.png",
                  color: "red",
                  scale: 0.1, // Bigger size to make it more visible
                }),
              })
            );

            markerRef.current.addFeature(markerFeature);

            // Check if the marker is inside any polygon
            const inside = areas.some((area) =>
              isPointInPolygon(lonLat, area.coordinates)
            );
            setMarkerInside(inside);
          }
        }
      });

      // Add ESC key event listener to cancel drawing
      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          drawRef.current?.abortDrawing();
        }
      });

      // Prevent context menu from opening on right-click
      mapElement.addEventListener("contextmenu", (e) => e.preventDefault());
    } else {
      // Refresh map polygons when areas change
      sourceRef.current.clear();
      areas.forEach((area) => {
        const polygon = new OlPolygon([
          area.coordinates.map((coord) => fromLonLat(coord)),
        ]);
        const feature = new Feature(polygon);
        sourceRef.current.addFeature(feature);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas, areaIdCounter]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Customizable Polygons
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-4xl">
        {error && <p className="text-red-500">{error}</p>}
        <div
          id="map"
          className="w-full max-w-4xl h-96 rounded-lg shadow-md overflow-hidden"
        ></div>
        {markerPosition && (
          <p className="mt-4">
            Marker Position: {JSON.stringify(markerPosition)} -{" "}
            {markerInside ? (
              <span className="text-green-500">Inside Polygon</span>
            ) : (
              <span className="text-red-500">Outside Polygon</span>
            )}
          </p>
        )}
        <ul className="mt-4">
          {areas.map((area) => (
            <li key={area.id} className="mb-2">
              <strong>Area {area.id}:</strong>{" "}
              {JSON.stringify(area.coordinates)}
            </li>
          ))}
        </ul>
        <button
          onClick={refreshPolygons}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
        >
          Refresh Polygons
        </button>
        <button
          onClick={refreshMarker}
          className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 ml-4"
        >
          Refresh Marker
        </button>
      </div>
    </div>
  );
};

export default CustomizablePolygons;
