// This file defines the Arc class. 
// Arc.ts
import { Coordinate } from './Coordinate';
import { Angle } from './Angle';

export class Arc {
    start: Coordinate;
    end: Coordinate;
    circleRadius: number;

    constructor(start: Coordinate, end: Coordinate, circleRadius: number) {
        this.start = start;
        this.end = end;
        this.circleRadius = circleRadius; // This might be the Earth's radius or other, depending on the small circle
    }

    // Calculate the length of the arc
    calculateLength(): number {
        // Placeholder for actual calculation
        // This would involve more complex geometry depending on whether it's a great circle or small circle
        return 0;
    }

    // Calculate any intermediary point on the arc
    findPointAtFraction(fraction: number): Coordinate {
        // This method would compute a point at a given fraction between start and end
        // Placeholder for actual calculation
        return new Coordinate(0, 0);  // Dummy return
    }
}
