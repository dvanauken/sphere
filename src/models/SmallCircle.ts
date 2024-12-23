import { Coordinate } from './Coordinate';
import { Point } from './Point';
import { Distance } from './Distance';
import { Angle } from './Angle';
import { Sphere } from './Sphere';
import { CoordinateSystem } from '../CoordinateSystem';

export class SmallCircle {
    private readonly centerPoint: Point;

    private constructor(
        private readonly center: Coordinate,
        private readonly circleRadius: Distance,
        private readonly sphereRadius: Distance = Sphere.getRadius()
    ) {
        this.centerPoint = CoordinateSystem.fromCoordinate(center);
    }

    static withCenter = (center: Coordinate) => ({
        radius: (radius: Distance) => new SmallCircle(center, radius)
    });

    withSphere = (sphere: Sphere): SmallCircle =>
        new SmallCircle(this.center, this.circleRadius, Sphere.getRadius());

    circumference = (): Distance => {
        const angularRadius = this.circleRadius.inMeters() / this.sphereRadius.inMeters();
        return new Distance(2 * Math.PI * this.sphereRadius.inMeters() * Math.sin(angularRadius));
    };

    area = (): number => {
        const angularRadius = this.circleRadius.inMeters() / this.sphereRadius.inMeters();
        const sphereRadiusKm = this.sphereRadius.inMeters() / 1000;
        return 2 * Math.PI * Math.pow(sphereRadiusKm, 2) * (1 - Math.cos(angularRadius));
    };

    generatePoints = (numPoints: number = 100): Coordinate[] => {
        const points: Coordinate[] = [];
        const angularRadius = this.circleRadius.inMeters() / this.sphereRadius.inMeters();

        for (let i = 0; i < numPoints; i++) {
            const angle = (2 * Math.PI * i) / numPoints;
            const latRad = Math.asin(
                Math.sin(this.centerPoint.Y) * Math.cos(angularRadius) +
                Math.cos(this.centerPoint.Y) * Math.sin(angularRadius) * Math.cos(angle)
            );
            const lonRad = this.centerPoint.X + Math.atan2(
                Math.sin(angle) * Math.sin(angularRadius) * Math.cos(this.centerPoint.Y),
                Math.cos(angularRadius) - Math.sin(this.centerPoint.Y) * Math.sin(latRad)
            );

            points.push(CoordinateSystem.fromPoint(Point.at(lonRad, latRad)));
        }

        return points;
    };

    getRadius = (): Distance => this.circleRadius;

    toString = (): string =>
        `SmallCircle(center: ${this.center}, radius: ${this.circleRadius})`;
}