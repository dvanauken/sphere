// Point test file 
import { describe, it, expect } from 'vitest';
import { Point } from '../../../src/core/models/Point.js';
import { TEST_CATEGORIES } from '../../__helpers__/constants.js';
import { MATH_CONSTANTS } from '../../__helpers__/constants.js';

describe('Point', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should create a 2D point using factory method', () => {
            const point = Point.at(1, 2);
            expect(point.X).toBe(1);
            expect(point.Y).toBe(2);
            expect(point.Z).toBeUndefined();
        });

        it('should create a 3D point using factory method', () => {
            const point = Point.at(1, 2, 3);
            expect(point.X).toBe(1);
            expect(point.Y).toBe(2);
            expect(point.Z).toBe(3);
        });
    });

    describe('Accessors', () => {
        it('should provide read-only access to coordinates', () => {
            const point = Point.at(1, 2, 3);
            expect(point.X).toBe(1);
            expect(point.Y).toBe(2);
            expect(point.Z).toBe(3);
        });
    });

    describe('Equality', () => {
        it('should correctly compare equal 2D points', () => {
            const point1 = Point.at(1, 2);
            const point2 = Point.at(1, 2);
            expect(point1.equals(point2)).toBe(true);
        });

        it('should correctly compare equal 3D points', () => {
            const point1 = Point.at(1, 2, 3);
            const point2 = Point.at(1, 2, 3);
            expect(point1.equals(point2)).toBe(true);
        });

        it('should correctly compare unequal points', () => {
            const point1 = Point.at(1, 2);
            const point2 = Point.at(1, 3);
            expect(point1.equals(point2)).toBe(false);
        });

        it('should handle Z coordinate in equality comparison', () => {
            const point1 = Point.at(1, 2, 3);
            const point2 = Point.at(1, 2);
            expect(point1.equals(point2)).toBe(false);
        });
    });

    describe('String Representation', () => {
        it('should format 2D point correctly', () => {
            const point = Point.at(1, 2);
            expect(point.toString()).toBe('Point(1, 2)');
        });

        it('should format 3D point correctly', () => {
            const point = Point.at(1, 2, 3);
            expect(point.toString()).toBe('Point(1, 2, 3)');
        });
    });

    describe(TEST_CATEGORIES.EDGE_CASES, () => {
        it('should handle zero coordinates', () => {
            const point = Point.at(0, 0, 0);
            expect(point.X).toBe(0);
            expect(point.Y).toBe(0);
            expect(point.Z).toBe(0);
        });

        it('should handle very large coordinates', () => {
            const large = 1e10;
            const point = Point.at(large, large);
            expect(point.X).toBe(large);
            expect(point.Y).toBe(large);
        });

        it('should handle very small coordinates', () => {
            const small = MATH_CONSTANTS.EPSILON;
            const point = Point.at(small, small);
            expect(point.X).toBe(small);
            expect(point.Y).toBe(small);
        });
    });
});