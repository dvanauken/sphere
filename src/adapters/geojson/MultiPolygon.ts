// MultiPolygon.ts
import { Polygon } from "./Polygon";

export interface MultiPolygon {
  type: "MultiPolygon";
  coordinates: Polygon['coordinates'][];
}
