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
       
       const dLat = endPoint.Y - startPoint.Y;
       const dLon = endPoint.X - startPoint.X;
       
       const a = Math.sin(dLat/2) ** 2 + 
                Math.cos(startPoint.Y) * 
                Math.cos(endPoint.Y) * 
                Math.sin(dLon/2) ** 2;
                
       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
       
       return new Distance(this.sphereRadius.inMeters() * c);
   };

   interpolate = (fraction: number): Coordinate | undefined => {
       if (fraction < 0 || fraction > 1) {
           throw new Error('Fraction must be between 0 and 1');
       }

       const startPoint = CoordinateSystem.fromCoordinate(this.start);
       const endPoint = CoordinateSystem.fromCoordinate(this.end);
       
       const d = this.distance().inMeters() / this.sphereRadius.inMeters();
       
       const A = Math.sin((1 - fraction) * d) / Math.sin(d);
       const B = Math.sin(fraction * d) / Math.sin(d);
       
       const x = A * Math.cos(startPoint.Y) * Math.cos(startPoint.X) +
                B * Math.cos(endPoint.Y) * Math.cos(endPoint.X);
       const y = A * Math.cos(startPoint.Y) * Math.sin(startPoint.X) +
                B * Math.cos(endPoint.Y) * Math.sin(endPoint.X);
       const z = A * Math.sin(startPoint.Y) + B * Math.sin(endPoint.Y);
       
       const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
       const lon = Math.atan2(y, x);
       
       return CoordinateSystem.fromPoint(Point.at(lon, lat));
   };

   // Rest of the methods remain unchanged
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