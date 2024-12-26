// Coordinate.ts
export class Coordinate {
    public constructor(
        private readonly lat: number,
        private readonly lon: number,
        private readonly alt?: number,
        private readonly isRadians: boolean = false
    ) {
        if (!isRadians) {
            // Validate degrees
            if (lat < -90 || lat > 90) {
                throw new Error('Latitude must be between -90 and 90 degrees');
            }
            if (lon < -180 || lon > 180) {
                throw new Error('Longitude must be between -180 and 180 degrees');
            }
        } else {
            // Validate radians
            if (lat < -Math.PI/2 || lat > Math.PI/2) {
                throw new Error('Latitude must be between -π/2 and π/2 radians');
            }
            if (lon < -Math.PI || lon > Math.PI) {
                throw new Error('Longitude must be between -π and π radians');
            }
        }
    }

    // Factory methods for degrees (primary API)
    static at(lat: number, lon: number, alt?: number): Coordinate {
        return new Coordinate(lat, lon, alt, false);
    }

    // Factory methods for radians
    static fromRadians(lat: number, lon: number, alt?: number): Coordinate {
        return new Coordinate(lat, lon, alt, true);
    }

    // Getters in degrees (primary API)
    get latitude(): number {
        return this.isRadians ? this.toDegrees(this.lat) : this.lat;
    }

    get longitude(): number {
        return this.isRadians ? this.toDegrees(this.lon) : this.lon;
    }

    get altitude(): number | undefined {
        return this.alt;
    }

    // Getters in radians
    get latitudeRadians(): number {
        return this.isRadians ? this.lat : this.toRadians(this.lat);
    }

    get longitudeRadians(): number {
        return this.isRadians ? this.lon : this.toRadians(this.lon);
    }

    // GeoJSON format (lon/lat order)
    toGeoJSON(): [number, number] {
        return [this.longitude, this.latitude];
    }

    static fromGeoJSON(coords: [number, number]): Coordinate {
        return Coordinate.at(coords[1], coords[0]);
    }

    // Internal conversion utilities
    private toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    private toDegrees(radians: number): number {
        return radians * (180 / Math.PI);
    }

    // Utility methods
    equals(other: Coordinate): boolean {
        // Compare in the same unit system
        if (this.isRadians === other.isRadians) {
            return this.lat === other.lat && 
                   this.lon === other.lon && 
                   this.alt === other.alt;
        }
        // Convert and compare if different unit systems
        return this.latitude === other.latitude && 
               this.longitude === other.longitude && 
               this.alt === other.alt;
    }

    toString(): string {
        if (this.isRadians) {
            return `(${this.lat.toFixed(6)}rad, ${this.lon.toFixed(6)}rad${
                this.alt ? `, ${this.alt}m` : ''})`;
        }
        return `(${this.lat}°, ${this.lon}°${this.alt ? `, ${this.alt}m` : ''})`;
    }
}

