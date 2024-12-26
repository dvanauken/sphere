// Arc.ts
import { Coordinate } from './Coordinate.js';
import { Distance } from './Distance.js';
import { Sphere } from './Sphere.js';
import { Angle } from './Angle.js';

export class Arc {
    private constructor(
        private readonly start: Coordinate,
        private readonly end: Coordinate,
        private readonly sphereRadius: Distance = Sphere.getRadius()
    ) {}

    static between(start: Coordinate, end: Coordinate): Arc {
        return new Arc(start, end);
    }

    static onSphere(sphereRadius: Distance): Arc {
        return new Arc(new Coordinate(0, 0), new Coordinate(0, 0), sphereRadius);
    }

    length(): Distance {
        if (!this.start || !this.end) {
            return new Distance(2 * Math.PI * this.sphereRadius.inMeters());
        }

        // Handle dateline crossing
        let dLon = this.end.longitude - this.start.longitude;
        if (Math.abs(dLon) > 180) {
            dLon = dLon > 0 ? dLon - 360 : dLon + 360;
        }

        const lat1 = this.start.latitude * Math.PI / 180;
        const lat2 = this.end.latitude * Math.PI / 180;
        const dLonRad = dLon * Math.PI / 180;

        // Use Vincenty's formula for better accuracy
        const a = Math.cos(lat2) * Math.sin(dLonRad);
        const b = Math.cos(lat1) * Math.sin(lat2) - 
                 Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLonRad);
        const c = Math.sin(lat1) * Math.sin(lat2) + 
                 Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLonRad);
        
        const centralAngle = Math.atan2(Math.sqrt(a * a + b * b), c);
        return new Distance(this.sphereRadius.inMeters() * centralAngle);
    }

    interpolate(fraction: number): Coordinate | undefined {
        if (!this.start || !this.end) return undefined;
        if (fraction < 0 || fraction > 1) {
            throw new Error('Fraction must be between 0 and 1');
        }
        if (fraction === 0) return this.start;
        if (fraction === 1) return this.end;

        // Handle dateline crossing
        let dLon = this.end.longitude - this.start.longitude;
        if (Math.abs(dLon) > 180) {
            dLon = dLon > 0 ? dLon - 360 : dLon + 360;
        }

        const lat1 = this.start.latitude * Math.PI / 180;
        const lon1 = this.start.longitude * Math.PI / 180;
        const lat2 = this.end.latitude * Math.PI / 180;
        const lon2 = (this.start.longitude + dLon) * Math.PI / 180;

        // Calculate central angle
        const d = 2 * Math.asin(Math.sqrt(
            Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * 
            Math.pow(Math.sin((lon2 - lon1) / 2), 2)
        ));

        if (Math.abs(d) < 1e-10) return this.start;

        // Interpolation coefficients
        const a = Math.sin((1 - fraction) * d) / Math.sin(d);
        const b = Math.sin(fraction * d) / Math.sin(d);

        // Calculate interpolated point
        const x = a * Math.cos(lat1) * Math.cos(lon1) + 
                 b * Math.cos(lat2) * Math.cos(lon2);
        const y = a * Math.cos(lat1) * Math.sin(lon1) + 
                 b * Math.cos(lat2) * Math.sin(lon2);
        const z = a * Math.sin(lat1) + b * Math.sin(lat2);

        // Convert back to lat/lon
        const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
        const lon = Math.atan2(y, x);

        // Handle wrapping around the dateline
        let finalLon = lon * 180 / Math.PI;
        if (Math.abs(dLon) > 180) {
            if (finalLon < -180) finalLon += 360;
            if (finalLon > 180) finalLon -= 360;
        }

        return new Coordinate(lat * 180 / Math.PI, finalLon);
    }
}