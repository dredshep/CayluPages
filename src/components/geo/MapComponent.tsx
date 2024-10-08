import React, { useEffect, useRef, useState } from "react";
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
import { MapWrapper } from "./styled/MapWrapper";

export type Mode = "browse" | "draw" | "marker";

interface MapComponentProps {
  mode: Mode;
  onPolygonDrawn: (coordinates: Coordinate[]) => void;
  onMarkerSet: (position: Coordinate, insidePolygon: boolean) => void;
  areas: Area[];
  refreshMap: boolean;
  refreshMarkerRef: React.MutableRefObject<() => void>;
  refreshMarkerState: boolean;
  updatePolygonsRef: React.MutableRefObject<
    ((newAreas: Area[]) => void) | null
  >;
  center?: Coordinate;
}

const MapComponent: React.FC<MapComponentProps> = ({
  mode,
  onPolygonDrawn,
  onMarkerSet,
  areas,
  refreshMap,
  refreshMarkerState,
  refreshMarkerRef,
  updatePolygonsRef,
  center,
}) => {
  const mapRef = useRef<Map | null>(null);
  const drawRef = useRef<Draw | null>(null);
  const sourceRef = useRef(new VectorSource());
  const markerRef = useRef(new VectorSource());
  const modeRef = useRef(mode);
  const [refresh, setRefresh] = useState<"true" | "false">("false");
  const [mapKey, setMapKey] = useState(0);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const updatePolygons = (newAreas: Area[]) => {
    if (sourceRef.current) {
      sourceRef.current.clear();
      newAreas.forEach((area) => {
        const polygon = new Polygon([
          area.coordinates.map((coord) => fromLonLat(coord)),
        ]);
        const feature = new Feature(polygon);
        sourceRef.current.addFeature(feature);
      });
    }
  };

  // Initialize the map only once when the component mounts
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = setupMap(
        document.getElementById("map") as HTMLElement,
        sourceRef,
        markerRef,
        center || [-3.7038, 40.4168] // Madrid
      );

      drawRef.current = new Draw({
        source: sourceRef.current,
        type: "Polygon",
      });

      mapRef.current.addInteraction(drawRef.current);

      drawRef.current.on("drawend", (event) => {
        const feature = event.feature;
        const polygon = feature.getGeometry() as Polygon;
        const rawCoordinates = polygon.getCoordinates()[0];

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
        if (modeRef.current === "marker") {
          const coordinate = event.coordinate;
          const lonLat = toLonLat(coordinate);

          if (lonLat.some(isNaN)) {
            console.error("Invalid marker position detected:", lonLat);
            return;
          }

          const markerFeature = new Feature(new Point(coordinate));

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
              area.coordinates.map((coord) => fromLonLat(coord)),
            ]);
            return poly.intersectsCoordinate(coordinate);
          });

          onMarkerSet(lonLat as Coordinate, inside);
        }
      });
    }

    // Cleanup function to run only when the component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array to ensure this only runs on mount and unmount

  // Add this new useEffect hook for styled-components refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setRefresh("true");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle mode changes separately
  useEffect(() => {
    if (drawRef.current) {
      drawRef.current.setActive(mode === "draw");
    }
    modeRef.current = mode;
  }, [mode]);

  // Refresh polygons when areas or refreshMap changes
  useEffect(() => {
    if (refreshMap && sourceRef.current) {
      // Clear existing polygons
      sourceRef.current.clear();

      // Add new polygons from areas
      areas.forEach((area) => {
        const polygon = new Polygon([
          area.coordinates.map((coord) => fromLonLat(coord)),
        ]);
        const feature = new Feature(polygon);
        sourceRef.current.addFeature(feature);
      });
    }
  }, [areas, refreshMap]);

  // Handle refreshMap to clear markers when called
  useEffect(() => {
    if (refreshMarkerRef) {
      refreshMarkerRef.current = () => {
        if (markerRef.current) {
          markerRef.current.clear();
        }
      };
    }
  }, [refreshMarkerRef]);

  // Handle refreshMarkerState to clear markers when it changes
  useEffect(() => {
    if (refreshMarkerState && markerRef.current) {
      markerRef.current.clear();
    }
  }, [refreshMarkerState]);

  useEffect(() => {
    if (updatePolygonsRef) {
      updatePolygonsRef.current = updatePolygons;
    }
  }, [updatePolygonsRef]);

  useEffect(() => {
    // console.log("refresh", refresh);
  }, [refresh]);

  return (
    <MapWrapper refresh={refresh === "true" ? "true" : undefined}>
      <div
        id="map"
        className="w-full h-96 rounded-lg shadow-lg bg-gray-800"
      ></div>
    </MapWrapper>
  );
};

export default MapComponent;
