import { describe, it, expect } from 'vitest';
import { Distance } from '../../../src/core/models/Distance.js';
import { TEST_CATEGORIES } from '../../__helpers__/constants.js';
import { assertNumberNearlyEqual } from '../../__helpers__/assertions.js';
import {
    ONE_KILOMETER,
    ONE_MILE,
    ONE_NAUTICAL_MILE,
    LONDON_TO_PARIS
} from '../../__fixtures__/distances.js';

describe('Distance', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should create distance from meters', () => {
            const distance = new Distance(1000);
            expect(distance.inMeters()).toBe(1000);
        });

        it('should create distance from kilometers', () => {
            const distance = Distance.fromKilometers(1);
            expect(distance.inMeters()).toBe(1000);
        });

        it('should create distance from miles', () => {
            const distance = Distance.fromMiles(1);
            expect(distance.inMeters()).toBeCloseTo(1609.344, 2);
        });

        it('should create distance from nautical miles', () => {
            const distance = Distance.fromNauticalMiles(1);
            expect(distance.inMeters()).toBeCloseTo(1852, 2);
        });

        it('should create distance from feet', () => {
            const distance = Distance.fromFeet(5280);
            assertNumberNearlyEqual(distance, ONE_MILE);
        });
    });

    describe('Conversions', () => {
        it('should convert to kilometers', () => {
            const distance = new Distance(1000);
            expect(distance.inKilometers()).toBe(1);
        });

        it('should convert to miles', () => {
            const distance = new Distance(1609.344);
            expect(distance.inMiles()).toBeCloseTo(1, 5);
        });

        it('should convert to nautical miles', () => {
            const distance = new Distance(1852);
            expect(distance.inNauticalMiles()).toBeCloseTo(1, 5);
        });

        it('should convert to feet', () => {
            const distance = ONE_MILE;
            expect(distance.inFeet()).toBeCloseTo(5280, 1);
        });

        it('should convert to yards', () => {
            const distance = ONE_MILE;
            expect(distance.inYards()).toBeCloseTo(1760, 1);
        });
    });

    describe('Formatting', () => {
        it('should format with default units', () => {
            const distance = ONE_KILOMETER;
            expect(distance.toString()).toBe('1.00 km');
        });

        it('should format with specified units', () => {
            const distance = ONE_KILOMETER;
            expect(distance.toFormat('km')).toBe('1.00 km');
            expect(distance.toFormat('mi')).toMatch(/0.62 mi/);
            expect(distance.toFormat('nm')).toMatch(/0.54 nm/);
            expect(distance.toFormat('m')).toBe('1000.00 m');
        });
    });

    describe(TEST_CATEGORIES.REAL_WORLD, () => {
        it('should calculate London to Paris distance', () => {
            assertNumberNearlyEqual(
                LONDON_TO_PARIS,
                Distance.fromKilometers(344),
                1000  // 1km tolerance for real-world distance
            );
        });
    });

    describe(TEST_CATEGORIES.EDGE_CASES, () => {
        it('should handle zero distance', () => {
            const distance = new Distance(0);
            expect(distance.inMeters()).toBe(0);
            expect(distance.inKilometers()).toBe(0);
            expect(distance.inMiles()).toBe(0);
        });

        it('should handle very small distances', () => {
            const distance = new Distance(0.0001);
            expect(distance.inMeters()).toBeCloseTo(0.0001, 10);
        });

        it('should handle very large distances', () => {
            const largeDistance = Distance.fromKilometers(1e6);
            expect(largeDistance.inKilometers()).toBe(1e6);
        });
    });
});