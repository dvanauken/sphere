import { Coordinate } from "../models/Coordinate";
import { GreatCircle } from "../models/GreatCircle";
import { SmallCircle } from "../models/SmallCircle";
import { Sphere } from "../models/Sphere";
import { Triangle } from "../models/Triangle";

export class GeometryService {
  private sphere: Sphere;

  constructor(radius: number) {
    this.sphere = new Sphere(radius);
  }

  createGreatCircle(start: Coordinate, end: Coordinate): GreatCircle {
    return new GreatCircle(start, end);
  }

  createSmallCircle(center: Coordinate, radius: number): SmallCircle {
    return new SmallCircle(center, radius);
  }

  isWithinDistanceFromGreatCircle(coordinate: Coordinate, greatCircle: GreatCircle, distance: number): boolean {
    return true;  // Example placeholder
  }

  createTriangle(a: Coordinate, b: Coordinate, c: Coordinate): Triangle {
    return new Triangle(a, b, c, this.sphere); // Now passing 'sphere' as well
  }

  calculateGeographicCenter(coordinates: Coordinate[]): Coordinate {
    return new Coordinate(0, 0);  // Simplified example return
  }
}
