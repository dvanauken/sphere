import { Point } from "./Point.js";


export interface LineString {
  type: "LineString";
  coordinates: Point['coordinates'][];
}
