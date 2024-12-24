import { Angle } from "./Angle";
import { Coordinate } from "./Coordinate";
import { Distance } from "./Distance";
import { Sphere } from "./Sphere";
import { Point } from "./Point";
import { CoordinateSystem } from "../coordinate/CoordinateSystem";

export class Arc {
    private constructor(
        private readonly sphereRadius: Distance,
        private readonly centralAngle?: Angle,
        private readonly start?: Coordinate,
        private readonly end?: Coordinate
    ) { }

    static onSphere(
        sphereRadius: Distance = Sphere.getRadius(),
        centralAngle?: Angle
    ): Arc {
        return new Arc(sphereRadius, centralAngle);
    }

    static fromPoints(
        start: Coordinate,
        end: Coordinate,
        sphereRadius: Distance = Sphere.getRadius()
    ): Arc {
        return new Arc(sphereRadius, undefined, start, end);
    }

    length(): Distance {
        if (this.start && this.end) {
            const startPoint = CoordinateSystem.fromCoordinate(this.start);
            const endPoint = CoordinateSystem.fromCoordinate(this.end);

            // Calculate central angle using haversine formula
            const dLat = endPoint.Y - startPoint.Y;
            const dLon = endPoint.X - startPoint.X;

            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(startPoint.Y) * Math.cos(endPoint.Y) * Math.sin(dLon / 2) ** 2;

            const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return new Distance(this.sphereRadius.inMeters() * centralAngle);
        } else if (this.centralAngle) {
            return new Distance(this.sphereRadius.inMeters() * this.centralAngle.toRadians());
        } else {
            return new Distance(2 * Math.PI * this.sphereRadius.inMeters());
        }
    }

    interpolate(fraction: number): Coordinate | undefined {
        if (fraction < 0 || fraction > 1) {
            throw new Error('Fraction must be between 0 and 1');
        }

        if (this.start && this.end) {
            const startPoint = CoordinateSystem.fromCoordinate(this.start);
            const endPoint = CoordinateSystem.fromCoordinate(this.end);

            const d = this.length().inMeters() / this.sphereRadius.inMeters();

            const A = Math.sin((1 - fraction) * d) / Math.sin(d);
            const B = Math.sin(fraction * d) / Math.sin(d);

            const x =
                A * Math.cos(startPoint.Y) * Math.cos(startPoint.X) +
                B * Math.cos(endPoint.Y) * Math.cos(endPoint.X);
            const y =
                A * Math.cos(startPoint.Y) * Math.sin(startPoint.X) +
                B * Math.cos(endPoint.Y) * Math.sin(endPoint.X);
            const z = A * Math.sin(startPoint.Y) + B * Math.sin(endPoint.Y);

            const lat3 = Math.atan2(z, Math.sqrt(x * x + y * y));
            const lon3 = Math.atan2(y, x);

            return CoordinateSystem.fromPoint(Point.at(lon3, lat3));
        }
        return undefined;
    }
}