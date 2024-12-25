import { LineString } from "./LineString.js";


export interface MultiLineString {
  type: "MultiLineString";
  coordinates: LineString['coordinates'][];
}
