import { LineString } from "./LineString";
import { MultiLineString } from "./MultiLineString";
import { MultiPoint } from "./MultiPoint";
import { MultiPolygon } from "./MultiPolygon";
import { Point } from "./Point";
import { Polygon } from "./Polygon";

// GeometryCollection.ts
export interface GeometryCollection {
  type: "GeometryCollection";
  geometries: Array<Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon | GeometryCollection>;
}
