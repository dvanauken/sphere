import { Arc } from "./Arc.js";
import { Distance } from './Distance.js';
import { Sphere } from './Sphere.js';

export class Angle {
    constructor(public readonly degrees: number) { }

    toRadians(): number {
        return this.degrees * (Math.PI / 180);
    }

    normalize(): number {
        return ((this.degrees % 360) + 360) % 360;
    }

    static defineBy(a: Arc, b: Arc, c: Arc | Angle, aLength?: Distance, bLength?: Distance, cLength?: Distance): Angle {
        if (!aLength || !bLength || !cLength) {
            throw new Error("Length parameters are required");
        }

        const radius = Sphere.getRadius().inMeters();

        // Validate spherical triangle constraints
        const sides = [aLength.inMeters(), bLength.inMeters(), cLength.inMeters()];

        // Check each side is positive
        if (sides.some(side => side <= 0)) {
            throw new Error("All sides of a spherical triangle must be positive");
        }

        // Check spherical triangle inequality
        if (sides[0] + sides[1] <= sides[2] ||
            sides[1] + sides[2] <= sides[0] ||
            sides[0] + sides[2] <= sides[1]) {
            throw new Error("Triangle sides must satisfy the triangle inequality");
        }

        // Check sides are less than a semicircle
        const halfCircle = Math.PI * radius;
        if (sides.some(side => side >= halfCircle)) {
            throw new Error("All sides must be less than half the great circle (π radians)");
        }

        if (c instanceof Angle) {
            return Angle.defineByLawOfSines(c, bLength, cLength, radius);
        } else {
            return Angle.defineByLawOfCosines(aLength, bLength, cLength);
        }
    }


    private static defineByLawOfSines(angleC: Angle, bLength: Distance, cLength: Distance, radius: number): Angle {
        if (angleC.degrees <= 0 || angleC.degrees >= 180) {
            throw new Error("Angle must be between 0 and 180 degrees");
        }

        const arcB = bLength.inMeters() / radius;
        const arcC = cLength.inMeters() / radius;

        const argument = (Math.sin(angleC.toRadians()) * Math.sin(arcB)) / Math.sin(arcC);

        if (Math.abs(argument) > 1) {
            throw new Error("Invalid triangle configuration: no solution exists for these measurements");
        }

        const calculatedAngleDegrees = Math.asin(argument) * (180 / Math.PI);
        return new Angle(calculatedAngleDegrees);
    }

    private static defineByLawOfCosines(aLength: Distance, bLength: Distance, cLength: Distance): Angle {
        const cosC = (
            Math.pow(aLength.inMeters(), 2) +
            Math.pow(bLength.inMeters(), 2) -
            Math.pow(cLength.inMeters(), 2)
        ) / (2 * aLength.inMeters() * bLength.inMeters());

        if (Math.abs(cosC) > 1) {
            throw new Error("Invalid triangle configuration: no solution exists for these measurements");
        }

        const calculatedAngleDegrees = Math.acos(cosC) * (180 / Math.PI);
        return new Angle(calculatedAngleDegrees);
    }

    toString(): string {
        return `Angle(${this.degrees} degrees)`;
    }


}