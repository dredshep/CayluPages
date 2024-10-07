import { Coordinate } from "ol/coordinate";
import React from "react";
import { toast } from "react-toastify";

interface PolygonControlsProps {
  refreshPolygons: () => void;
  refreshMarker: () => void;
  markerPosition: Coordinate | null;
}

const PolygonControls: React.FC<PolygonControlsProps> = ({
  refreshPolygons,
  refreshMarker,
  markerPosition,
}) => {
  function copyMarkerPosition() {
    if (markerPosition) {
      navigator.clipboard.writeText(JSON.stringify(markerPosition));
      toast.success("Marker position copied to clipboard");
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        onClick={refreshPolygons}
        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
      >
        Refresh Polygons
      </button>
      <button
        onClick={refreshMarker}
        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors"
      >
        Refresh Marker
      </button>
      {markerPosition && (
        <button
          onClick={copyMarkerPosition}
          className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 transition-colors"
        >
          Copy Marker Position
        </button>
      )}
    </div>
  );
};

export default PolygonControls;
