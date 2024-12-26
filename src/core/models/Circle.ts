// Circle.ts
import { Coordinate } from './Coordinate.js';
import { Distance } from './Distance.js';
import { Sphere } from './Sphere.js';
import { Point } from './Point.js';

export abstract class Circle {
    protected constructor(
        protected readonly center: Coordinate,
        protected readonly sphereRadius: Distance = Sphere.getRadius()
    ) {}

    abstract circumference(): Distance;
    abstract area(): number;
    abstract generatePoints(numPoints?: number): Coordinate[];

    getCenter(): Coordinate {
        return this.center;
    }

    getSphereRadius(): Distance {
        return this.sphereRadius;
    }
}
