import { LineString } from "./LineString.js";


export interface Polygon {
  type: "Polygon";
  coordinates: LineString['coordinates'][]; // Array of linear rings
}
