// SphericalTrigonometry test file 
import { describe, it, expect } from 'vitest';
import { SphericalTrigonometry } from '../../../src/core/models/SphericalTrigonometry';
import { Distance } from '../../../src/core/models/Distance';
import { Angle } from '../../../src/core/models/Angle';
import { TEST_CATEGORIES } from '../../__helpers__/constants';
import { 
    assertDistanceNearlyEqual,
    assertAngleNearlyEqual
} from '../../__helpers__/assertions';
import {
    RIGHT_ANGLE,
    EQUILATERAL
} from '../../__fixtures__/angles';

describe('SphericalTrigonometry', () => {
    describe('Law of Cosines', () => {
        it('should calculate third side of right triangle', () => {
            const arcA = Distance.fromKilometers(1000);
            const arcB = Distance.fromKilometers(1000);
            const angleC = RIGHT_ANGLE;

            const arcC = SphericalTrigonometry.lawOfCosines(
                arcA,
                arcB,
                angleC
            );

            // For right triangle, c² ≈ a² + b² for small triangles
            const expectedC = Math.sqrt(
                Math.pow(arcA.inMeters(), 2) + 
                Math.pow(arcB.inMeters(), 2)
            );
            expect(arcC.inMeters()).toBeCloseTo(expectedC, -2); // Less precise for large distances
        });

        it('should calculate side of equilateral triangle', () => {
            const arcA = Distance.fromKilometers(1000);
            const arcB = Distance.fromKilometers(1000);
            const angleC = EQUILATERAL;

            const arcC = SphericalTrigonometry.lawOfCosines(
                arcA,
                arcB,
                angleC
            );

            // For equilateral triangle, all sides should be equal
            assertDistanceNearlyEqual(arcC, arcA);
            assertDistanceNearlyEqual(arcC, arcB);
        });

        it('should handle zero angle', () => {
            const arcA = Distance.fromKilometers(1000);
            const arcB = Distance.fromKilometers(1000);
            const angleC = new Angle(0);

            const arcC = SphericalTrigonometry.lawOfCosines(
                arcA,
                arcB,
                angleC
            );

            // For zero angle, c = |a - b|
            const expected = Math.abs(arcA.inMeters() - arcB.inMeters());
            expect(arcC.inMeters()).toBeCloseTo(expected);
        });
    });

    describe('Law of Sines', () => {
        it('should calculate side using known angle and side', () => {
            const angleA = new Angle(30);
            const angleB = new Angle(60);
            const arcC = Distance.fromKilometers(1000);

            const arcA = SphericalTrigonometry.lawOfSines(
                angleA,
                angleB,
                arcC
            );

            // Check using law of sines ratio
            const sinA = Math.sin(angleA.toRadians());
            const sinB = Math.sin(angleB.toRadians());
            const ratio = arcA.inMeters() / arcC.inMeters();
            expect(ratio).toBeCloseTo(sinA / sinB, 5);
        });

        it('should handle right angle', () => {
            const angleA = new Angle(30);
            const angleB = RIGHT_ANGLE;
            const arcC = Distance.fromKilometers(1000);

            const arcA = SphericalTrigonometry.lawOfSines(
                angleA,
                angleB,
                arcC
            );

            // For right triangle, sin(A) = a/c
            const sinA = Math.sin(angleA.toRadians());
            const ratio = arcA.inMeters() / arcC.inMeters();
            expect(ratio).toBeCloseTo(sinA, 5);
        });
    });

    describe(TEST_CATEGORIES.EDGE_CASES, () => {
        it('should handle very small angles', () => {
            const angleA = new Angle(0.0001);
            const angleB = new Angle(0.0002);
            const arcC = Distance.fromKilometers(1);

            const arcA = SphericalTrigonometry.lawOfSines(
                angleA,
                angleB,
                arcC
            );

            expect(arcA.inMeters()).toBeGreaterThan(0);
        });

        it('should handle very small distances', () => {
            const arcA = new Distance(0.1); // Direct meters constructor
            const arcB = new Distance(0.1); // Direct meters constructor
            const angleC = new Angle(60);

            const arcC = SphericalTrigonometry.lawOfCosines(
                arcA,
                arcB,
                angleC
            );

            expect(arcC.inMeters()).toBeGreaterThan(0);
        });
    });

    describe('Numerical Stability', () => {
        it('should maintain precision for small values', () => {
            const arcA = new Distance(1); // Direct meters constructor
            const arcB = new Distance(1); // Direct meters constructor
            const angleC = new Angle(1);

            const arcC = SphericalTrigonometry.lawOfCosines(
                arcA,
                arcB,
                angleC
            );

            expect(arcC.inMeters()).toBeGreaterThan(0);
            expect(arcC.inMeters()).toBeLessThan(3); // Triangle inequality
        });

        it('should handle nearly equal distances', () => {
            const arcA = Distance.fromKilometers(1000);
            const arcB = Distance.fromKilometers(1000.000001);
            const angleC = new Angle(60);

            const arcC = SphericalTrigonometry.lawOfCosines(
                arcA,
                arcB,
                angleC
            );

            expect(arcC.inMeters()).toBeGreaterThan(0);
        });
    });
});