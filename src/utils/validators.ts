// Utility functions for validations. 
// Validators.ts
export class Validators {
  // Validate that latitude values are between -90 and 90
  static validateLatitude(latitude: number): boolean {
      return latitude >= -90 && latitude <= 90;
  }

  // Validate that longitude values are between -180 and 180
  static validateLongitude(longitude: number): boolean {
      return longitude >= -180 && longitude <= 180;
  }

  // Optionally, include methods to validate other types of geometric data
}
