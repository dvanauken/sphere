// Coordinate.ts
export class Coordinate {
  latitude: number;
  longitude: number;
  altitude?: number;  // Optional altitude for 3D positioning

  constructor(latitude: number, longitude: number, altitude?: number) {
      this.latitude = latitude;
      this.longitude = longitude;
      this.altitude = altitude;
  }

  // Convert latitude and longitude from degrees to radians
  toRadians(): { latRadians: number, lonRadians: number } {
      return {
          latRadians: this.latitude * (Math.PI / 180),
          lonRadians: this.longitude * (Math.PI / 180),
      };
  }

  // Optional: toString method for easy debugging
  toString(): string {
      return `Coordinate(${this.latitude}, ${this.longitude}${this.altitude ? ', ' + this.altitude : ''})`;
  }
}
