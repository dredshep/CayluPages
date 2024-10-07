import { Coordinate } from "ol/coordinate";
import { fromLonLat } from "ol/proj";
import { getLength } from "ol/sphere";
import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";

export interface PolygonWithId {
  id: string;
  coordinates: Coordinate[];
}
/**
 * @description Measure the distance between two points in meters
 * @param point1
 * @param point2
 * @returns distance in meters
 */
export const measureDistance = (
  point1: Coordinate,
  point2: Coordinate,
): number => {
  const lineString = new LineString([fromLonLat(point1), fromLonLat(point2)]);
  return getLength(lineString);
};

/**
 * @description Find which **polygon** contains the **point**
 * @param point
 * @param polygons
 * @returns polygon id
 */
export const findPolygonContainingPoint = (
  point: Coordinate,
  polygons: PolygonWithId[],
): string | null => {
  const pointInMapProjection = fromLonLat(point);

  for (const polygon of polygons) {
    const olPolygon = new Polygon([
      polygon.coordinates.map((coord) => fromLonLat(coord)),
    ]);
    if (olPolygon.intersectsCoordinate(pointInMapProjection)) {
      return polygon.id;
    }
  }

  return null;
};

/**
 * @description Find which **points** are inside the **polygon**
 * @param points
 * @param polygonCoordinates
 * @returns points inside the polygon
 */
export const findPointsInPolygon = (
  points: Coordinate[],
  polygonCoordinates: Coordinate[],
): Coordinate[] => {
  const polygon = new Polygon([
    polygonCoordinates.map((coord) => fromLonLat(coord)),
  ]);

  return points.filter((point) => {
    const pointInMapProjection = fromLonLat(point);
    return polygon.intersectsCoordinate(pointInMapProjection);
  });
};
