import { Coordinate } from "./Coordinate";
import { Point } from "./Point";

export class Polygon {
  // Coordinate-based
  static fromCoordinates = (coords: Coordinate[]) => new Polygon(coords);

  // Point-based 
  static fromPoints = (points: Point[]) => {
      const coords = points.map(p => 
          Coordinate.at(p.Y * 180/Math.PI, p.X * 180/Math.PI)
      );
      return new Polygon(coords);
  };

  rewind = (): Polygon => {
      const points = this.coordinates.map(c => Point.fromCoordinate(c));
      const fixed = this.ensureProperWindingPoints(points);
      return Polygon.fromPoints(fixed);
  };

}