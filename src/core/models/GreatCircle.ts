import { CoordinateSystem } from '../coordinate/CoordinateSystem.js';
import { Azimuth } from './Azimuth.js';
import { Coordinate } from './Coordinate.js';
import { Distance } from './Distance.js';
import { Point } from './Point.js';
import { Sphere } from './Sphere.js';

interface PointGenerationOptions {
   spacing?: Distance;
   minPoints?: number;
   maxPoints?: number;
}

export class GreatCircle {
   public constructor(
       private readonly start: Coordinate,
       private readonly end: Coordinate,
       private readonly sphereRadius: Distance = Sphere.getRadius()
   ) {}

   static from(start: Coordinate) {
       return {
           to: (end: Coordinate) => new GreatCircle(start, end)
       };
   }

   withSphere = (sphereRadius: Distance): GreatCircle => 
       new GreatCircle(this.start, this.end, sphereRadius);

   distance = (): Distance => {
       const startPoint = CoordinateSystem.fromCoordinate(this.start);
       const endPoint = CoordinateSystem.fromCoordinate(this.end);

       const lat1 = startPoint.Y;
       const lat2 = endPoint.Y;
       const dLon = endPoint.X - startPoint.X;

       // Haversine formula for great circle distance
       const havLat = Math.sin((lat2 - lat1)/2) ** 2;
       const havLon = Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) ** 2;
       
       const a = havLat + havLon;
       const centralAngle = 2 * Math.asin(Math.sqrt(a));
       
       return new Distance(this.sphereRadius.inMeters() * centralAngle);
   };

   interpolate = (fraction: number): Coordinate | undefined => {
       if (fraction < 0 || fraction > 1) {
           throw new Error('Fraction must be between 0 and 1');
       }

       const startPoint = CoordinateSystem.fromCoordinate(this.start);
       const endPoint = CoordinateSystem.fromCoordinate(this.end);

       const lat1 = startPoint.Y;
       const lon1 = startPoint.X;
       const lat2 = endPoint.Y;
       const lon2 = endPoint.X;

       // Calculate central angle and interpolation coefficients
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
   };

   generatePoints = (options: PointGenerationOptions): Coordinate[] => {
       const totalDistance = this.distance();
       
       let numPoints: number;
       if (options.spacing) {
           numPoints = Math.ceil(totalDistance.inMeters() / options.spacing.inMeters());
       } else if (options.minPoints) {
           numPoints = options.minPoints;
       } else {
           numPoints = 100;
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