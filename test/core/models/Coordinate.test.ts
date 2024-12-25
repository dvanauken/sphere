// Coordinate test file 
import { describe, it, expect } from 'vitest';
import { Coordinate } from '../../../src/core/models/Coordinate.js';
import { ERROR_MESSAGES, TEST_CATEGORIES } from '../../__helpers__/constants.js';
import { assertCoordinateNearlyEqual } from '../../__helpers__/assertions.js';
import { 
    LONDON,
    TOKYO,
    NORTH_POLE,
    SOUTH_POLE,
    MOUNT_EVEREST
} from '../../__fixtures__/coordinates.js';

describe('Coordinate', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should create a valid coordinate', () => {
            const coord = new Coordinate(51.5074, -0.1278);
            expect(coord.latitude).toBe(51.5074);
            expect(coord.longitude).toBe(-0.1278);
            expect(coord.altitude).toBeUndefined();
        });

        it('should create a coordinate with altitude', () => {
            const coord = new Coordinate(27.9881, 86.9250, 8848);
            expect(coord.latitude).toBe(27.9881);
            expect(coord.longitude).toBe(86.9250);
            expect(coord.altitude).toBe(8848);
        });

        it('should create coordinate using static factory method', () => {
            const coord = Coordinate.at(51.5074, -0.1278);
            expect(coord.latitude).toBe(51.5074);
            expect(coord.longitude).toBe(-0.1278);
        });
    });

    describe(TEST_CATEGORIES.VALIDATION, () => {
        it('should throw error for latitude below -90', () => {
            expect(() => new Coordinate(-91, 0))
                .toThrow(ERROR_MESSAGES.INVALID_LATITUDE);
        });

        it('should throw error for latitude above 90', () => {
            expect(() => new Coordinate(91, 0))
                .toThrow(ERROR_MESSAGES.INVALID_LATITUDE);
        });

        it('should throw error for longitude below -180', () => {
            expect(() => new Coordinate(0, -181))
                .toThrow(ERROR_MESSAGES.INVALID_LONGITUDE);
        });

        it('should throw error for longitude above 180', () => {
            expect(() => new Coordinate(0, 181))
                .toThrow(ERROR_MESSAGES.INVALID_LONGITUDE);
        });
    });

    describe(TEST_CATEGORIES.EDGE_CASES, () => {
        it('should handle North Pole', () => {
            const coord = new Coordinate(90, 0);
            expect(coord.latitude).toBe(90);
            expect(coord.longitude).toBe(0);
        });

        it('should handle South Pole', () => {
            const coord = new Coordinate(-90, 0);
            expect(coord.latitude).toBe(-90);
            expect(coord.longitude).toBe(0);
        });

        it('should handle International Date Line', () => {
            const coord1 = new Coordinate(0, 180);
            const coord2 = new Coordinate(0, -180);
            expect(coord1.longitude).toBe(180);
            expect(coord2.longitude).toBe(-180);
        });
    });

    describe('Equality', () => {
        it('should correctly compare equal coordinates', () => {
            const coord1 = new Coordinate(51.5074, -0.1278);
            const coord2 = new Coordinate(51.5074, -0.1278);
            expect(coord1.equals(coord2)).toBe(true);
        });

        it('should correctly compare unequal coordinates', () => {
            const coord1 = new Coordinate(51.5074, -0.1278);
            const coord2 = new Coordinate(51.5074, -0.1279);
            expect(coord1.equals(coord2)).toBe(false);
        });

        it('should handle altitude in equality comparison', () => {
            const coord1 = new Coordinate(27.9881, 86.9250, 8848);
            const coord2 = new Coordinate(27.9881, 86.9250);
            expect(coord1.equals(coord2)).toBe(false);
        });
    });

    describe('String Representation', () => {
        it('should format coordinate without altitude', () => {
            const coord = LONDON;
            expect(coord.toString()).toBe('(51.5074°, -0.1278°)');
        });

        it('should format coordinate with altitude', () => {
            const coord = MOUNT_EVEREST;
            expect(coord.toString()).toBe('(27.9881°, 86.925°, 8848m)');
        });
    });

    describe(TEST_CATEGORIES.REAL_WORLD, () => {
        it('should correctly represent London coordinates', () => {
            assertCoordinateNearlyEqual(
                LONDON,
                new Coordinate(51.5074, -0.1278)
            );
        });

        it('should correctly represent Tokyo coordinates', () => {
            assertCoordinateNearlyEqual(
                TOKYO,
                new Coordinate(35.6762, 139.6503)
            );
        });
    });
});