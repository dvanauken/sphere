import { Arc } from "./Arc.js";
import { Distance } from './Distance.js';



// Angle.ts
export class Angle {
    constructor(public readonly degrees: number) {}

    // Add toRadians method
    toRadians(): number {
        return this.degrees * (Math.PI / 180);
    }

    normalize(): number {
        return ((this.degrees % 360) + 360) % 360;
    }

    // Fix overload signatures
    static defineBy(a: Arc, b: Arc, c: Arc | Angle, aLength?: Distance, bLength?: Distance, cLength?: Distance): Angle {
        if (!aLength || !bLength || !cLength) {
            throw new Error("Length parameters are required");
        }

        if (c instanceof Angle) {
            // Law of Sines case
            const sinA = Math.sin(c.toRadians());
            const calculatedAngleDegrees = Math.asin(
                (aLength.inMeters() * Math.sin(c.toRadians())) / bLength.inMeters()
            ) * (180 / Math.PI);

            return new Angle(calculatedAngleDegrees);
        } else {
            // Law of Cosines case
            const cosC = (
                Math.pow(aLength.inMeters(), 2) + 
                Math.pow(bLength.inMeters(), 2) - 
                Math.pow(cLength.inMeters(), 2)
            ) / (2 * aLength.inMeters() * bLength.inMeters());

            const calculatedAngleDegrees = Math.acos(cosC) * (180 / Math.PI);
            return new Angle(calculatedAngleDegrees);
        }
    }

    toString(): string {
        return `Angle(${this.degrees} degrees)`;
    }
}

