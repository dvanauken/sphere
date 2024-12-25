import { Coordinate } from './Coordinate.js';
import { Angle } from './Angle.js';
import { Azimuth } from './Azimuth.js';

export class Bearing {
    private constructor(
        private readonly start: Coordinate,
        private readonly end: Coordinate
    ) {}

    static from = (start: Coordinate) => ({
        to: (end: Coordinate) => new Bearing(start, end)
    });

    initial = (): Angle => 
        Azimuth.from(this.start).to(this.end).forward();

    final = (): Angle => 
        Azimuth.from(this.start).to(this.end).reverse();

    toString = (): string => 
        `Bearing(${this.start} → ${this.end})`;
}