

// GeoJsonMultiLineString.ts
export interface GeoJsonMultiLineString {
  type: "MultiLineString";
  coordinates: [number, number][][]; // Array of LineString coordinate arrays
}