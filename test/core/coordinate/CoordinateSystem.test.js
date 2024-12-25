// CoordinateSystem test file 
import { assertCoordinateNearlyEqual } from '../../__helpers__/assertions.js';
import { LONDON, PARIS, NORTH_POLE, SOUTH_POLE, EQUATOR_PRIME, EQUATOR_180 } from '../../__fixtures__/coordinates.js';
import { describe, it, expect } from 'vitest';
import { CoordinateSystem, Point, Coordinate } from '../../../src/index.js';
import { TEST_CATEGORIES } from '../../__helpers__/constants.js';
describe('CoordinateSystem', () => {
    describe('Coordinate to Point Conversion', () => {
        it('should convert equator point', () => {
            const point = CoordinateSystem.fromCoordinate(EQUATOR_PRIME);
            expect(point.X).toBeCloseTo(0);
            expect(point.Y).toBeCloseTo(0);
        });
        it('should convert North Pole', () => {
            const point = CoordinateSystem.fromCoordinate(NORTH_POLE);
            expect(point.X).toBeCloseTo(0);
            expect(point.Y).toBeCloseTo(Math.PI / 2);
        });
        it('should convert South Pole', () => {
            const point = CoordinateSystem.fromCoordinate(SOUTH_POLE);
            expect(point.X).toBeCloseTo(0);
            expect(point.Y).toBeCloseTo(-Math.PI / 2);
        });
        it('should convert date line points', () => {
            const point = CoordinateSystem.fromCoordinate(EQUATOR_180);
            expect(point.X).toBeCloseTo(Math.PI);
            expect(point.Y).toBeCloseTo(0);
        });
        it('should convert arbitrary point', () => {
            const point = CoordinateSystem.fromCoordinate(LONDON);
            expect(point.X).toBeCloseTo(-0.1278 * Math.PI / 180);
            expect(point.Y).toBeCloseTo(51.5074 * Math.PI / 180);
        });
    });
    describe('Point to Coordinate Conversion', () => {
        it('should convert origin point', () => {
            const point = Point.at(0, 0);
            const coord = CoordinateSystem.fromPoint(point);
            expect(coord.latitude).toBeCloseTo(0);
            expect(coord.longitude).toBeCloseTo(0);
        });
        it('should convert pole point', () => {
            const point = Point.at(0, Math.PI / 2);
            const coord = CoordinateSystem.fromPoint(point);
            expect(coord.latitude).toBeCloseTo(90);
            expect(coord.longitude).toBeCloseTo(0);
        });
        it('should convert arbitrary point', () => {
            const point = Point.at(-0.1278 * Math.PI / 180, 51.5074 * Math.PI / 180);
            const coord = CoordinateSystem.fromPoint(point);
            assertCoordinateNearlyEqual(coord, LONDON);
        });
    });
    describe('Round Trip Conversions', () => {
        const testPoints = [
            LONDON,
            PARIS,
            NORTH_POLE,
            SOUTH_POLE,
            EQUATOR_PRIME,
            EQUATOR_180
        ];
        testPoints.forEach(original => {
            it(`should preserve ${original.toString()} in round trip`, () => {
                const point = CoordinateSystem.fromCoordinate(original);
                const roundTrip = CoordinateSystem.fromPoint(point);
                assertCoordinateNearlyEqual(roundTrip, original);
            });
        });
    });
    describe(TEST_CATEGORIES.EDGE_CASES, () => {
        it('should handle 180/-180 longitude equivalence', () => {
            const pos180 = new Coordinate(0, 180);
            const neg180 = new Coordinate(0, -180);
            const point1 = CoordinateSystem.fromCoordinate(pos180);
            const point2 = CoordinateSystem.fromCoordinate(neg180);
            expect(point1.X).toBeCloseTo(point2.X);
            expect(point1.Y).toBeCloseTo(point2.Y);
        });
        it('should handle points near poles', () => {
            const nearNorthPole = new Coordinate(89.9999, 0);
            const point = CoordinateSystem.fromCoordinate(nearNorthPole);
            const roundTrip = CoordinateSystem.fromPoint(point);
            assertCoordinateNearlyEqual(roundTrip, nearNorthPole);
        });
        it('should handle points near date line', () => {
            const nearDateLine = new Coordinate(0, 179.9999);
            const point = CoordinateSystem.fromCoordinate(nearDateLine);
            const roundTrip = CoordinateSystem.fromPoint(point);
            assertCoordinateNearlyEqual(roundTrip, nearDateLine);
        });
    });
    describe('Numerical Precision', () => {
        it('should maintain precision for small angles', () => {
            const smallAngle = new Coordinate(0.0001, 0.0001);
            const point = CoordinateSystem.fromCoordinate(smallAngle);
            const roundTrip = CoordinateSystem.fromPoint(point);
            assertCoordinateNearlyEqual(roundTrip, smallAngle, 0.0000001);
        });
        it('should handle angles close to limits', () => {
            const nearLimit = new Coordinate(89.9999999, 179.9999999);
            const point = CoordinateSystem.fromCoordinate(nearLimit);
            const roundTrip = CoordinateSystem.fromPoint(point);
            assertCoordinateNearlyEqual(roundTrip, nearLimit, 0.0000001);
        });
    });
});
