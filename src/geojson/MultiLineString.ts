// MultiLineString.ts
import { LineString } from "./LineString";

export interface MultiLineString {
  type: "MultiLineString";
  coordinates: LineString['coordinates'][];
}
