// Custom assertions 
import { expect } from 'vitest';
import { Coordinate } from '../../src/core/models/Coordinate';
import { Distance } from '../../src/core/models/Distance';
import { Angle } from '../../src/core/models/Angle';

// Distance assertions
export function assertDistanceNearlyEqual(
    actual: Distance,
    expected: Distance,
    toleranceMeters: number = 1,
    message?: string
) {
    const diff = Math.abs(actual.inMeters() - expected.inMeters());
    expect(diff).toBeLessThanOrEqual(
        toleranceMeters,
        message || `Expected distance to be within ${toleranceMeters}m of ${expected.inMeters()}m`
    );
}

// Angle assertions
export function assertAngleNearlyEqual(
    actual: Angle,
    expected: Angle,
    toleranceDegrees: number = 0.1,
    message?: string
) {
    const diff = Math.abs(actual.degrees - expected.degrees) % 360;
    const smallestDiff = Math.min(diff, 360 - diff);
    expect(smallestDiff).toBeLessThanOrEqual(
        toleranceDegrees,
        message || `Expected angle to be within ${toleranceDegrees}° of ${expected.degrees}°`
    );
}

// Coordinate assertions
export function assertCoordinateNearlyEqual(
    actual: Coordinate,
    expected: Coordinate,
    toleranceDegrees: number = 0.0001,
    message?: string
) {
    const latDiff = Math.abs(actual.latitude - expected.latitude);
    const lonDiff = Math.abs(actual.longitude - expected.longitude);
    
    expect(latDiff).toBeLessThanOrEqual(
        toleranceDegrees,
        message || `Latitude difference exceeds tolerance`
    );
    expect(lonDiff).toBeLessThanOrEqual(
        toleranceDegrees,
        message || `Longitude difference exceeds tolerance`
    );
    
    if (actual.altitude !== undefined && expected.altitude !== undefined) {
        const altDiff = Math.abs(actual.altitude - expected.altitude);
        expect(altDiff).toBeLessThanOrEqual(
            1, // 1 meter tolerance for altitude
            message || `Altitude difference exceeds tolerance`
        );
    }
}

// Area assertions (for spherical geometry)
export function assertAreaNearlyEqual(
    actual: number,
    expected: number,
    toleranceKm2: number = 1,
    message?: string
) {
    const diff = Math.abs(actual - expected);
    expect(diff).toBeLessThanOrEqual(
        toleranceKm2,
        message || `Expected area to be within ${toleranceKm2}km² of ${expected}km²`
    );
}

// Bearing/Azimuth assertions
export function assertBearingNearlyEqual(
    actual: Angle,
    expected: Angle,
    toleranceDegrees: number = 0.1,
    message?: string
) {
    let diff = Math.abs(actual.degrees - expected.degrees) % 360;
    if (diff > 180) diff = 360 - diff;
    expect(diff).toBeLessThanOrEqual(
        toleranceDegrees,
        message || `Expected bearing to be within ${toleranceDegrees}° of ${expected.degrees}°`
    );
}