import React, { useState, useRef, useMemo } from "react";
import MapComponent, { Mode } from "./MapComponent";
import { Area } from "@/types/geo/Area";
import { Coordinate } from "ol/coordinate";

interface AreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  area?: Area;
  onSave: (area: Area) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const AreaModal: React.FC<AreaModalProps> = ({
  isOpen,
  onClose,
  area,
  onSave,
  onDelete,
}) => {
  const [mode, setMode] = useState<Mode>("draw");
  const [currentArea, setCurrentArea] = useState<Area | undefined>(area);
  const [refreshMap, setRefreshMap] = useState(false);
  const updatePolygonsRef = useRef<((newAreas: Area[]) => void) | null>(null);
  const refreshMarkerRef = useRef<() => void>(() => {});

  const center = useMemo(() => {
    if (currentArea && currentArea.coordinates.length > 0) {
      const sumX = currentArea.coordinates.reduce(
        (sum, coord) => sum + coord[0],
        0
      );
      const sumY = currentArea.coordinates.reduce(
        (sum, coord) => sum + coord[1],
        0
      );
      return [
        sumX / currentArea.coordinates.length,
        sumY / currentArea.coordinates.length,
      ] as Coordinate;
    }
    return undefined;
  }, [currentArea]);

  const handlePolygonDrawn = (coordinates: Coordinate[]) => {
    setCurrentArea((prev) => ({
      ...prev!,
      coordinates: coordinates,
    }));
  };

  const handleSave = async () => {
    if (currentArea) {
      await onSave(currentArea);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (currentArea && currentArea.id) {
      await onDelete(currentArea.id.toString());
      onClose();
    }
  };

  const handleClear = () => {
    setCurrentArea((prev) => ({
      ...prev!,
      coordinates: [],
    }));
    setRefreshMap(true);
    setTimeout(() => setRefreshMap(false), 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
          {area ? "Edit Area" : "Add New Area"}
        </h3>
        <MapComponent
          mode={mode}
          onPolygonDrawn={handlePolygonDrawn}
          onMarkerSet={() => {}}
          areas={currentArea ? [currentArea] : []}
          refreshMap={refreshMap}
          refreshMarkerState={false}
          refreshMarkerRef={refreshMarkerRef}
          updatePolygonsRef={updatePolygonsRef}
          center={center}
        />
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
          {area && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreaModal;
