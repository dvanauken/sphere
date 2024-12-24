// test/helpers/assertions.ts
import assert from 'node:assert';

export function assertNearlyEqual(
    actual: number,
    expected: number,
    tolerance: number,
    message?: string
) {
    const diff = Math.abs(actual - expected);
    assert.ok(
        diff <= tolerance,
        message || `Expected ${actual} to be within ${tolerance} of ${expected} (diff: ${diff})`
    );
}

export function assertDistanceNearlyEqual(
    actual: number,
    expected: number,
    toleranceKm: number = 0.1,
    message?: string
) {
    assertNearlyEqual(
        actual,
        expected,
        toleranceKm,
        message || `Distance ${actual}km should be within ${toleranceKm}km of ${expected}km`
    );
}