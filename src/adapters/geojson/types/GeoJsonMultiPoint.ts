export interface GeoJsonMultiPoint {
  type: "MultiPoint";
  coordinates: [number, number][]; // Array of [longitude, latitude]
}