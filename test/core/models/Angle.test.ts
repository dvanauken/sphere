import { describe, it, expect } from 'vitest';
import { Angle } from '../../../src/core/models/Angle';
import { Distance } from '../../../src/core/models/Distance';
import { Arc } from '../../../src/core/models/Arc';
import { TEST_CATEGORIES } from '../../__helpers__/constants';
import { assertAngleNearlyEqual } from '../../__helpers__/assertions';
import {
    RIGHT_ANGLE,
    STRAIGHT_ANGLE,
    FULL_CIRCLE,
    EQUILATERAL,
    ACUTE,
    OBTUSE,
    NEGATIVE,
    OVER_360
} from '../../__fixtures__/angles';

describe('Angle', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should create angle with degrees', () => {
            const angle = new Angle(90);
            expect(angle.degrees).toBe(90);
        });

        it('should allow negative angles', () => {
            const angle = new Angle(-45);
            expect(angle.degrees).toBe(-45);
        });

        it('should allow angles over 360', () => {
            const angle = new Angle(720);
            expect(angle.degrees).toBe(720);
        });
    });

    describe('Conversions', () => {
        it('should convert degrees to radians', () => {
            const angle = RIGHT_ANGLE;
            expect(angle.toRadians()).toBeCloseTo(Math.PI / 2, 10);
        });

        it('should normalize angles to 0-360 range', () => {
            const cases = [
                { input: 0, expected: 0 },
                { input: 360, expected: 0 },
                { input: 720, expected: 0 },
                { input: -90, expected: 270 },
                { input: -360, expected: 0 },
                { input: 45, expected: 45 },
                { input: 405, expected: 45 }
            ];

            cases.forEach(({ input, expected }) => {
                const angle = new Angle(input);
                expect(angle.normalize()).toBe(expected);
            });
        });
    });

    describe('Static Methods', () => {
        it('should define angle using Law of Sines', () => {
            // Setup triangle with known angles and sides
            const arcA = new Distance(5);
            const arcB = new Distance(7);
            const arcC = new Distance(9);
            const angleC = new Angle(60);

            // Calculate using Law of Sines
            const angleA = Angle.defineBy(
                Arc.onSphere(),
                Arc.onSphere(),
                angleC,
                arcA,
                arcB,
                arcC
            );

            // The result should satisfy the Law of Sines
            const sinA = Math.sin(angleA.toRadians());
            const sinC = Math.sin(angleC.toRadians());
            const ratio = (arcA.inMeters() * sinC) / (arcC.inMeters() * sinA);
            expect(ratio).toBeCloseTo(1, 5);
        });

        it('should define angle using Law of Cosines', () => {
            // Setup triangle with known sides
            const arcA = new Distance(5);
            const arcB = new Distance(7);
            const arcC = new Distance(9);

            // Calculate using Law of Cosines
            const angleC = Angle.defineBy(
                Arc.onSphere(),
                Arc.onSphere(),
                Arc.onSphere(),
                arcA,
                arcB,
                arcC
            );

            // Verify using Law of Cosines formula
            const cosC = (
                Math.pow(arcA.inMeters(), 2) +
                Math.pow(arcB.inMeters(), 2) -
                Math.pow(arcC.inMeters(), 2)
            ) / (2 * arcA.inMeters() * arcB.inMeters());
            
            const expectedAngle = new Angle(Math.acos(cosC) * 180 / Math.PI);
            assertAngleNearlyEqual(angleC, expectedAngle);
        });
    });

    describe(TEST_CATEGORIES.EDGE_CASES, () => {
        it('should handle 0 degrees', () => {
            const angle = new Angle(0);
            expect(angle.degrees).toBe(0);
            expect(angle.toRadians()).toBe(0);
        });

        it('should handle 360 degrees', () => {
            const angle = new Angle(360);
            expect(angle.degrees).toBe(360);
            expect(angle.toRadians()).toBeCloseTo(2 * Math.PI, 10);
        });

        it('should handle negative angles', () => {
            const angle = NEGATIVE;  // -45 degrees
            expect(angle.normalize()).toBe(315);
        });

        it('should handle angles over 360', () => {
            const angle = OVER_360;  // 400 degrees
            expect(angle.normalize()).toBe(40);
        });
    });

    describe('String Representation', () => {
        it('should format angle correctly', () => {
            const angle = new Angle(45.5);
            expect(angle.toString()).toBe('Angle(45.5 degrees)');
        });
    });

    describe(TEST_CATEGORIES.REAL_WORLD, () => {
        it('should handle right angle', () => {
            assertAngleNearlyEqual(RIGHT_ANGLE, new Angle(90));
        });

        it('should handle straight angle', () => {
            assertAngleNearlyEqual(STRAIGHT_ANGLE, new Angle(180));
        });

        it('should handle full circle', () => {
            assertAngleNearlyEqual(FULL_CIRCLE, new Angle(360));
        });

        it('should handle equilateral triangle angle', () => {
            assertAngleNearlyEqual(EQUILATERAL, new Angle(60));
        });
    });
});