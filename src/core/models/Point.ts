// Point.ts
export class Point {
    private constructor(
        private readonly x: number,
        private readonly y: number,
        private readonly z?: number
    ) {}

    static at(x: number, y: number, z?: number): Point {
        return new Point(x, y, z);
    }

    static fromCoordinate(coord: Coordinate): Point {
        const [lat, lon] = coord.toRadians();
        return new Point(
            Math.cos(lat) * Math.cos(lon),
            Math.cos(lat) * Math.sin(lon),
            Math.sin(lat)
        );
    }

    toCoordinate(): Coordinate {
        const lat = Math.asin(this.z ?? Math.sin(0));
        const lon = Math.atan2(this.y, this.x);
        return Coordinate.fromRadians(lat, lon);
    }

    get X(): number { return this.x; }
    get Y(): number { return this.y; }
    get Z(): number | undefined { return this.z; }

    equals(other: Point): boolean {
        const epsilon = 1e-10;  // For floating-point comparisons
        return Math.abs(this.x - other.x) < epsilon &&
               Math.abs(this.y - other.y) < epsilon &&
               (this.z === undefined && other.z === undefined ||
                this.z !== undefined && other.z !== undefined &&
                Math.abs(this.z - other.z) < epsilon);
    }

    toString(): string {
        return `Point(${this.x}, ${this.y}${this.z ? `, ${this.z}` : ''})`;
    }
}

