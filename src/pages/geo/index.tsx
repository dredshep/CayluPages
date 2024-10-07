import React, { useRef, useState } from "react";
import MapComponent, { Mode } from "@/components/geo/MapComponent";
import PolygonControls from "@/components/geo/PolygonControls";
import MarkerInfo from "@/components/geo/MarkerInfo";
import ModeToggle from "@/components/geo/ModeToggle";
import { Coordinate } from "ol/coordinate";
import { Area } from "@/types/geo/Area";
import PolygonTable from "@/components/geo/PolygonTable";

const Home: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [markerPosition, setMarkerPosition] = useState<Coordinate | null>(null);
  const [refreshMap, setRefreshMap] = useState(false);
  const [refreshMarkerState, setRefreshMarkerState] = useState(false);
  const [mode, setMode] = useState<Mode>("browse");
  const updatePolygonsRef = useRef<((newAreas: Area[]) => void) | null>(null);

  const generateUniqueId = () => {
    return `Polygon_${new Date().getTime()}`;
  };

  const saveCurrentArea = (coordinates: Coordinate[]) => {
    const newId = generateUniqueId();
    const newArea: Area = { id: newId, coordinates };
    setAreas((prevAreas) => [...prevAreas, newArea]);
  };

  const refreshPolygons = () => {
    setAreas([]);
    setRefreshMap(true);
    setTimeout(() => setRefreshMap(false), 0);
  };

  const refreshMarker = () => {
    setMarkerPosition(null);
    setRefreshMarkerState(true);
    setTimeout(() => setRefreshMarkerState(false), 0);
  };
  const refreshMarkerRef = useRef(refreshMarker);

  const removePolygon = (id: string) => {
    setAreas((prevAreas) => {
      const newAreas = prevAreas.filter((area) => area.id !== id);
      if (updatePolygonsRef.current) {
        updatePolygonsRef.current(newAreas);
      }
      return newAreas;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">
        Customizable Polygons
      </h1>
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 w-full max-w-4xl">
        <ModeToggle currentMode={mode} setMode={setMode} />
        <MapComponent
          mode={mode}
          onPolygonDrawn={saveCurrentArea}
          onMarkerSet={(position, inside) => {
            setMarkerPosition(position);
          }}
          areas={areas}
          refreshMap={refreshMap}
          refreshMarkerState={refreshMarkerState}
          refreshMarkerRef={refreshMarkerRef}
          updatePolygonsRef={updatePolygonsRef}
        />
        <PolygonTable
          markerPosition={markerPosition}
          polygons={areas}
          onRemovePolygon={removePolygon}
        />
        <MarkerInfo markerPosition={markerPosition} polygons={areas} />
        <PolygonControls
          refreshPolygons={refreshPolygons}
          refreshMarker={refreshMarker}
          markerPosition={markerPosition}
        />
      </div>
    </div>
  );
};

export default Home;
