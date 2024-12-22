// test/Arc.test.ts
import test from 'node:test';
import { Arc } from '../src/models/Arc.js';
import { SphericalTrigonometry } from '../src/models/SphericalTrigonometry.js';
import { Coordinate } from '../src/models/Coordinate.js';
import { Angle } from '../src/models/Angle.js';
import { Distance } from '../src/models/Distance.js';
import { Sphere } from '../src/models/Sphere.js';
import { assertDistanceNearlyEqual } from './helpers/assertions.js';

test('Arc Calculations', async (t) => {
    await t.test('should create simple arc with default radius', () => {
        const arc = Arc.onSphere();  // defaults to Earth
        const circumference = arc.length();
        
        // 2πr where r is Earth's radius (6371km)
        const expectedCircumference = 2 * Math.PI * 6371;
        assertDistanceNearlyEqual(
            circumference.inKilometers(),
            expectedCircumference,
            1,
            'Default arc should have Earth\'s circumference'
        );
    });

    await t.test('should calculate great circle arc between two points', () => {
        // London to Paris
        const london = new Coordinate(51.5074, -0.1278);
        const paris = new Coordinate(48.8566, 2.3522);
        
        const arc = Arc.fromPoints(london, paris);  // defaults to Earth sphere
        const length = arc.length();

        // Debug output
        console.log('London-Paris arc length test:');
        console.log(`Calculated length: ${length.inKilometers()} km`);
        console.log(`Expected length: 344 km`);
        
        assertDistanceNearlyEqual(
            length.inKilometers(),
            344,
            1,
            'London-Paris arc length should be about 344 km'
        );
    });

    await t.test('should calculate simple known arc length', () => {
        // Test with two points on the equator, 90 degrees apart
        const point1 = new Coordinate(0, 0);  // 0°N, 0°E
        const point2 = new Coordinate(0, 90); // 0°N, 90°E
        
        const arc = Arc.fromPoints(point1, point2);
        const length = arc.length();

        // For 90 degrees on Earth's great circle, should be 1/4 of circumference
        const expectedLength = (2 * Math.PI * 6371) / 4; // ~10,007 km
        
        assertDistanceNearlyEqual(
            length.inKilometers(),
            expectedLength,
            1,
            'Quarter Earth circumference calculation'
        );
    });
});

// Separate test file for SphericalTrigonometry
test('Spherical Trigonometry', async (t) => {
    await t.test('should calculate using Law of Cosines', () => {
        // Isosceles triangle with:
        // - Two equal sides of 100km
        // - Included angle of 60°
        // - Expected third side should be approximately 100km
        const arcA = Distance.fromKilometers(100);
        const arcB = Distance.fromKilometers(100);
        const angleC = new Angle(60);

        const result = SphericalTrigonometry.lawOfCosines(arcA, arcB, angleC);

        assertDistanceNearlyEqual(
            result.inKilometers(),
            100,
            0.1,
            'Law of Cosines for isosceles triangle with 60° angle'
        );
    });

    await t.test('should calculate using Law of Sines', () => {
        // Right triangle with:
        // - 30° and 60° angles (therefore 90° for third angle)
        // - Hypotenuse of 100km
        // - Expected shortest side should be 50km
        const angleA = new Angle(30);
        const angleB = new Angle(60);
        const arcC = Distance.fromKilometers(100);

        const result = SphericalTrigonometry.lawOfSines(angleA, angleB, arcC);

        assertDistanceNearlyEqual(
            result.inKilometers(),
            50,
            0.1,
            'Law of Sines for 30-60-90 triangle with hypotenuse 100km'
        );
    });
});