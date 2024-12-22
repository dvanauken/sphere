import { Coordinate } from './Coordinate.js';
import { Angle } from './Angle.js';
import { Distance } from './Distance.js';
import { Sphere } from './Sphere.js';

export class Arc {
    private constructor(
        private readonly sphere: Sphere,
        private readonly centralAngle?: Angle,
        private readonly start?: Coordinate,
        private readonly end?: Coordinate
    ) { }

    static onSphere(
        sphere: Sphere = Sphere.earth(),
        centralAngle?: Angle
    ): Arc {
        return new Arc(sphere, centralAngle);
    }

    static fromPoints(
        start: Coordinate,
        end: Coordinate,
        sphere: Sphere = Sphere.earth()
    ): Arc {
        return new Arc(sphere, undefined, start, end);
    }

    length(): Distance {
        if (this.start && this.end) {
            // Calculate from points using great circle formula
            const lat1 = this.start.toRadians().latRadians;
            const lon1 = this.start.toRadians().lonRadians;
            const lat2 = this.end.toRadians().latRadians;
            const lon2 = this.end.toRadians().lonRadians;

            // Calculate central angle using haversine formula
            const dLat = lat2 - lat1;
            const dLon = lon2 - lon1;

            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

            const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return new Distance(this.sphere.radius * 1000 * centralAngle);
        } else if (this.centralAngle) {
            return new Distance(this.sphere.radius * 1000 * this.centralAngle.toRadians());
        } else {
            // Full circumference if no angle specified
            return new Distance(2 * Math.PI * this.sphere.radius * 1000);
        }
    }

    interpolate(fraction: number): Coordinate | undefined {
        if (fraction < 0 || fraction > 1) {
            throw new Error('Fraction must be between 0 and 1');
        }

        if (this.start && this.end) {
            const lat1 = this.start.toRadians().latRadians;
            const lon1 = this.start.toRadians().lonRadians;
            const lat2 = this.end.toRadians().latRadians;
            const lon2 = this.end.toRadians().lonRadians;

            const d = this.length().inMeters() / (this.sphere.radius * 1000);

            const A = Math.sin((1 - fraction) * d) / Math.sin(d);
            const B = Math.sin(fraction * d) / Math.sin(d);

            const x =
                A * Math.cos(lat1) * Math.cos(lon1) +
                B * Math.cos(lat2) * Math.cos(lon2);
            const y =
                A * Math.cos(lat1) * Math.sin(lon1) +
                B * Math.cos(lat2) * Math.sin(lon2);
            const z = A * Math.sin(lat1) + B * Math.sin(lat2);

            const lat3 = Math.atan2(z, Math.sqrt(x * x + y * y));
            const lon3 = Math.atan2(y, x);

            return new Coordinate(
                (lat3 * 180) / Math.PI,
                (lon3 * 180) / Math.PI
            );
        }
        return undefined;
    }
}