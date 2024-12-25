import { Polygon } from "./Polygon.js";


export interface MultiPolygon {
  type: "MultiPolygon";
  coordinates: Polygon['coordinates'][];
}
