// src/models/Sphere.ts
export class Sphere {
  private constructor(public readonly radius: number) {
      this.radius = radius;
  }

  // Factory methods for common celestial bodies
  static earth(): Sphere {
      return new Sphere(6371); // Mean radius in kilometers
  }

  static moon(): Sphere {
      return new Sphere(1737.1);
  }

  static mars(): Sphere {
      return new Sphere(3389.5);
  }

  static custom(radius: number): Sphere {
      if (radius <= 0) {
          throw new Error('Radius must be positive');
      }
      return new Sphere(radius);
  }

  // Calculation methods
  surfaceArea(): number {
      return 4 * Math.PI * Math.pow(this.radius, 2);
  }

  volume(): number {
      return (4/3) * Math.PI * Math.pow(this.radius, 3);
  }
}