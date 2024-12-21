// This file defines the Azimuth class. 
// Azimuth.ts
import { Coordinate } from './Coordinate';
import { Angle } from './Angle';

export class Azimuth {
    start: Coordinate;
    end: Coordinate;

    constructor(start: Coordinate, end: Coordinate) {
        this.start = start;
        this.end = end;
    }

    // Calculate the azimuth angle in degrees from north
    calculateAzimuth(): number {
        const lat1 = this.start.toRadians().latRadians;
        const lon1 = this.start.toRadians().lonRadians;
        const lat2 = this.end.toRadians().latRadians;
        const lon2 = this.end.toRadians().lonRadians;

        const dLon = lon2 - lon1;
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) -
                  Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        const angle = Math.atan2(y, x);

        return (angle * (180 / Math.PI) + 360) % 360;  // Normalize angle to positive degrees
    }
}
