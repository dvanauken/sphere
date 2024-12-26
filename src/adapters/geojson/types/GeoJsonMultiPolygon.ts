// GeoJsonMultiPolygon.ts
export interface GeoJsonMultiPolygon {
  type: "MultiPolygon";
  coordinates: [number, number][][][]; // Array of Polygon coordinate arrays
}
