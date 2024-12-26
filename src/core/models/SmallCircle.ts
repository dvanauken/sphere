// SmallCircle.ts
import { Circle } from './Circle.js';
import { Coordinate } from './Coordinate.js';
import { Distance } from './Distance.js';
import { Sphere } from './Sphere.js';

export class SmallCircle extends Circle {
    private constructor(
        center: Coordinate,
        private readonly radius: Distance,
        sphereRadius: Distance = Sphere.getRadius()
    ) {
        super(center, sphereRadius);
    }

    static withCenter(center: Coordinate): { radius: (radius: Distance) => SmallCircle } {
        return {
            radius: (radius: Distance) => new SmallCircle(center, radius)
        };
    }

    getRadius(): Distance {
        return this.radius;
    }

    circumference(): Distance {
        const angularRadius = this.radius.inMeters() / this.sphereRadius.inMeters();
        return new Distance(
            2 * Math.PI * this.sphereRadius.inMeters() * Math.sin(angularRadius)
        );
    }

    area(): number {
        const angularRadius = this.radius.inMeters() / this.sphereRadius.inMeters();
        const sphereRadiusKm = this.sphereRadius.inMeters() / 1000;
        return 2 * Math.PI * Math.pow(sphereRadiusKm, 2) * 
               (1 - Math.cos(angularRadius));
    }

    generatePoints(numPoints: number = 100): Coordinate[] {
        const points: Coordinate[] = [];
        const angularRadius = this.radius.inMeters() / this.sphereRadius.inMeters();

        for (let i = 0; i <= numPoints; i++) {
            const angle = (2 * Math.PI * i) / numPoints;
            
            const latRad = Math.asin(
                Math.sin(this.center.latitude * Math.PI / 180) * Math.cos(angularRadius) +
                Math.cos(this.center.latitude * Math.PI / 180) * Math.sin(angularRadius) * Math.cos(angle)
            );

            const lonRad = (this.center.longitude * Math.PI / 180) + Math.atan2(
                Math.sin(angle) * Math.sin(angularRadius) * Math.cos(this.center.latitude * Math.PI / 180),
                Math.cos(angularRadius) - Math.sin(this.center.latitude * Math.PI / 180) * Math.sin(latRad)
            );

            // Handle dateline crossing
            let lon = lonRad * 180 / Math.PI;
            if (lon > 180) lon -= 360;
            if (lon < -180) lon += 360;

            points.push(new Coordinate(latRad * 180 / Math.PI, lon));
        }

        return points;
    }
}