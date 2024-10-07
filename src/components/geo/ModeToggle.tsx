import React from "react";
import { Mode } from "@/components/geo/MapComponent";

interface ModeToggleProps {
  currentMode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ currentMode, setMode }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => setMode("browse")}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          currentMode === "browse"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Browse
      </button>
      <button
        onClick={() => setMode("draw")}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          currentMode === "draw"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Draw
      </button>
      <button
        onClick={() => setMode("marker")}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          currentMode === "marker"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Marker
      </button>
    </div>
  );
};

export default ModeToggle;
