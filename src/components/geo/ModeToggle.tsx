import React from "react";
import { Mode } from "@/components/geo/MapComponent";
interface ModeToggleProps {
  currentMode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ currentMode, setMode }) => {
  return (
    <div className="flex space-x-4 mt-4">
      <button
        onClick={() => setMode("browse")}
        className={`px-4 py-2 rounded-md ${
          currentMode === "browse"
            ? "bg-gray-600 text-white"
            : "bg-gray-400 text-gray-800"
        }`}
      >
        Browse
      </button>
      <button
        onClick={() => setMode("draw")}
        className={`px-4 py-2 rounded-md ${
          currentMode === "draw"
            ? "bg-blue-600 text-white"
            : "bg-gray-400 text-gray-800"
        }`}
      >
        Draw Polygon
      </button>
      <button
        onClick={() => setMode("marker")}
        className={`px-4 py-2 rounded-md ${
          currentMode === "marker"
            ? "bg-green-600 text-white"
            : "bg-gray-400 text-gray-800"
        }`}
      >
        Place Marker
      </button>
    </div>
  );
};

export default ModeToggle;
