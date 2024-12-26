// src/types/geojson/geometries.ts
export interface GeoJsonPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface GeoJsonLineString {
  type: "LineString";
  coordinates: [number, number][];
}

export interface GeoJsonPolygon {
  type: "Polygon";
  coordinates: [number, number][][];
}

export interface GeoJsonMultiPoint {
  type: "MultiPoint";
  coordinates: [number, number][];
}

export interface GeoJsonMultiLineString {
  type: "MultiLineString";
  coordinates: [number, number][][];
}

export interface GeoJsonMultiPolygon {
  type: "MultiPolygon";
  coordinates: [number, number][][][];
}

export interface GeoJsonGeometryCollection {
  type: "GeometryCollection";
  geometries: Array<
      | GeoJsonPoint 
      | GeoJsonLineString 
      | GeoJsonPolygon 
      | GeoJsonMultiPoint 
      | GeoJsonMultiLineString 
      | GeoJsonMultiPolygon
  >;
}

