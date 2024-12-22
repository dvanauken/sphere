import { Angle } from "./Angle";
import { Distance } from "./Distance";

// For Law of Sines/Cosines calculations, we should use Distance directly
export class SphericalTrigonometry {
  static lawOfCosines(arcA: Distance, arcB: Distance, angleC: Angle): Distance {
      const a = arcA.inMeters();
      const b = arcB.inMeters();
      const C = angleC.toRadians();
      
      const c = Math.sqrt(
          Math.pow(a, 2) + Math.pow(b, 2) - 
          2 * a * b * Math.cos(C)
      );

      return new Distance(c);
  }

  static lawOfSines(angleA: Angle, angleB: Angle, arcC: Distance): Distance {
      const A = angleA.toRadians();
      const B = angleB.toRadians();
      const C = Math.PI - (A + B);
      
      const c = arcC.inMeters();
      const a = Math.abs(c * Math.sin(A) / Math.sin(C));

      return new Distance(a);
  }
}