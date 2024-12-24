import { Coordinate } from "../models/Coordinate";
import { Point } from "../models/Point";

export class CoordinateSystem {
  static fromCoordinate(coord: Coordinate): Point {
      const lat = coord.latitude * (Math.PI / 180);
      const lon = coord.longitude * (Math.PI / 180);
      return Point.at(lat, lon);
  }

  static fromPoint(point: Point): Coordinate {
      const lat = point.X * (180 / Math.PI);
      const lon = point.Y * (180 / Math.PI);
      return Coordinate.at(lat, lon);
  }
}