// GreatCircle.ts
import { Circle } from './Circle.js';
import { Coordinate } from './Coordinate.js';
import { Distance } from './Distance.js';
import { Sphere } from './Sphere.js';
import { Arc } from './Arc.js';

export class GreatCircle extends Circle {
    private readonly arc: Arc;

    private constructor(
        center: Coordinate,
        private readonly radius: Distance,
        sphereRadius: Distance = Sphere.getRadius()
    ) {
        super(center, sphereRadius);
        // Create an arc that represents this great circle
        const northPole = new Coordinate(90, center.longitude);
        this.arc = Arc.between(center, northPole);
    }

    static withCenter(center: Coordinate): GreatCircle {
        const sphereRadius = Sphere.getRadius();
        return new GreatCircle(center, sphereRadius, sphereRadius);
    }

    circumference(): Distance {
        return new Distance(2 * Math.PI * this.sphereRadius.inMeters());
    }

    area(): number {
        return 4 * Math.PI * Math.pow(this.sphereRadius.inMeters() / 1000, 2);
    }

    generatePoints(numPoints: number = 360): Coordinate[] {
        const points: Coordinate[] = [];
        for (let i = 0; i < numPoints; i++) {
            const fraction = i / numPoints;
            const point = this.arc.interpolate(fraction);
            if (point) points.push(point);
        }
        return points;
    }
}