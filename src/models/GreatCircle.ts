import { Azimuth } from './Azimuth';
import { Coordinate } from './Coordinate';
import { Distance } from './Distance';
import { Point } from './Point';
import { Sphere } from './Sphere';

interface PointGenerationOptions {
    spacing?: Distance;
    minPoints?: number;
    maxPoints?: number;
}

export class GreatCircle {
    private constructor(
        private readonly start: Coordinate,
        private readonly end: Coordinate,
        private readonly sphere: Sphere = Sphere.earth()
    ) {}

    static from = (start: Coordinate) => ({
        to: (end: Coordinate) => new GreatCircle(start, end)
    });

    withSphere = (sphere: Sphere): GreatCircle => 
        new GreatCircle(this.start, this.end, sphere);

    distance = (): Distance => {
        const startPoint = Point.fromCoordinate(this.start);
        const endPoint = Point.fromCoordinate(this.end);
        
        const dLat = endPoint.Y - startPoint.Y;
        const dLon = endPoint.X - startPoint.X;
        
        const a = Math.sin(dLat/2) ** 2 + 
                 Math.cos(startPoint.Y) * 
                 Math.cos(endPoint.Y) * 
                 Math.sin(dLon/2) ** 2;
                 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return new Distance(this.sphere.radius * 1000 * c);
    };

    interpolate = (fraction: number): Coordinate | undefined => {
        if (fraction < 0 || fraction > 1) {
            throw new Error('Fraction must be between 0 and 1');
        }

        const startPoint = Point.fromCoordinate(this.start);
        const endPoint = Point.fromCoordinate(this.end);
        
        const d = this.distance().inMeters() / (this.sphere.radius * 1000);
        
        const A = Math.sin((1 - fraction) * d) / Math.sin(d);
        const B = Math.sin(fraction * d) / Math.sin(d);
        
        const x = A * Math.cos(startPoint.Y) * Math.cos(startPoint.X) +
                 B * Math.cos(endPoint.Y) * Math.cos(endPoint.X);
        const y = A * Math.cos(startPoint.Y) * Math.sin(startPoint.X) +
                 B * Math.cos(endPoint.Y) * Math.sin(endPoint.X);
        const z = A * Math.sin(startPoint.Y) + B * Math.sin(endPoint.Y);
        
        const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
        const lon = Math.atan2(y, x) * 180 / Math.PI;
        
        return Coordinate.at(lat, lon);
    };


    generatePoints = (options: PointGenerationOptions): Coordinate[] => {
        const totalDistance = this.distance();
        
        let numPoints: number;
        if (options.spacing) {
            numPoints = Math.ceil(totalDistance.inMeters() / options.spacing.inMeters());
        } else if (options.minPoints) {
            numPoints = options.minPoints;
        } else {
            numPoints = 100; // default
        }

        if (options.maxPoints) {
            numPoints = Math.min(numPoints, options.maxPoints);
        }

        const points: Coordinate[] = [];
        for (let i = 0; i <= numPoints; i++) {
            const fraction = i / numPoints;
            const point = this.interpolate(fraction);
            if (point) points.push(point);
        }

        return points;
    };

    extend = (distance: Distance): GreatCircle => {
        const bearing = Azimuth.from(this.start).to(this.end).forward();
        const endPoint = this.interpolate(1 + (distance.inMeters() / this.distance().inMeters()));
        return endPoint ? GreatCircle.from(this.start).to(endPoint) : this;
    };

    midpoint = (): Coordinate => 
        this.interpolate(0.5)!;

    toString = (): string =>
        `GreatCircle(${this.start} → ${this.end})`;
}