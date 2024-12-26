// GeoJsonLineString.ts
import { GeoJsonPoint } from "./GeoJsonPoint.js";

export interface GeoJsonLineString {
    type: "LineString";
    coordinates: [number, number][]; // Array of [longitude, latitude]
}
