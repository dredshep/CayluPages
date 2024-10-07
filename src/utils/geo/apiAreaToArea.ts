import { ApiArea } from "@/types/geo/Area";
import { Area } from "@/types/geo/Area";

export default function apiAreaToArea(apiArea: ApiArea): Area {
  return {
    id: apiArea.id,
    coordinates: apiArea.polygon.split(",").map((coord) =>
      coord.split(" ").map(Number)
    ),
  };
}
