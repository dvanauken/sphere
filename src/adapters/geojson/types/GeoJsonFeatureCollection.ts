// GeoJsonFeatureCollection.ts
import { GeoJsonFeature } from "./GeoJsonFeature.js";

export interface GeoJsonFeatureCollection {
    type: "FeatureCollection";
    features: GeoJsonFeature[];
}