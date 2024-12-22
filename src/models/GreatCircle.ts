// This file defines the GreatCircle class. 
// GreatCircle.ts
import { Coordinate } from './Coordinate';
import { Angle } from './Angle';
import { Sphere } from './Sphere';
import { Distance } from './Distance';

// Now let's modify the GreatCircle class to be fluent
export class GreatCircle {
  private readonly start: Coordinate;
  private readonly end: Coordinate;
  private sphere: Sphere;

  constructor(start: Coordinate, end: Coordinate) {
      this.start = start;
      this.end = end;
      this.sphere = Sphere.earth(); // Default Earth sphere
  }

  withSphere(sphere: Sphere): GreatCircle {
      this.sphere = sphere;
      return this;
  }

  // This returns our Distance class instead of a raw number
  calculateDistance(): Distance {
      const lat1 = this.start.toRadians().latRadians;
      const lon1 = this.start.toRadians().lonRadians;
      const lat2 = this.end.toRadians().latRadians;
      const lon2 = this.end.toRadians().lonRadians;

      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;

      const a = Math.sin(dLat/2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
      // Convert to meters for our Distance class
      const distanceInMeters = this.sphere.radius * 1000 * c;
      return new Distance(distanceInMeters);
  }

  // Shorthand method for more fluent API
  distance(): Distance {
      return this.calculateDistance();
  }

  findMidpoint(): Coordinate {
      // Existing midpoint calculation
      const lat1 = this.start.toRadians().latRadians;
      const lon1 = this.start.toRadians().lonRadians;
      const lat2 = this.end.toRadians().latRadians;
      const lon2 = this.end.toRadians().lonRadians;

      const Bx = Math.cos(lat2) * Math.cos(lon2 - lon1);
      const By = Math.cos(lat2) * Math.sin(lon2 - lon1);
      const lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2),
                          Math.sqrt((Math.cos(lat1) + Bx) ** 2 + By ** 2));
      const lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

      return new Coordinate(
          lat3 * (180 / Math.PI), 
          lon3 * (180 / Math.PI)
      );
  }
}