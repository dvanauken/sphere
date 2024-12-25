import { LineString } from "./LineString.js";
import { MultiLineString } from "./MultiLineString.js";
import { MultiPoint } from "./MultiPoint.js";
import { MultiPolygon } from "./MultiPolygon.js";
import { Point } from "./Point.js";
import { Polygon } from "./Polygon.js";


// GeometryCollection.ts
export interface GeometryCollection {
  type: "GeometryCollection";
  geometries: Array<Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon | GeometryCollection>;
}
