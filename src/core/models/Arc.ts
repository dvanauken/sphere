import { Angle } from "./Angle.js";
import { Coordinate } from "./Coordinate.js";
import { Distance } from "./Distance.js";
import { Sphere } from "./Sphere.js";
import { Point } from "./Point.js";
import { CoordinateSystem } from "../coordinate/CoordinateSystem.js";

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

            const lat1 = startPoint.Y;
            const lon1 = startPoint.X;
            const lat2 = endPoint.Y;
            const lon2 = endPoint.X;

            // Haversine formula for great circle distance
            const havLat = Math.sin((lat2 - lat1)/2) ** 2;
            const havLon = Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1)/2) ** 2;
            
            const a = havLat + havLon;
            const centralAngle = 2 * Math.asin(Math.sqrt(a));

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

            const lat1 = startPoint.Y;
            const lon1 = startPoint.X;
            const lat2 = endPoint.Y;
            const lon2 = endPoint.X;

            // Calculate central angle using haversine formula
            const havLat = Math.sin((lat2 - lat1)/2) ** 2;
            const havLon = Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1)/2) ** 2;
            const centralAngle = 2 * Math.asin(Math.sqrt(havLat + havLon));

            if (Math.abs(centralAngle) < 1e-10) {
                return this.start; // Points are effectively identical
            }

            const A = Math.sin((1 - fraction) * centralAngle) / Math.sin(centralAngle);
            const B = Math.sin(fraction * centralAngle) / Math.sin(centralAngle);

            // Calculate 3D cartesian coordinates
            const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
            const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
            const z = A * Math.sin(lat1) + B * Math.sin(lat2);

            // Convert back to spherical coordinates
            const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
            const lon = Math.atan2(y, x);

            return CoordinateSystem.fromPoint(Point.at(lon, lat));
        }
        return undefined;
    }
}