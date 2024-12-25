import { describe, it, expect } from 'vitest';
import { GreatCircle } from '../../../src/core/models/GreatCircle.js';
import { Distance } from '../../../src/core/models/Distance.js';
import { TEST_CATEGORIES } from '../../__helpers__/constants.js';
import { assertDistanceNearlyEqual, assertCoordinateNearlyEqual } from '../../__helpers__/assertions.js';
import { LONDON, PARIS, TOKYO } from '../../__fixtures__/coordinates.js';
import { Coordinate } from '../../../src/core/models/Coordinate.js';
describe('GreatCircle', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should create great circle using factory method', () => {
            const circle = GreatCircle.from(LONDON).to(PARIS);
            expect(circle).toBeDefined();
            expect(circle.toString()).toBe(`GreatCircle(${LONDON} → ${PARIS})`);
        });
        it('should allow custom sphere radius', () => {
            const customRadius = Distance.fromKilometers(2000);
            const circle = GreatCircle.from(LONDON)
                .to(PARIS)
                .withSphere(customRadius);
            expect(circle).toBeDefined();
        });
    });
    describe('Distance Calculations', () => {
        it('should calculate correct distance between points', () => {
            const circle = GreatCircle.from(LONDON).to(PARIS);
            const distance = circle.distance();
            assertDistanceNearlyEqual(distance, Distance.fromKilometers(344), // ~344km from London to Paris
            1000 // 1km tolerance
            );
        });
        it('should handle zero distance', () => {
            const circle = GreatCircle.from(LONDON).to(LONDON);
            const distance = circle.distance();
            expect(distance.inMeters()).toBe(0);
        });
        it('should handle antipodal points', () => {
            const antipode = new Coordinate(-LONDON.latitude, LONDON.longitude + 180);
            const circle = GreatCircle.from(LONDON).to(antipode);
            const distance = circle.distance();
            expect(distance.inKilometers()).toBeCloseTo(20000, -1); // ~20,000km
        });
    });
    describe('Point Generation', () => {
        it('should generate points with specified spacing', () => {
            const circle = GreatCircle.from(LONDON).to(TOKYO);
            const spacing = Distance.fromKilometers(500);
            const points = circle.generatePoints({ spacing });
            // Verify point spacing
            for (let i = 1; i < points.length; i++) {
                const segmentDistance = GreatCircle.from(points[i - 1])
                    .to(points[i])
                    .distance();
                expect(segmentDistance.inKilometers())
                    .toBeLessThanOrEqual(spacing.inKilometers() * 1.1);
            }
        });
        it('should respect minimum points parameter', () => {
            const circle = GreatCircle.from(LONDON).to(PARIS);
            const minPoints = 10;
            const points = circle.generatePoints({ minPoints });
            expect(points.length).toBeGreaterThanOrEqual(minPoints);
        });
        it('should respect maximum points parameter', () => {
            const circle = GreatCircle.from(LONDON).to(TOKYO);
            const maxPoints = 50;
            const points = circle.generatePoints({ maxPoints });
            expect(points.length).toBeLessThanOrEqual(maxPoints);
        });
    });
    describe('Interpolation', () => {
        it('should interpolate midpoint', () => {
            const circle = GreatCircle.from(LONDON).to(PARIS);
            const midpoint = circle.interpolate(0.5);
            expect(midpoint).toBeDefined();
            if (!midpoint) {
                throw new Error('Failed to interpolate midpoint');
            }
            // Check midpoint is equidistant from endpoints
            const distToStart = GreatCircle.from(LONDON)
                .to(midpoint)
                .distance();
            const distToEnd = GreatCircle.from(midpoint)
                .to(PARIS)
                .distance();
            assertDistanceNearlyEqual(distToStart, distToEnd, 1);
        });
        it('should handle fraction limits', () => {
            const circle = GreatCircle.from(LONDON).to(PARIS);
            const start = circle.interpolate(0);
            expect(start).toBeDefined();
            if (start) {
                assertCoordinateNearlyEqual(start, LONDON);
            }
            const end = circle.interpolate(1);
            expect(end).toBeDefined();
            if (end) {
                assertCoordinateNearlyEqual(end, PARIS);
            }
        });
        it('should throw error for invalid fractions', () => {
            const circle = GreatCircle.from(LONDON).to(PARIS);
            expect(() => circle.interpolate(-0.1)).toThrow();
            expect(() => circle.interpolate(1.1)).toThrow();
        });
    });
    describe('Circle Extension', () => {
        it('should extend great circle by distance', () => {
            const original = GreatCircle.from(LONDON).to(PARIS);
            const extension = Distance.fromKilometers(100);
            const extended = original.extend(extension);
            const totalDistance = extended.distance();
            // Calculate expected distance
            const expectedDistance = new Distance(original.distance().inMeters() + extension.inMeters());
            assertDistanceNearlyEqual(totalDistance, expectedDistance, 1);
        });
        it('should maintain bearing when extending', () => {
            const original = GreatCircle.from(LONDON).to(PARIS);
            const extension = Distance.fromKilometers(100);
            const extended = original.extend(extension);
            const endPoint = extended.interpolate(1);
            expect(endPoint).toBeDefined();
            if (!endPoint) {
                throw new Error('Failed to get end point');
            }
            // New end point should be further from start but in same direction
            const newDistance = GreatCircle.from(LONDON)
                .to(endPoint)
                .distance();
            expect(newDistance.inMeters())
                .toBeGreaterThan(original.distance().inMeters());
        });
    });
    describe('Edge Cases', () => {
        it('should handle date line crossing', () => {
            const point1 = new Coordinate(0, 179);
            const point2 = new Coordinate(0, -179);
            const circle = GreatCircle.from(point1).to(point2);
            // Distance should be small despite longitude difference
            expect(circle.distance().inKilometers()).toBeLessThan(300);
            // Interpolated points should form a continuous path
            const points = circle.generatePoints({ minPoints: 10 });
            for (let i = 1; i < points.length; i++) {
                const segmentDistance = GreatCircle.from(points[i - 1])
                    .to(points[i])
                    .distance();
                expect(segmentDistance.inKilometers()).toBeLessThan(100);
            }
        });
        it('should handle points at poles', () => {
            const northPole = new Coordinate(90, 0);
            const circle = GreatCircle.from(LONDON).to(northPole);
            const midpoint = circle.interpolate(0.5);
            expect(midpoint).toBeDefined();
            if (midpoint) {
                // Midpoint should be between start and pole latitudes
                expect(midpoint.latitude).toBeGreaterThan(LONDON.latitude);
                expect(midpoint.latitude).toBeLessThan(90);
            }
        });
        it('should handle points on same meridian', () => {
            const point1 = new Coordinate(0, 0);
            const point2 = new Coordinate(45, 0);
            const circle = GreatCircle.from(point1).to(point2);
            const midpoint = circle.interpolate(0.5);
            expect(midpoint).toBeDefined();
            if (midpoint) {
                expect(midpoint.longitude).toBe(0);
                expect(midpoint.latitude).toBe(22.5);
            }
        });
    });
});
