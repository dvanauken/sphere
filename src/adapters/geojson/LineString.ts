// LineString.ts
import { Point } from "./Point";

export interface LineString {
  type: "LineString";
  coordinates: Point['coordinates'][];
}
