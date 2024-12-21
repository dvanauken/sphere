// This file defines the Angle class. 
// Angle.ts
export class Angle {
  degrees: number;

  constructor(degrees: number) {
      this.degrees = degrees;
  }

  // Convert angle to radians
  toRadians(): number {
      return this.degrees * (Math.PI / 180);
  }

  // Normalize the angle to be within the range [0, 360]
  normalize(): number {
      return ((this.degrees % 360) + 360) % 360;
  }

  // Optional: Add another angle
  add(angle: Angle): Angle {
      return new Angle(this.normalize() + angle.normalize());
  }

  // Optional: Subtract another angle
  subtract(angle: Angle): Angle {
      return new Angle(this.normalize() - angle.normalize());
  }

  // Optional: toString method for easy debugging
  toString(): string {
      return `Angle(${this.degrees} degrees)`;
  }
}
