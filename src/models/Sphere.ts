// Sphere.ts
export class Sphere {
  radius: number;

  constructor(radius: number = 6371) {  // Earth's average radius in kilometers
      this.radius = radius;
  }

  // Method to calculate the surface area of the sphere
  surfaceArea(): number {
      return 4 * Math.PI * Math.pow(this.radius, 2);
  }

  // Method to calculate the volume of the sphere
  volume(): number {
      return (4/3) * Math.PI * Math.pow(this.radius, 3);
  }
}
