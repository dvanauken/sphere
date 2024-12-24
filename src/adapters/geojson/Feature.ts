// Feature.ts
import { GeometryCollection } from "./GeometryCollection";
import { LineString } from "./LineString";
import { MultiLineString } from "./MultiLineString";
import { MultiPoint } from "./MultiPoint";
import { MultiPolygon } from "./MultiPolygon";
import { Point } from "./Point";
import { Polygon } from "./Polygon";

export interface Feature {
  type: "Feature";
  geometry: GeometryCollection | Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon;
  properties: { [key: string]: any };
}
