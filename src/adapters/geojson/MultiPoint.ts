import { Point } from "./Point.js";


export interface MultiPoint {
  type: "MultiPoint";
  coordinates: Point['coordinates'][];
}
