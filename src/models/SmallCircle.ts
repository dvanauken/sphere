import { Coordinate } from './Coordinate';
import { Point } from './Point';
import { Distance } from './Distance';
import { Angle } from './Angle';
import { Sphere } from './Sphere';

export class SmallCircle {
    private readonly centerPoint: Point;

    private constructor(
        private readonly center: Coordinate,
        private readonly radius: Distance,
        private readonly sphere: Sphere = Sphere.earth()
    ) {
        this.centerPoint = Point.fromCoordinate(center);
    }

    static withCenter = (center: Coordinate) => ({
        radius: (radius: Distance) => new SmallCircle(center, radius)
    });

    withSphere = (sphere: Sphere): SmallCircle =>
        new SmallCircle(this.center, this.radius, sphere);

    circumference = (): Distance => {
        const angularRadius = this.radius.inMeters() / (this.sphere.radius * 1000);
        return new Distance(2 * Math.PI * this.sphere.radius * 1000 * Math.sin(angularRadius));
    };

    area = (): number => {
        const angularRadius = this.radius.inMeters() / (this.sphere.radius * 1000);
        return 2 * Math.PI * this.sphere.radius ** 2 * (1 - Math.cos(angularRadius));
    };

    generatePoints = (numPoints: number = 100): Coordinate[] => {
        const points: Coordinate[] = [];
        const angularRadius = this.radius.inMeters() / (this.sphere.radius * 1000);

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

            points.push(Coordinate.at(
                latRad * 180 / Math.PI,
                lonRad * 180 / Math.PI
            ));
        }

        return points;
    };

    toString = (): string =>
        `SmallCircle(center: ${this.center}, radius: ${this.radius})`;
}