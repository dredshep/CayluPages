import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat, toLonLat } from "ol/proj";
import { Coordinate } from "ol/coordinate";
import { Style, Circle, Fill, Stroke } from "ol/style";
import { setupMap } from "@/utils/geo/mapSetup";
import styled from "styled-components";
import LineString from "ol/geom/LineString";
import { getLength } from "ol/sphere";

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  .ol-control {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    padding: 2px;
  }

  .ol-control button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.5em;
    width: 1.5em;
    background-color: rgba(0, 60, 136, 0.5);
    color: white;
    border: none;
    border-radius: 2px;
    margin: 1px;
    font-size: 1.14em;
  }

  .ol-zoom {
    top: 0.5em;
    left: 0.5em;
  }

  .ol-rotate {
    top: 0.5em;
    right: 0.5em;
  }

  .ol-attribution {
    right: 0.5em;
    bottom: 0.5em;
    max-width: calc(100% - 1.3em);
  }

  .ol-attribution ul {
    font-size: 0.7rem;
    line-height: 1.375em;
    color: #000;
    text-shadow: 0 0 2px #fff;
    max-width: calc(100% - 3.6em);
  }

  .ol-attribution button {
    float: right;
  }
`;

interface MeasureProps {
  center?: Coordinate;
}

const Measure: React.FC<MeasureProps> = ({ center }) => {
  const mapRef = useRef<Map | null>(null);
  const sourceRef = useRef(new VectorSource());
  const [points, setPoints] = useState<Coordinate[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const markerRef = useRef(new VectorSource());

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = setupMap(
        "map",
        sourceRef,
        markerRef,
        center || [-3.7038, 40.4168] // Madrid
      );

      mapRef.current.on("click", (event) => {
        const coordinate = event.coordinate;
        const lonLat = toLonLat(coordinate);

        if (lonLat.some(isNaN)) {
          console.error("Invalid point position detected:", lonLat);
          return;
        }

        setPoints((prevPoints) => {
          if (prevPoints.length < 2) {
            return [...prevPoints, lonLat as Coordinate];
          } else {
            return [lonLat as Coordinate];
          }
        });
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, [center]);

  useEffect(() => {
    sourceRef.current.clear();

    points.forEach((point, index) => {
      const feature = new Feature(new Point(fromLonLat(point)));
      feature.setStyle(
        new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({ color: index === 0 ? "blue" : "red" }),
            stroke: new Stroke({ color: "white", width: 2 }),
          }),
        })
      );
      sourceRef.current.addFeature(feature);
    });

    if (points.length === 2) {
      const lineString = new LineString([
        fromLonLat(points[0]),
        fromLonLat(points[1]),
      ]);
      const lineFeature = new Feature(lineString);
      lineFeature.setStyle(
        new Style({
          stroke: new Stroke({ color: "green", width: 2 }),
        })
      );
      sourceRef.current.addFeature(lineFeature);

      const calculatedDistance = getLength(lineString);
      setDistance(calculatedDistance);
    } else {
      setDistance(null);
    }
  }, [points]);

  return (
    <div>
      <MapWrapper>
        <div
          id="map"
          className="w-full h-96 rounded-lg shadow-lg bg-gray-800"
        ></div>
      </MapWrapper>
      {distance !== null && (
        <div className="mt-4 text-center">
          <p>Distance: {(distance / 1000).toFixed(2)} km</p>
        </div>
      )}
    </div>
  );
};

export default Measure;
