// Polygon.ts
import { LineString } from "./LineString";

export interface Polygon {
  type: "Polygon";
  coordinates: LineString['coordinates'][]; // Array of linear rings
}
