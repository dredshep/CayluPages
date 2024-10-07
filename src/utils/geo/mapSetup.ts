import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { Coordinate } from "ol/coordinate";
export const setupMap = (
  target: HTMLElement,
  sourceRef: React.MutableRefObject<VectorSource>,
  markerRef: React.MutableRefObject<VectorSource>,
  center: Coordinate,
) => {
  return new Map({
    target: target,
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      new VectorLayer({
        source: sourceRef.current,
      }),
      new VectorLayer({
        source: markerRef.current,
      }),
    ],
    view: new View({
      center: fromLonLat(center),
      zoom: 12,
    }),
  });
};
