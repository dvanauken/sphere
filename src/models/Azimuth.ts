import { Coordinate } from './Coordinate';
import { Angle } from './Angle';
import { CoordinateSystem } from '../CoordinateSystem';

export class Azimuth {
    private constructor(
        private readonly start: Coordinate,
        private readonly end: Coordinate
    ) {}

    static from = (start: Coordinate) => ({
        to: (end: Coordinate) => new Azimuth(start, end)
    });

    forward = (): Angle => {
        const startPoint = CoordinateSystem.fromCoordinate(this.start);
        const endPoint = CoordinateSystem.fromCoordinate(this.end);

        const dLon = endPoint.X - startPoint.X;
        const y = Math.sin(dLon) * Math.cos(endPoint.Y);
        const x = Math.cos(startPoint.Y) * Math.sin(endPoint.Y) -
                 Math.sin(startPoint.Y) * Math.cos(endPoint.Y) * Math.cos(dLon);
        
        const azimuthRadians = Math.atan2(y, x);
        const azimuthDegrees = (azimuthRadians * (180 / Math.PI) + 360) % 360;

        return new Angle(azimuthDegrees);
    };

    reverse = (): Angle => {
        const forward = this.forward().degrees;
        return new Angle((forward + 180) % 360);
    };

    toString = (): string => 
        `Azimuth(${this.start} → ${this.end})`;
}