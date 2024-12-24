// Bearing test file 
import { describe, it, expect } from 'vitest';
import { Azimuth } from '../../../src/core/models/Azimuth';
import { TEST_CATEGORIES } from '../../__helpers__/constants';
import { assertAngleNearlyEqual } from '../../__helpers__/assertions';
import {
    LONDON,
    PARIS,
    NEW_YORK,
    TOKYO,
    NORTH_POLE,
    SOUTH_POLE,
    EQUATOR_PRIME,
    QUAD_1,
    QUAD_2,
    QUAD_3,
    QUAD_4
} from '../../__fixtures__/coordinates';
import {
    NORTH,
    EAST,
    SOUTH,
    WEST
} from '../../__fixtures__/angles';
import { Coordinate } from '../../../src/core/models/Coordinate';

describe('Azimuth', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should create azimuth between two points', () => {
            const azimuth = Azimuth.from(LONDON).to(PARIS);
            expect(azimuth).toBeDefined();
        });
    });

    describe('Forward Azimuth', () => {
        it('should calculate forward azimuth between major cities', () => {
            const testCases = [
                {
                    start: LONDON,
                    end: PARIS,
                    expectedDegrees: 117  // Approximate
                },
                {
                    start: NEW_YORK,
                    end: TOKYO,
                    expectedDegrees: 333  // Approximate
                }
            ];

            testCases.forEach(({ start, end, expectedDegrees }) => {
                const azimuth = Azimuth.from(start).to(end);
                assertAngleNearlyEqual(
                    azimuth.forward(),
                    new Angle(expectedDegrees),
                    1
                );
            });
        });

        it('should calculate cardinal directions from equator', () => {
            // Test points 1 degree in each cardinal direction from equator
            const north = new Coordinate(1, 0);
            const east = new Coordinate(0, 1);
            const south = new Coordinate(-1, 0);
            const west = new Coordinate(0, -1);

            assertAngleNearlyEqual(
                Azimuth.from(EQUATOR_PRIME).to(north).forward(),
                NORTH
            );
            assertAngleNearlyEqual(
                Azimuth.from(EQUATOR_PRIME).to(east).forward(),
                EAST
            );
            assertAngleNearlyEqual(
                Azimuth.from(EQUATOR_PRIME).to(south).forward(),
                SOUTH
            );
            assertAngleNearlyEqual(
                Azimuth.from(EQUATOR_PRIME).to(west).forward(),
                WEST
            );
        });
    });

    describe('Reverse Azimuth', () => {
        it('should calculate reverse azimuth as forward + 180°', () => {
            const testPoints = [
                [LONDON, PARIS],
                [NEW_YORK, TOKYO],
                [QUAD_1, QUAD_3],
                [QUAD_2, QUAD_4]
            ];

            testPoints.forEach(([start, end]) => {
                const azimuth = Azimuth.from(start).to(end);
                const forward = azimuth.forward().degrees;
                const reverse = azimuth.reverse().degrees;
                const diff = Math.abs((reverse - forward + 180) % 360);
                expect(diff).toBeLessThan(0.1);
            });
        });
    });

    describe(TEST_CATEGORIES.EDGE_CASES, () => {
        it('should handle poles', () => {
            // All directions from North Pole are south
            const fromNorthPole = Azimuth.from(NORTH_POLE).to(LONDON);
            assertAngleNearlyEqual(fromNorthPole.forward(), SOUTH);

            // All directions from South Pole are north
            const fromSouthPole = Azimuth.from(SOUTH_POLE).to(LONDON);
            assertAngleNearlyEqual(fromSouthPole.forward(), NORTH);
        });

        it('should handle antipodal points', () => {
            const point1 = new Coordinate(0, 0);
            const point2 = new Coordinate(0, 180);
            const azimuth = Azimuth.from(point1).to(point2);
            assertAngleNearlyEqual(azimuth.forward(), EAST);
        });

        it('should handle same point', () => {
            const azimuth = Azimuth.from(LONDON).to(LONDON);
            expect(azimuth.forward().degrees).toBeDefined();
        });
    });

    describe('String Representation', () => {
        it('should format azimuth correctly', () => {
            const azimuth = Azimuth.from(LONDON).to(PARIS);
            expect(azimuth.toString()).toBe(
                `Azimuth(${LONDON} → ${PARIS})`
            );
        });
    });
});