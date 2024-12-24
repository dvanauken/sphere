// Arc test file 
import { describe, it, expect } from 'vitest';
import { Arc } from '../../../src/core/models/Arc';
import { Angle } from '../../../src/core/models/Angle';
import { Distance } from '../../../src/core/models/Distance';
import { Sphere } from '../../../src/core/models/Sphere';
import { TEST_CATEGORIES } from '../../__helpers__/constants';
import { assertDistanceNearlyEqual, assertCoordinateNearlyEqual } from '../../__helpers__/assertions';
import { 
    LONDON,
    PARIS,
    NEW_YORK,
    TOKYO,
    EQUATOR_PRIME,
    NORTH_POLE
} from '../../__fixtures__/coordinates';
import {
    EARTH_RADIUS,
    LONDON_TO_PARIS,
    TINY_DISTANCE,
    ZERO_DISTANCE
} from '../../__fixtures__/distances';
import { Coordinate } from '../../../src/core/models/Coordinate';

describe('Arc', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should create arc on sphere with default radius', () => {
            const arc = Arc.onSphere();
            const circumference = arc.length();
            assertDistanceNearlyEqual(
                circumference,
                Distance.fromKilometers(2 * Math.PI * 6371),
                1000
            );
        });

        it('should create arc on sphere with custom radius', () => {
            const radius = Distance.fromKilometers(1000);
            const arc = Arc.onSphere(radius);
            const circumference = arc.length();
            assertDistanceNearlyEqual(
                circumference,
                Distance.fromKilometers(2 * Math.PI * 1000),
                1
            );
        });

        it('should create arc from two points', () => {
            const arc = Arc.fromPoints(LONDON, PARIS);
            const length = arc.length();
            assertDistanceNearlyEqual(length, LONDON_TO_PARIS, 1000);
        });

        it('should create arc with central angle', () => {
            const angle = new Angle(90); // Quarter circle
            const arc = Arc.onSphere(EARTH_RADIUS, angle);
            const length = arc.length();
            assertDistanceNearlyEqual(
                length,
                Distance.fromKilometers(Math.PI * 6371 / 2),
                1
            );
        });
    });

    describe('Length Calculations', () => {
        it('should calculate zero length for same point', () => {
            const arc = Arc.fromPoints(LONDON, LONDON);
            assertDistanceNearlyEqual(arc.length(), ZERO_DISTANCE);
        });

        it('should calculate length of quarter earth circumference', () => {
            const arc = Arc.fromPoints(EQUATOR_PRIME, NORTH_POLE);
            assertDistanceNearlyEqual(
                arc.length(),
                Distance.fromKilometers(10000), // ~10,000 km (quarter Earth circumference)
                100
            );
        });

        it('should calculate length of major city pairs', () => {
            const testCases = [
                {
                    start: LONDON,
                    end: PARIS,
                    expectedKm: 344
                },
                {
                    start: NEW_YORK,
                    end: TOKYO,
                    expectedKm: 10838
                }
            ];

            testCases.forEach(({ start, end, expectedKm }) => {
                const arc = Arc.fromPoints(start, end);
                assertDistanceNearlyEqual(
                    arc.length(),
                    Distance.fromKilometers(expectedKm),
                    100
                );
            });
        });
    });

    describe('Interpolation', () => {
        it('should interpolate midpoint', () => {
            const arc = Arc.fromPoints(LONDON, PARIS);
            const midpoint = arc.interpolate(0.5);
            expect(midpoint).toBeDefined();
            if (midpoint) {
                // Verify midpoint is roughly equidistant from both endpoints
                const toStart = Arc.fromPoints(midpoint, LONDON).length();
                const toEnd = Arc.fromPoints(midpoint, PARIS).length();
                assertDistanceNearlyEqual(toStart, toEnd, 1);
            }
        });

        it('should return start point for fraction 0', () => {
            const arc = Arc.fromPoints(LONDON, PARIS);
            const point = arc.interpolate(0);
            expect(point).toBeDefined();
            if (point) {
                assertCoordinateNearlyEqual(point, LONDON);
            }
        });

        it('should return end point for fraction 1', () => {
            const arc = Arc.fromPoints(LONDON, PARIS);
            const point = arc.interpolate(1);
            expect(point).toBeDefined();
            if (point) {
                assertCoordinateNearlyEqual(point, PARIS);
            }
        });

        it('should throw error for invalid fractions', () => {
            const arc = Arc.fromPoints(LONDON, PARIS);
            expect(() => arc.interpolate(-0.1)).toThrow();
            expect(() => arc.interpolate(1.1)).toThrow();
        });
    });

    describe(TEST_CATEGORIES.EDGE_CASES, () => {
        it('should handle antipodal points', () => {
            const arc = Arc.fromPoints(
                new Coordinate(0, 0),
                new Coordinate(0, 180)
            );
            assertDistanceNearlyEqual(
                arc.length(),
                Distance.fromKilometers(20000), // ~20,000 km (half Earth circumference)
                100
            );
        });

        it('should handle tiny arcs', () => {
            const start = LONDON;
            const end = new Coordinate(
                LONDON.latitude + 0.0001,
                LONDON.longitude + 0.0001
            );
            const arc = Arc.fromPoints(start, end);
            expect(arc.length().inMeters()).toBeLessThan(100);
        });
    });
});