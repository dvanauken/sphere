// This file defines the GreatCircle class. 
// GreatCircle.ts
import { Coordinate } from './Coordinate';
import { Angle } from './Angle';

export class GreatCircle {
    start: Coordinate;
    end: Coordinate;

    constructor(start: Coordinate, end: Coordinate) {
        this.start = start;
        this.end = end;
    }

    // Calculate the distance along the great circle using the haversine formula
    calculateDistance(): number {
        const radius = 6371; // Earth's radius in kilometers
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
        return radius * c;
    }

    // Calculate the midpoint along the great circle path
    findMidpoint(): Coordinate {
        const lat1 = this.start.toRadians().latRadians;
        const lon1 = this.start.toRadians().lonRadians;
        const lat2 = this.end.toRadians().latRadians;
        const lon2 = this.end.toRadians().lonRadians;

        const Bx = Math.cos(lat2) * Math.cos(lon2 - lon1);
        const By = Math.cos(lat2) * Math.sin(lon2 - lon1);
        const lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2),
                                Math.sqrt((Math.cos(lat1) + Bx) ** 2 + By ** 2));
        const lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

        return new Coordinate(lat3 * (180 / Math.PI), lon3 * (180 / Math.PI));
    }
}
