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
    }
    // toastify it
    toast.success("Marker position copied to clipboard");
  }

  return (
    <div>
      <button
        onClick={refreshPolygons}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-500"
      >
        Refresh Polygons
      </button>
      <button
        onClick={refreshMarker}
        className="bg-green-600 text-white px-4 py-2 rounded-md mt-4 ml-4 hover:bg-green-500"
      >
        Refresh Marker
      </button>
      {/* copy marker position, only if it exists */}
      {markerPosition && (
        <button
          onClick={copyMarkerPosition}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md mt-4 ml-4 hover:bg-yellow-500"
        >
          Copy Marker Position
        </button>
      )}
    </div>
  );
};

export default PolygonControls;
