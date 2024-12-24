// MultiPoint.ts
import { Point } from "./Point";

export interface MultiPoint {
  type: "MultiPoint";
  coordinates: Point['coordinates'][];
}
