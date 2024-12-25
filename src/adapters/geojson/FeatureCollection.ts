// FeatureCollection.ts
import { Feature } from "./Feature.js";

export interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}
