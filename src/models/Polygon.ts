import { Coordinate } from "./Coordinate";
import { Point } from "./Point";
import { CoordinateSystem } from "../CoordinateSystem";

export class Polygon {
    constructor(private readonly vertices: Coordinate[]) {
        if (vertices.length < 3) {
            throw new Error("Polygon must have at least 3 vertices");
        }
    }

    // Coordinate-based constructor
    static fromCoordinates = (coords: Coordinate[]): Polygon => 
        new Polygon(coords);

    // Point-based constructor
    static fromPoints = (points: Point[]): Polygon => {
        const coords = points.map(p => 
            CoordinateSystem.fromPoint(p)
        );
        return new Polygon(coords);
    };

    getVertices = (): Coordinate[] => this.vertices;

    rewind = (): Polygon => {
        const points = this.vertices.map(c => CoordinateSystem.fromCoordinate(c));
        const fixed = this.ensureProperWindingPoints(points);
        return Polygon.fromPoints(fixed);
    };

    private ensureProperWindingPoints = (points: Point[]): Point[] => {
        // Calculate the signed area
        let area = 0;
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length;
            area += points[i].X * points[j].Y - points[j].X * points[i].Y;
        }

        // If area is negative (clockwise), reverse the points
        if (area > 0) {
            return [...points].reverse();
        }
        return points;
    };

    toString = (): string =>
        `Polygon(${this.vertices.length} vertices)`;
}