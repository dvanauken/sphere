// test/GreatCircle.test.ts
import test from 'node:test';
import assert from 'node:assert';
import { GreatCircle } from '../src/models/GreatCircle.js';
import { Coordinate } from '../src/models/Coordinate.js';
import { Sphere } from '../src/models/Sphere.js';

test('GreatCircle Calculations', async (t) => {
    const london = new Coordinate(51.5074, -0.1278);
    const nyc = new Coordinate(40.7128, -74.0060);

    await t.test('should calculate distances using Earth sphere factory', () => {
        const distance = new GreatCircle(london, nyc)
            .withSphere(Sphere.earth())
            .distance();

        // Test each unit conversion separately with descriptive messages
        assert.equal(
            Math.round(distance.inKilometers()), 
            5570,
            'GreatCircle.distance().inKilometers() gave incorrect value'
        );

        assert.equal(
            Math.round(distance.inMiles()), 
            3461,
            'GreatCircle.distance().inMiles() gave incorrect value'
        );

        // assert.equal(
        //     Math.round(distance.inNauticalMiles()), 
        //     3007,
        //     'GreatCircle.distance().inNauticalMiles() gave incorrect value'
        // );

        // assert.equal(
        //     Math.round(distance.inFeet()), 
        //     18274278,
        //     'GreatCircle.distance().inFeet() gave incorrect value'
        // );
    });

    // Add more specific tests for each calculation type
    await t.test('should handle zero distance', () => {
        const distance = new GreatCircle(london, london)
            .withSphere(Sphere.earth())
            .distance();

        assert.equal(
            Math.round(distance.inKilometers()), 
            0,
            'GreatCircle.distance() should be 0 for same point'
        );
    });
});