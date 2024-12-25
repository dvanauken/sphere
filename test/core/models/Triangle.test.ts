// Triangle test file 
import { describe, it, expect } from 'vitest';
import { Triangle } from '../../../src/core/models/Triangle.js';
import { Angle } from '../../../src/core/models/Angle.js';
import { Distance } from '../../../src/core/models/Distance.js';
import { TEST_CATEGORIES } from '../../__helpers__/constants.js';
import {
    assertDistanceNearlyEqual,
    assertAngleNearlyEqual,
    assertAreaNearlyEqual
} from '../../__helpers__/assertions.js';
import {
    LONDON,
    PARIS,
    NEW_YORK,
    TRIANGLE_VERTEX_1,
    TRIANGLE_VERTEX_2,
    TRIANGLE_VERTEX_3
} from '../../__fixtures__/coordinates.js';
import {
    EARTH_RADIUS
} from '../../__fixtures__/distances.js';
import {
    EQUILATERAL,
    RIGHT_ANGLE
} from '../../__fixtures__/angles.js';
import { Coordinate } from '../../../src/core/models/Coordinate.js';

describe('Triangle', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should create triangle using factory method', () => {
            const triangle = Triangle.from(TRIANGLE_VERTEX_1)
                .to(TRIANGLE_VERTEX_2)
                .and(TRIANGLE_VERTEX_3);
            expect(triangle).toBeDefined();
        });

        it('should throw error for invalid vertex count', () => {
            expect(() => {
                new Triangle([TRIANGLE_VERTEX_1, TRIANGLE_VERTEX_2] as any);
            }).toThrow();
        });
    });

    describe('Area Calculations', () => {
        it('should calculate area of right triangle', () => {
            // Create a right triangle at equator
            const v1 = new Coordinate(0, 0);
            const v2 = new Coordinate(0, 1);
            const v3 = new Coordinate(1, 0);
            const triangle = Triangle.from(v1).to(v2).and(v3);
            
            // Area should be non-zero and reasonable
            const area = triangle.area();
            expect(area).toBeGreaterThan(0);
            expect(area).toBeLessThan(12000); // rough maximum possible area
        });

        it('should calculate area of equilateral triangle', () => {
            // Create an equilateral triangle
            const center = new Coordinate(0, 0);
            const radius = Distance.fromKilometers(1000);
            const angles = [0, 120, 240].map(deg => new Angle(deg));
            
            const vertices = angles.map(angle => {
                const lat = Math.asin(Math.sin(radius.inMeters() / EARTH_RADIUS.inMeters()) * 
                                    Math.cos(angle.toRadians()));
                const lon = Math.atan2(
                    Math.sin(angle.toRadians()) * 
                    Math.sin(radius.inMeters() / EARTH_RADIUS.inMeters()) * 
                    Math.cos(center.latitude * Math.PI / 180),
                    Math.cos(radius.inMeters() / EARTH_RADIUS.inMeters()) - 
                    Math.sin(center.latitude * Math.PI / 180) * 
                    Math.sin(lat)
                );
                return new Coordinate(lat * 180 / Math.PI, lon * 180 / Math.PI);
            });

            const triangle = Triangle.from(vertices[0])
                .to(vertices[1])
                .and(vertices[2]);

            const area = triangle.area();
            expect(area).toBeGreaterThan(0);
            
            // All angles should be 60 degrees
            const triangleAngles = triangle.angles();
            angles.forEach(angle => {
                assertAngleNearlyEqual(triangleAngles[0], EQUILATERAL);
            });
        });
    });

    describe('Perimeter Calculations', () => {
        it('should calculate perimeter', () => {
            const triangle = Triangle.from(LONDON)
                .to(PARIS)
                .and(NEW_YORK);
            
            const perimeter = triangle.perimeter();
            const sides = triangle.sides();
            
            // Perimeter should equal sum of sides
            const sumOfSides = new Distance(
                sides.reduce((sum, side) => sum + side.inMeters(), 0)
            );
            assertDistanceNearlyEqual(perimeter, sumOfSides);
        });
    });

    describe('Angle Calculations', () => {
        it('should calculate angles', () => {
            const triangle = Triangle.from(LONDON)
                .to(PARIS)
                .and(NEW_YORK);
            
            const angles = triangle.angles();
            expect(angles).toHaveLength(3);
            
            // Sum of angles in spherical triangle should be > 180°
            const sumOfAngles = angles.reduce(
                (sum, angle) => sum + angle.degrees,
                0
            );
            expect(sumOfAngles).toBeGreaterThan(180);
            expect(sumOfAngles).toBeLessThan(540); // Maximum possible is 540°
        });

        it('should calculate right angle in right triangle', () => {
            // Create a right triangle at equator
            const v1 = new Coordinate(0, 0);
            const v2 = new Coordinate(0, 1);
            const v3 = new Coordinate(1, 0);
            const triangle = Triangle.from(v1).to(v2).and(v3);
            
            const angles = triangle.angles();
            // One angle should be approximately 90°
            const hasRightAngle = angles.some(
                angle => Math.abs(angle.degrees - 90) < 1
            );
            expect(hasRightAngle).toBe(true);
        });
    });

    describe('Side Calculations', () => {
        it('should calculate sides', () => {
            const triangle = Triangle.from(LONDON)
                .to(PARIS)
                .and(NEW_YORK);
            
            const sides = triangle.sides();
            expect(sides).toHaveLength(3);
            
            // All sides should be positive
            sides.forEach(side => {
                expect(side.inMeters()).toBeGreaterThan(0);
            });
            
            // Triangle inequality: sum of any two sides > third side
            for (let i = 0; i < 3; i++) {
                const sum = sides[(i + 1) % 3].inMeters() + 
                          sides[(i + 2) % 3].inMeters();
                expect(sum).toBeGreaterThan(sides[i].inMeters());
            }
        });
    });

    describe(TEST_CATEGORIES.EDGE_CASES, () => {
        it('should handle degenerate triangles', () => {
            // Three points on equator 120° apart
            const vertices = [0, 120, 240].map(lon => 
                new Coordinate(0, lon)
            );
            
            const triangle = Triangle.from(vertices[0])
                .to(vertices[1])
                .and(vertices[2]);
            
            const area = triangle.area();
            expect(area).toBeGreaterThan(0);
            
            // All angles should be equal
            const angles = triangle.angles();
            const firstAngle = angles[0].degrees;
            angles.forEach(angle => {
                expect(Math.abs(angle.degrees - firstAngle))
                    .toBeLessThan(1);
            });
        });

        it('should handle triangles crossing date line', () => {
            const triangle = Triangle.from(
                new Coordinate(0, 179)
            ).to(
                new Coordinate(0, -179)
            ).and(
                new Coordinate(1, 180)
            );
            
            const area = triangle.area();
            expect(area).toBeGreaterThan(0);
            expect(area).toBeLessThan(1000); // Should be small
        });

        it('should handle triangles including poles', () => {
            const triangle = Triangle.from(
                new Coordinate(90, 0)  // North pole
            ).to(
                new Coordinate(0, 0)   // Equator at prime meridian
            ).and(
                new Coordinate(0, 90)  // Equator at 90°E
            );
            
            const area = triangle.area();
            expect(area).toBeGreaterThan(0);
            
            const angles = triangle.angles();
            // At pole, angle should be 90°
            assertAngleNearlyEqual(angles[0], RIGHT_ANGLE);
        });
    });

    describe('String Representation', () => {
        it('should format triangle correctly', () => {
            const triangle = Triangle.from(TRIANGLE_VERTEX_1)
                .to(TRIANGLE_VERTEX_2)
                .and(TRIANGLE_VERTEX_3);
            expect(triangle.toString()).toBe(
                `Triangle(${TRIANGLE_VERTEX_1} → ${TRIANGLE_VERTEX_2} → ${TRIANGLE_VERTEX_3})`
            );
        });
    });
});