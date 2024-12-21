// Utility functions for conversions. 
// Converters.ts
export class Converters {
  // Converts degrees to radians
  static degreesToRadians(degrees: number): number {
      return degrees * Math.PI / 180;
  }

  // Converts radians to degrees
  static radiansToDegrees(radians: number): number {
      return radians * 180 / Math.PI;
  }

  // Optionally, include other relevant conversions
}
