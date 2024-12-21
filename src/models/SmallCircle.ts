// This file defines the SmallCircle class. 
// SmallCircle.ts
import { Coordinate } from './Coordinate';

export class SmallCircle {
    center: Coordinate;
    angularRadius: number; // Angular radius in degrees

    constructor(center: Coordinate, angularRadius: number) {
        this.center = center;
        this.angularRadius = angularRadius;
    }

    // Calculate the circumference of the small circle
    circumference(): number {
        const earthRadius = 6371; // Earth's average radius in kilometers
        const angularRadiusRadians = this.angularRadius * Math.PI / 180; // Convert angular radius to radians
        return 2 * Math.PI * earthRadius * Math.sin(angularRadiusRadians);
    }

    // Calculate the area of the small circle
    area(): number {
        const earthRadius = 6371; // Earth's radius in kilometers
        const angularRadiusRadians = this.angularRadius * Math.PI / 180; // Convert angular radius to radians
        return 2 * Math.PI * earthRadius * earthRadius * (1 - Math.cos(angularRadiusRadians));
    }

    // Calculate the angular diameter of the small circle
    angularDiameter(): number {
        return 2 * this.angularRadius;
    }

    // Optional: Convert the small circle definition to a string for easy debugging
    toString(): string {
        return `SmallCircle(Center: ${this.center.toString()}, Angular Radius: ${this.angularRadius} degrees)`;
    }
}
