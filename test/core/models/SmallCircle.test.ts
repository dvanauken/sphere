import { describe, it, expect } from 'vitest';
import { SmallCircle } from '../../../src/core/models/SmallCircle.js';
import { Distance } from '../../../src/core/models/Distance.js';
import { Sphere } from '../../../src/core/models/Sphere.js';
import { TEST_CATEGORIES } from '../../__helpers__/constants.js';
import { 
    assertDistanceNearlyEqual,
    assertCoordinateNearlyEqual,
    assertAreaNearlyEqual
} from '../../__helpers__/assertions.js';
import {
    LONDON,
    PARIS,
    EQUATOR_PRIME,
    NORTH_POLE,
    CIRCLE_CENTER,
    CIRCLE_POINT
} from '../../__fixtures__/coordinates.js';
import {
    EARTH_RADIUS,
    ONE_KILOMETER,
    TINY_DISTANCE
} from '../../__fixtures__/distances.js';
import { GreatCircle } from '../../../src/core/models/GreatCircle.js';
import { Coordinate } from '../../../src/core/models/Coordinate.js';

describe('SmallCircle', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should create small circle using factory method', () => {
            const circle = SmallCircle.withCenter(CIRCLE_CENTER)
                .radius(ONE_KILOMETER);
            expect(circle).toBeDefined();
        });

        it('should allow custom sphere radius', () => {
            const customSphere = new Sphere();
            const circle = SmallCircle.withCenter(CIRCLE_CENTER)
                .radius(ONE_KILOMETER)
                .withSphere(customSphere);
            expect(circle).toBeDefined();
        });
    });

    describe('Radius Handling', () => {
        it('should retrieve radius using getRadius', () => {
            const radius = ONE_KILOMETER;
            const circle = SmallCircle.withCenter(CIRCLE_CENTER).radius(radius);
            assertDistanceNearlyEqual(circle.getRadius(), radius);
        });

        // it('should throw error for zero radius', () => {
        //     expect(() => {
        //         SmallCircle.withCenter(CIRCLE_CENTER)
        //             .radius(Distance.fromMeters(0));
        //     }).toThrow();
        // });

        // it('should throw error for negative radius', () => {
        //     expect(() => {
        //         SmallCircle.withCenter(CIRCLE_CENTER)
        //             .radius(Distance.fromMeters(-100));
        //     }).toThrow();
        // });
    });

    //describe('Sphere Customization', () => {
        // it('should use custom sphere radius for calculations', () => {
        //     const customRadius = Distance.fromKilometers(2000);
        //     const circleRadius = Distance.fromKilometers(100);
            
        //     // Create circle with custom sphere radius
        //     const circle = SmallCircle.withCenter(EQUATOR_PRIME)
        //         .radius(circleRadius)
        //         .withSphere(new Sphere());  // Pass the radius via getRadius
                
        //     // Test with custom radius
        //     const sphereRadius = Sphere.getRadius(customRadius);
            
        //     // Create standard circle for comparison
        //     const standardCircle = SmallCircle.withCenter(EQUATOR_PRIME)
        //         .radius(circleRadius);
            
        //     // Area and circumference should reflect custom sphere radius
        //     expect(circle.area()).not.toBe(standardCircle.area());
        //     expect(circle.circumference().inMeters())
        //         .not.toBe(standardCircle.circumference().inMeters());
            
        //     // Additional verification
        //     assertDistanceNearlyEqual(
        //         Sphere.getRadius(customRadius), 
        //         customRadius
        //     );
        // });
    //});
    
    describe('Circumference Calculations', () => {
        it('should calculate circumference for various radiuses', () => {
            const testCases = [
                {
                    radius: Distance.fromKilometers(1),
                    expected: Distance.fromKilometers(2 * Math.PI)
                },
                {
                    radius: Distance.fromKilometers(10),
                    expected: Distance.fromKilometers(20 * Math.PI)
                },
                {
                    radius: Distance.fromKilometers(100),
                    expected: Distance.fromKilometers(200 * Math.PI)
                }
            ];

            testCases.forEach(({ radius, expected }) => {
                const circle = SmallCircle.withCenter(EQUATOR_PRIME)
                    .radius(radius);
                assertDistanceNearlyEqual(
                    circle.circumference(),
                    expected,
                    radius.inMeters() * 0.01 // 1% tolerance
                );
            });
        });

        it('should handle tiny circles', () => {
            const circle = SmallCircle.withCenter(LONDON)
                .radius(TINY_DISTANCE);
            expect(circle.circumference().inMeters())
                .toBeLessThan(TINY_DISTANCE.inMeters() * 2 * Math.PI * 1.1);
        });
    });

    describe('Area Calculations', () => {
        it('should calculate area for various radiuses', () => {
            const testCases = [
                {
                    radius: Distance.fromKilometers(1),
                    expected: Math.PI // ~3.14 km²
                },
                {
                    radius: Distance.fromKilometers(10),
                    expected: 100 * Math.PI // ~314 km²
                },
                {
                    radius: Distance.fromKilometers(100),
                    expected: 10000 * Math.PI // ~31,416 km²
                }
            ];

            testCases.forEach(({ radius, expected }) => {
                const circle = SmallCircle.withCenter(EQUATOR_PRIME)
                    .radius(radius);
                assertAreaNearlyEqual(
                    circle.area(),
                    expected,
                    expected * 0.01 // 1% tolerance
                );
            });
        });
    });

    describe('Point Generation', () => {
        it('should generate specified number of points', () => {
            const circle = SmallCircle.withCenter(CIRCLE_CENTER)
                .radius(ONE_KILOMETER);
            const numPoints = 100;
            const points = circle.generatePoints(numPoints);
            
            expect(points.length).toBe(numPoints);
            
            // Verify all points are approximately at the specified radius
            points.forEach(point => {
                const distance = GreatCircle.from(CIRCLE_CENTER)
                    .to(point)
                    .distance();
                assertDistanceNearlyEqual(
                    distance,
                    ONE_KILOMETER,
                    ONE_KILOMETER.inMeters() * 0.01 // 1% tolerance
                );
            });
        });

        it('should generate evenly spaced points', () => {
            const circle = SmallCircle.withCenter(CIRCLE_CENTER)
                .radius(ONE_KILOMETER);
            const points = circle.generatePoints(4);
            
            // Check consecutive points are equally spaced
            const distances: number[] = [];
            for (let i = 0; i < points.length; i++) {
                const nextPoint = points[(i + 1) % points.length];
                distances.push(
                    GreatCircle.from(points[i])
                        .to(nextPoint)
                        .distance()
                        .inMeters()
                );
            }
            
            const avgDistance = distances.reduce((a, b) => a + b) / distances.length;
            distances.forEach(dist => {
                expect(Math.abs(dist - avgDistance) / avgDistance)
                    .toBeLessThan(0.01); // 1% tolerance
            });
        });
    });

    //describe('Latitude Effects', () => {
        // it('should maintain consistent properties at different latitudes', () => {
        //     const radius = ONE_KILOMETER;
        //     const testLatitudes = [-60, -30, 0, 30, 60];
            
        //     const circles = testLatitudes.map(lat => 
        //         SmallCircle.withCenter(new Coordinate(lat, 0)).radius(radius)
        //     );
            
        //     // Area should be the same regardless of latitude
        //     const areas = circles.map(c => c.area());
        //     const avgArea = areas.reduce((a, b) => a + b) / areas.length;
        //     areas.forEach(area => {
        //         expect(Math.abs(area - avgArea) / avgArea).toBeLessThan(0.01);
        //     });
            
        //     // Generate points and check they maintain radius
        //     circles.forEach(circle => {
        //         const points = circle.generatePoints(8);
        //         points.forEach(point => {
        //             const distance = GreatCircle.from(CIRCLE_CENTER)
        //                 .to(point)
        //                 .distance();
        //             assertDistanceNearlyEqual(distance, radius);
        //         });
        //     });
        // });
    //});

    //describe(TEST_CATEGORIES.EDGE_CASES, () => {
        // it('should handle circles at poles', () => {
        //     const circle = SmallCircle.withCenter(NORTH_POLE)
        //         .radius(ONE_KILOMETER);
        //     const points = circle.generatePoints(4);
        //     points.forEach(point => {
        //         expect(point.latitude).toBeLessThan(90);
        //         expect(point.latitude).toBeGreaterThan(89);
        //     });
        // });

        // it('should handle circles crossing date line', () => {
        //     const center = new Coordinate(0, 179.5);
        //     const circle = SmallCircle.withCenter(center)
        //         .radius(Distance.fromKilometers(100));
        //     const points = circle.generatePoints(100);
            
        //     // Verify some points cross the date line
        //     const hasPositive = points.some(p => p.longitude > 0);
        //     const hasNegative = points.some(p => p.longitude < 0);
        //     expect(hasPositive && hasNegative).toBe(true);
        // });

        // it('should handle tiny circles', () => {
        //     const circle = SmallCircle.withCenter(LONDON)
        //         .radius(TINY_DISTANCE);
        //     const points = circle.generatePoints(4);
            
        //     points.forEach(point => {
        //         const distance = GreatCircle.from(LONDON)
        //             .to(point)
        //             .distance();
        //         expect(distance.inMeters())
        //             .toBeLessThan(TINY_DISTANCE.inMeters() * 1.1);
        //     });
        // });
    //});

    describe('String Representation', () => {
        it('should format small circle correctly', () => {
            const circle = SmallCircle.withCenter(CIRCLE_CENTER)
                .radius(ONE_KILOMETER);
            expect(circle.toString()).toBe(
                `SmallCircle(center: ${CIRCLE_CENTER}, radius: ${ONE_KILOMETER})`
            );
        });
    });
});