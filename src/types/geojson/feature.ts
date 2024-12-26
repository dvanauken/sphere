// src/types/geojson/feature.ts
import {
  GeoJsonPoint,
  GeoJsonLineString,
  GeoJsonPolygon,
  GeoJsonMultiPoint,
  GeoJsonMultiLineString,
  GeoJsonMultiPolygon,
  GeoJsonGeometryCollection
} from './geometries.js';

export interface GeoJsonFeature<G extends 
  | GeoJsonPoint
  | GeoJsonLineString
  | GeoJsonPolygon
  | GeoJsonMultiPoint
  | GeoJsonMultiLineString
  | GeoJsonMultiPolygon
  | GeoJsonGeometryCollection
> {
  type: "Feature";
  geometry: G;
  properties: { [key: string]: any };
}

export interface GeoJsonFeatureCollection<G extends 
  | GeoJsonPoint
  | GeoJsonLineString
  | GeoJsonPolygon
  | GeoJsonMultiPoint
  | GeoJsonMultiLineString
  | GeoJsonMultiPolygon
  | GeoJsonGeometryCollection
> {
  type: "FeatureCollection";
  features: Array<GeoJsonFeature<G>>;
}

// src/types/geojson/index.ts
export * from './geometries.js';
export * from './feature.js';