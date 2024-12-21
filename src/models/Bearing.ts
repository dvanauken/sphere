// This file defines the Bearing class. 
// Bearing.ts
import { Coordinate } from './Coordinate';
import { Azimuth } from './Azimuth';

export class Bearing {
    start: Coordinate;
    end: Coordinate;

    constructor(start: Coordinate, end: Coordinate) {
        this.start = start;
        this.end = end;
    }

    // Calculate the initial bearing using azimuth calculations
    calculateInitialBearing(): number {
        const azimuth = new Azimuth(this.start, this.end);
        return azimuth.calculateAzimuth();
    }

    // Calculate the final bearing by reversing start and end
    calculateFinalBearing(): number {
        const azimuth = new Azimuth(this.end, this.start);
        return (azimuth.calculateAzimuth() + 180) % 360;  // Adjust by 180 degrees to get the opposite direction
    }
}
