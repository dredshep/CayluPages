import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import Draw from "ol/interaction/Draw";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import Polygon from "ol/geom/Polygon";
import { fromLonLat, toLonLat } from "ol/proj";
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import { Style, Circle, Fill, Stroke } from "ol/style";
import { setupMap } from "@/utils/geo/mapSetup";
import { Area } from "@/types/geo/Area";
export type Mode = "browse" | "draw" | "marker";
interface MapComponentProps {
  mode: Mode;
  onPolygonDrawn: (coordinates: Coordinate[]) => void;
  onMarkerSet: (position: Coordinate, insidePolygon: boolean) => void;
  areas: Area[];
  refreshMap: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  mode,
  onPolygonDrawn,
  onMarkerSet,
  areas,
  refreshMap,
}) => {
  const mapRef = useRef<Map | null>(null);
  const drawRef = useRef<Draw | null>(null);
  const sourceRef = useRef(new VectorSource());
  const markerRef = useRef(new VectorSource());
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    console.log("mode:", mode);
    if (!mapRef.current) {
      mapRef.current = setupMap("map", sourceRef, markerRef);

      drawRef.current = new Draw({
        source: sourceRef.current,
        type: "Polygon",
      });

      mapRef.current.addInteraction(drawRef.current);

      drawRef.current.on("drawend", (event) => {
        const feature = event.feature;
        const polygon = feature.getGeometry() as Polygon;
        const rawCoordinates = polygon.getCoordinates()[0];

        // Ensure correct projection for the coordinates
        const coordinates = rawCoordinates.map((coord) =>
          toLonLat(coord)
        ) as Coordinate[];

        if (coordinates.some((coord) => coord.includes(NaN))) {
          console.error(
            "Polygon has invalid coordinates, not saving:",
            coordinates
          );
          return;
        }

        onPolygonDrawn(coordinates);
      });

      mapRef.current.on("singleclick", (event) => {
        console.log(
          "Map clicked at",
          event.coordinate,
          "mode:",
          modeRef.current
        );

        if (modeRef.current === "marker") {
          const coordinate = event.coordinate;
          const lonLat = toLonLat(coordinate);

          if (lonLat.some(isNaN)) {
            console.error("Invalid marker position detected:", lonLat);
            return;
          }

          const markerFeature = new Feature(new Point(coordinate));
          console.log("Marker set at", lonLat);

          markerFeature.setStyle(
            new Style({
              image: new Circle({
                radius: 7,
                fill: new Fill({ color: "red" }),
                stroke: new Stroke({ color: "white", width: 2 }),
              }),
            })
          );

          markerRef.current.clear();
          markerRef.current.addFeature(markerFeature);

          const inside = areas.some((area) => {
            const poly = new Polygon([
              area.coordinates.map((coord) => fromLonLat(coord)), // Convert back to the map's projection for comparison
            ]);
            return poly.intersectsCoordinate(coordinate);
          });

          onMarkerSet(lonLat as Coordinate, inside);
        }
      });
    } else if (refreshMap) {
      sourceRef.current.clear();
      markerRef.current.clear();
      areas.forEach((area) => {
        const polygon = new Polygon([
          area.coordinates.map((coord) => fromLonLat(coord)), // Convert back to map projection
        ]);
        const feature = new Feature(polygon);
        sourceRef.current.addFeature(feature);
      });
    }

    if (mapRef.current && drawRef.current) {
      drawRef.current.setActive(mode === "draw");
    }
  }, [areas, refreshMap, mode, onPolygonDrawn, onMarkerSet]);

  return (
    <div
      id="map"
      className="w-full h-96 rounded-lg shadow-lg bg-gray-800"
    ></div>
  );
};

export default MapComponent;
