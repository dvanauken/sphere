import { Angle } from "./Angle.js";
import { Coordinate } from "./Coordinate.js";
import { Distance } from "./Distance.js";
import { Sphere } from "./Sphere.js";

export class Arc {
    private constructor(
        private readonly sphereRadius: Distance,
        private readonly centralAngle?: Angle,
        private readonly start?: Coordinate,
        private readonly end?: Coordinate
    ) {}

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
            // Special case for poles
            // if (Math.abs(Math.abs(this.start.latitude) - 90) < 1e-10 || 
            //     Math.abs(Math.abs(this.end.latitude) - 90) < 1e-10) {
            //     const nonPolePoint = Math.abs(this.start.latitude) === 90 ? this.end : this.start;
            //     return Distance.fromMeters(Math.PI * this.sphereRadius.inMeters() * Math.abs(Math.cos(nonPolePoint.latitude * Math.PI / 180)));
            // }

            const lat1 = this.start.latitude * Math.PI / 180;
            const lat2 = this.end.latitude * Math.PI / 180;
            const dLon = (this.end.longitude - this.start.longitude) * Math.PI / 180;

            // Use formula from Vincenty's equations
            const a = Math.cos(lat2) * Math.sin(dLon);
            const b = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
            const c = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon);
            
            const centralAngle = Math.atan2(Math.sqrt(a * a + b * b), c);
            return new Distance(this.sphereRadius.inMeters() * centralAngle);
        } else if (this.centralAngle) {
            return new Distance(this.sphereRadius.inMeters() * this.centralAngle.toRadians());
        } else {
            return new Distance(2 * Math.PI * this.sphereRadius.inMeters());
        }
    }

    interpolate(fraction: number): Coordinate | undefined {
        if (!this.start || !this.end) {
            return undefined;
        }

        if (fraction < 0 || fraction > 1) {
            throw new Error('Fraction must be between 0 and 1');
        }

        if (fraction === 0) return this.start;
        if (fraction === 1) return this.end;
        
        // Convert to radians
        const lat1 = this.start.latitude * Math.PI / 180;
        const lon1 = this.start.longitude * Math.PI / 180;
        const lat2 = this.end.latitude * Math.PI / 180;
        const lon2 = this.end.longitude * Math.PI / 180;

        // Calculate central angle
        const d = 2 * Math.asin(Math.sqrt(
            Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon2 - lon1) / 2), 2)
        ));

        if (Math.abs(d) < 1e-10) {
            return this.start; // Points are effectively identical
        }

        // Interpolation coefficients
        const a = Math.sin((1 - fraction) * d) / Math.sin(d);
        const b = Math.sin(fraction * d) / Math.sin(d);

        // Calculate interpolated point
        const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
        const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
        const z = a * Math.sin(lat1) + b * Math.sin(lat2);

        // Convert back to lat/lon
        const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
        const lon = Math.atan2(y, x);

        return new Coordinate(
            lat * 180 / Math.PI,
            lon * 180 / Math.PI
        );
    }
}