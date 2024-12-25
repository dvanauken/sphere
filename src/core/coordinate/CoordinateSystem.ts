import { Coordinate } from "../models/Coordinate.js";
import { Point } from "../models/Point.js";

export class CoordinateSystem {
  static fromCoordinate(coord: Coordinate): Point {
      const lat = coord.latitude * (Math.PI / 180);
      const lon = coord.longitude * (Math.PI / 180);
      return Point.at(lon, lat);
  }

  static fromPoint(point: Point): Coordinate {
      const lat = point.X * (180 / Math.PI);
      const lon = point.Y * (180 / Math.PI);
      return Coordinate.at(lat, lon);
  }
}