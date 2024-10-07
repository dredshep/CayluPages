import { Coordinate } from "ol/coordinate";
export interface Area {
  id: string;
  coordinates: Coordinate[];
}
export interface ApiArea {
  id: string;
  name: string;
  polygon: string;
}
