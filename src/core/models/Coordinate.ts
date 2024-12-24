export class Coordinate {
    public constructor(
        private readonly lat: number,
        private readonly lon: number,
        private readonly alt?: number
    ) {
        if (lat < -90 || lat > 90) {
            throw new Error('Latitude must be between -90 and 90 degrees');
        }
        if (lon < -180 || lon > 180) {
            throw new Error('Longitude must be between -180 and 180 degrees');
        }
    }

    static at = (lat: number, lon: number, alt?: number) => 
        new Coordinate(lat, lon, alt);

    get latitude(): number {
        return this.lat;
    }

    get longitude(): number {
        return this.lon;
    }

    get altitude(): number | undefined {
        return this.alt;
    }

    equals = (other: Coordinate): boolean => 
        this.lat === other.lat && 
        this.lon === other.lon && 
        this.alt === other.alt;

    toString = (): string =>
        `(${this.lat}°, ${this.lon}°${this.alt ? `, ${this.alt}m` : ''})`;
}