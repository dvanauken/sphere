// GeoJsonFeature.ts
import { GeoJsonGeometryCollection } from "./GeoJsonGeometryCollection.js";
import { GeoJsonPoint } from "./GeoJsonPoint.js";
import { GeoJsonLineString } from "./GeoJsonLineString.js";
import { GeoJsonMultiLineString } from "./GeoJsonMultiLineString.js";
import { GeoJsonMultiPolygon } from "./GeoJsonMultiPolygon.js";
import { GeoJsonPolygon } from "./GeoJsonPolygon.js";
import { GeoJsonMultiPoint } from "./GeoJsonMultiPoint.js";

export interface GeoJsonFeature {
    type: "Feature";
    geometry: 
        | GeoJsonGeometryCollection
        | GeoJsonPoint
        | GeoJsonLineString
        | GeoJsonPolygon
        | GeoJsonMultiPoint
        | GeoJsonMultiLineString
        | GeoJsonMultiPolygon;
    properties: { [key: string]: any };
}