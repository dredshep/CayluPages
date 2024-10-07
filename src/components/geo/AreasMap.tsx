import React, { useState, useRef } from "react";
import MapComponent, { Mode } from "./MapComponent";
import { Area } from "@/types/geo/Area";
import { Coordinate } from "ol/coordinate";
import ModeToggle from "./ModeToggle";
import PolygonControls from "./PolygonControls";
import PolygonTable from "./PolygonTable";
import MarkerInfo from "./MarkerInfo";

interface AreasMapProps {
  areas: Area[];
  onAreaAdded: (newArea: Area) => void;
}

const AreasMap: React.FC<AreasMapProps> = ({ areas, onAreaAdded }) => {
  const [mode, setMode] = useState<Mode>("browse");
  const [markerPosition, setMarkerPosition] = useState<Coordinate | null>(null);
  const [refreshMap, setRefreshMap] = useState(false);
  const [refreshMarkerState, setRefreshMarkerState] = useState(false);
  const updatePolygonsRef = useRef<((newAreas: Area[]) => void) | null>(null);
  const refreshMarkerRef = useRef(() => {});

  const generateUniqueId = () => {
    return `Polygon_${new Date().getTime()}`;
  };

  const saveCurrentArea = (coordinates: Coordinate[]) => {
    const newId = generateUniqueId();
    const newArea: Area = { id: newId, coordinates };
    onAreaAdded(newArea);
  };

  const refreshPolygons = () => {
    setRefreshMap(true);
    setTimeout(() => setRefreshMap(false), 0);
  };

  const refreshMarker = () => {
    setMarkerPosition(null);
    setRefreshMarkerState(true);
    setTimeout(() => setRefreshMarkerState(false), 0);
  };

  const removePolygon = (id: string) => {
    console.log("Remove polygon with id:", id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Areas Map</h2>
        <ModeToggle currentMode={mode} setMode={setMode} />
      </div>
      <div className="mb-4">
        <MapComponent
          mode={mode}
          onPolygonDrawn={saveCurrentArea}
          onMarkerSet={(position) => setMarkerPosition(position)}
          areas={areas}
          refreshMap={refreshMap}
          refreshMarkerState={refreshMarkerState}
          refreshMarkerRef={refreshMarkerRef}
          updatePolygonsRef={updatePolygonsRef}
        />
      </div>
      <MarkerInfo markerPosition={markerPosition} polygons={areas} />
      <PolygonControls
        refreshPolygons={refreshPolygons}
        refreshMarker={refreshMarker}
        markerPosition={markerPosition}
      />
      <div className="mt-4 max-h-64 overflow-y-auto">
        <PolygonTable
          markerPosition={markerPosition}
          polygons={areas}
          onRemovePolygon={removePolygon}
        />
      </div>
    </div>
  );
};

export default AreasMap;
