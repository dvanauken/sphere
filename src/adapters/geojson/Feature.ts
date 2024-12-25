// Feature.ts
import { GeometryCollection } from "./GeometryCollection.js";
import { LineString } from "./LineString.js";
import { MultiLineString } from "./MultiLineString.js";
import { MultiPoint } from "./MultiPoint.js";
import { MultiPolygon } from "./MultiPolygon.js";
import { Point } from "./Point.js";
import { Polygon } from "./Polygon.js";

export interface Feature {
  type: "Feature";
  geometry: GeometryCollection | Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon;
  properties: { [key: string]: any };
}
