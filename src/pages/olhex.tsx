import React, { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import { Polygon as OlPolygon, Point } from "ol/geom";
import Feature from "ol/Feature";
import { Style, Fill, Stroke, Icon } from "ol/style";
import { latLngToCell, cellToBoundary, gridDisk } from "h3-js";

type Hexagon = {
  hex: string;
  boundary: [number, number][];
};

const isValidLatLng = (value: number, type: "lat" | "lng") => {
  if (isNaN(value)) return false;
  if (type === "lat" && (value < -90 || value > 90)) return false;
  if (type === "lng" && (value < -180 || value > 180)) return false;
  return true;
};

const Dashboard: React.FC = () => {
  const [baseLat, setBaseLat] = useState<number>(40.417892); // Madrid, Spain
  const [baseLng, setBaseLng] = useState<number>(-3.527431); // Madrid, Spain
  const [resolution, setResolution] = useState<number>(9);
  const [checkLat, setCheckLat] = useState<number>(40.4168); // Madrid, Spain
  const [checkLng, setCheckLng] = useState<number>(-3.7038); // Madrid, Spain
  const [hexagons, setHexagons] = useState<Hexagon[]>([]);
  const [isWithinHex, setIsWithinHex] = useState<boolean>(false);
  const [checkHexIndex, setCheckHexIndex] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer | null>(null);
  const [triggerUpdate, setTriggerUpdate] = useState(false);

  const handleUpdate = () => {
    if (
      !isValidLatLng(baseLat, "lat") ||
      !isValidLatLng(baseLng, "lng") ||
      !isValidLatLng(checkLat, "lat") ||
      !isValidLatLng(checkLng, "lng")
    ) {
      setError("Please enter valid latitude and longitude values.");
      return;
    }
    setError(null);

    const baseHexIndex = latLngToCell(baseLat, baseLng, resolution);
    const surroundingHexagons = gridDisk(baseHexIndex, 1);
    const hexes = surroundingHexagons.map((hex) => {
      const boundary = cellToBoundary(hex, true).map(([lat, lng]) => [
        lng,
        lat,
      ]) as [number, number][];
      return { hex, boundary };
    });

    setHexagons(hexes);
    const checkHex = latLngToCell(checkLat, checkLng, resolution);
    setCheckHexIndex(checkHex);
    setIsWithinHex(surroundingHexagons.includes(checkHex));
    setTriggerUpdate(!triggerUpdate);
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([baseLng, baseLat]),
          zoom: 17,
        }),
      });
    }

    if (!vectorLayerRef.current) {
      vectorLayerRef.current = new VectorLayer({
        source: new VectorSource(),
      });
      mapRef.current.addLayer(vectorLayerRef.current);
    }

    const vectorSource = vectorLayerRef.current?.getSource();
    vectorSource?.clear();

    // Add hexagons to the vector source
    const hexagonFeatures = hexagons.map(({ boundary }) => {
      const polygon = new OlPolygon([boundary]);
      const feature = new Feature(polygon);
      feature.setStyle(
        new Style({
          stroke: new Stroke({
            color: "blue",
            width: 2,
          }),
          fill: new Fill({
            color: "rgba(0, 0, 255, 0.1)",
          }),
        })
      );
      return feature;
    });

    // Add base and check point markers
    const baseMarker = new Feature({
      geometry: new Point(fromLonLat([baseLng, baseLat])),
    });
    baseMarker.setStyle(
      new Style({
        image: new Icon({
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
          scale: 0.05,
        }),
      })
    );

    const checkMarker = new Feature({
      geometry: new Point(fromLonLat([checkLng, checkLat])),
    });
    checkMarker.setStyle(
      new Style({
        image: new Icon({
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
          scale: 0.05,
        }),
      })
    );

    vectorSource?.addFeatures([...hexagonFeatures, baseMarker, checkMarker]);

    // Update the map view center if the base coordinates change
    mapRef.current?.getView().setCenter(fromLonLat([baseLng, baseLat]));
  }, [triggerUpdate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Hexagon Dashboard
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <InputField
            label="Base Latitude:"
            value={baseLat}
            onChange={(e) => setBaseLat(parseFloat(e.target.value))}
            type="text"
          />
          <InputField
            label="Base Longitude:"
            value={baseLng}
            onChange={(e) => setBaseLng(parseFloat(e.target.value))}
            type="text"
          />
          <InputField
            label="Resolution:"
            value={resolution}
            type="number"
            onChange={(e) => setResolution(parseInt(e.target.value))}
          />
          <InputField
            label="Check Latitude:"
            value={checkLat}
            onChange={(e) => setCheckLat(parseFloat(e.target.value))}
            type="text"
          />
          <InputField
            label="Check Longitude:"
            value={checkLng}
            onChange={(e) => setCheckLng(parseFloat(e.target.value))}
            type="text"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Update Map
        </button>
        <div>
          <p className="text-lg font-medium text-gray-900">
            Check Hex Index: {checkHexIndex}
          </p>
          <p className="text-lg font-medium text-gray-900">
            Is Within Hex: {isWithinHex ? "Yes" : "No"}
          </p>
        </div>
      </div>
      <div
        id="map"
        className="w-full max-w-4xl h-96 rounded-lg shadow-md"
      ></div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  value: number;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  type = "number",
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </label>
  </div>
);

export default Dashboard;
