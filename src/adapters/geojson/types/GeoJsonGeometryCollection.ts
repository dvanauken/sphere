// GeoJsonGeometryCollection.ts
import { GeoJsonPoint } from "./GeoJsonPoint.js";
import { GeoJsonLineString } from "./GeoJsonLineString.js";
import { GeoJsonPolygon } from "./GeoJsonPolygon.js";
import { GeoJsonMultiPoint } from "./GeoJsonMultiPoint.js";
import { GeoJsonMultiLineString } from "./GeoJsonMultiLineString.js";
import { GeoJsonMultiPolygon } from "./GeoJsonMultiPolygon.js";

export interface GeoJsonGeometryCollection {
    type: "GeometryCollection";
    geometries: Array<
        | GeoJsonPoint
        | GeoJsonLineString
        | GeoJsonPolygon
        | GeoJsonMultiPoint
        | GeoJsonMultiLineString
        | GeoJsonMultiPolygon
        | GeoJsonGeometryCollection
    >;
}