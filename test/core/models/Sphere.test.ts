// Sphere test file 
import { describe, it, expect } from 'vitest';
import { Sphere } from '../../../src/core/models/Sphere.js';
import { Distance } from '../../../src/core/models/Distance.js';
import { TEST_CATEGORIES } from '../../__helpers__/constants.js';
import { assertDistanceNearlyEqual } from '../../__helpers__/assertions.js';
import { 
    EARTH_RADIUS,
    ONE_KILOMETER,
    TINY_DISTANCE 
} from '../../__fixtures__/distances.js';

describe('Sphere', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should use default Earth radius when no radius provided', () => {
            const radius = Sphere.getRadius();
            assertDistanceNearlyEqual(radius, EARTH_RADIUS);
        });

        it('should use custom radius when provided', () => {
            const customRadius = Distance.fromKilometers(2000);
            const radius = Sphere.getRadius(customRadius);
            assertDistanceNearlyEqual(radius, customRadius);
        });
    });

    describe('Surface Area Calculations', () => {
        it('should calculate surface area with default radius', () => {
            const area = Sphere.surfaceAreaFromRadius(EARTH_RADIUS);
            const expected = 4 * Math.PI * Math.pow(EARTH_RADIUS.inKilometers(), 2);
            expect(area).toBeCloseTo(expected);
        });

        it('should calculate surface area with custom radius', () => {
            const customRadius = Distance.fromKilometers(2000);
            const area = Sphere.surfaceAreaFromRadius(customRadius);
            const expected = 4 * Math.PI * Math.pow(customRadius.inKilometers(), 2);
            expect(area).toBeCloseTo(expected);
        });

        it('should calculate surface area for small radius', () => {
            const smallRadius = Distance.fromKilometers(1);
            const area = Sphere.surfaceAreaFromRadius(smallRadius);
            const expected = 4 * Math.PI; // 4πr² where r=1
            expect(area).toBeCloseTo(expected);
        });
    });

    describe('Volume Calculations', () => {
        it('should calculate volume with default radius', () => {
            const volume = Sphere.volumeFromRadius(EARTH_RADIUS);
            const expected = (4/3) * Math.PI * Math.pow(EARTH_RADIUS.inKilometers(), 3);
            expect(volume).toBeCloseTo(expected);
        });

        it('should calculate volume with custom radius', () => {
            const customRadius = Distance.fromKilometers(2000);
            const volume = Sphere.volumeFromRadius(customRadius);
            const expected = (4/3) * Math.PI * Math.pow(customRadius.inKilometers(), 3);
            expect(volume).toBeCloseTo(expected);
        });

        it('should calculate volume for small radius', () => {
            const smallRadius = Distance.fromKilometers(1);
            const volume = Sphere.volumeFromRadius(smallRadius);
            const expected = (4/3) * Math.PI; // (4/3)πr³ where r=1
            expect(volume).toBeCloseTo(expected);
        });
    });

    describe('Radius Validation', () => {
        it('should handle undefined radius by using Earth radius', () => {
            const radius = Sphere.getRadius(undefined);
            assertDistanceNearlyEqual(radius, EARTH_RADIUS);
        });

        it('should handle zero radius', () => {
            const zeroRadius = Distance.fromKilometers(0);
            const radius = Sphere.getRadius(zeroRadius);
            expect(radius.inMeters()).toBe(0);
        });

        it('should handle very small radius', () => {
            const radius = Sphere.getRadius(TINY_DISTANCE);
            assertDistanceNearlyEqual(radius, TINY_DISTANCE);
        });
    });

    describe(TEST_CATEGORIES.EDGE_CASES, () => {
        it('should handle very large radius', () => {
            const largeRadius = Distance.fromKilometers(1e6); // 1 million km
            const area = Sphere.surfaceAreaFromRadius(largeRadius);
            const volume = Sphere.volumeFromRadius(largeRadius);
            
            expect(area).toBeGreaterThan(0);
            expect(volume).toBeGreaterThan(0);
            expect(Number.isFinite(area)).toBe(true);
            expect(Number.isFinite(volume)).toBe(true);
        });

        it('should handle very small radius calculations', () => {
            const tinyRadius = TINY_DISTANCE;
            const area = Sphere.surfaceAreaFromRadius(tinyRadius);
            const volume = Sphere.volumeFromRadius(tinyRadius);
            
            expect(area).toBeGreaterThan(0);
            expect(volume).toBeGreaterThan(0);
        });

        it('should maintain precision for small values', () => {
            const smallRadius = new Distance(0.1); // Changed from fromMeters
            const area = Sphere.surfaceAreaFromRadius(smallRadius);
            const volume = Sphere.volumeFromRadius(smallRadius);
            
            expect(area).toBeGreaterThan(0);
            expect(volume).toBeGreaterThan(0);
            expect(area).toBeLessThan(1);
            expect(volume).toBeLessThan(1);
        });
    });

    describe('Unit Consistency', () => {
        it('should maintain consistent units in calculations', () => {
            const radiusInKm = Distance.fromKilometers(1000);
            const radiusInM = new Distance(1000000); // Changed from fromMeters
            
            const areaFromKm = Sphere.surfaceAreaFromRadius(radiusInKm);
            const areaFromM = Sphere.surfaceAreaFromRadius(radiusInM);
            
            expect(areaFromKm).toBeCloseTo(areaFromM);
        });
    });

    describe('Mathematical Properties', () => {
        it('should maintain sphere volume to surface area relationship', () => {
            const radius = Distance.fromKilometers(1000);
            const volume = Sphere.volumeFromRadius(radius);
            const area = Sphere.surfaceAreaFromRadius(radius);
            
            // Volume = (r/3) * Surface Area for a sphere
            const volumeFromArea = (radius.inKilometers() / 3) * area;
            expect(volume).toBeCloseTo(volumeFromArea);
        });

        it('should follow scaling laws', () => {
            const radius1 = Distance.fromKilometers(1000);
            const radius2 = Distance.fromKilometers(2000);
            
            const area1 = Sphere.surfaceAreaFromRadius(radius1);
            const area2 = Sphere.surfaceAreaFromRadius(radius2);
            
            // Area should scale with square of radius
            expect(area2 / area1).toBeCloseTo(4); // (2000/1000)^2 = 4
        });
    });
});