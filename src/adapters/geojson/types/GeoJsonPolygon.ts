export interface GeoJsonPolygon {
  type: "Polygon";
  coordinates: [number, number][][]; // Array of linear rings, each ring is array of [longitude, latitude]
}
