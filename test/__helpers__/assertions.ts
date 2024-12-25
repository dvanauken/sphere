// Custom assertions 
import { expect } from "vitest";
import { Distance, Angle, Coordinate } from "../../src/index.js";

export function assertNumberNearlyEqual(
    actual: Distance,
    expected: Distance,
    toleranceMeters: number = 1
) {
    const diff = Math.abs(actual.inMeters() - expected.inMeters());
    try {
        expect(diff).toBeLessThanOrEqual(toleranceMeters);
    } catch (err: unknown) {
        const vitestMessage = (err instanceof Error) ? err.message : String(err);
        throw new Error(`
            Type:       ?
            Calculated: ${actual.inMeters()}m
            Expected:   ${expected.inMeters()}m
            Delta:      ${diff}m
            Tolerance:  ${toleranceMeters}m
        `);
    }
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
    expect(smallestDiff, message || `Expected angle to be within ${toleranceDegrees}° of ${expected.degrees}°`)
        .toBeLessThanOrEqual(toleranceDegrees);
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

    expect(latDiff, message || `Latitude difference exceeds tolerance`)
        .toBeLessThanOrEqual(toleranceDegrees);
    expect(lonDiff, message || `Longitude difference exceeds tolerance`)
        .toBeLessThanOrEqual(toleranceDegrees);

    if (actual.altitude !== undefined && expected.altitude !== undefined) {
        const altDiff = Math.abs(actual.altitude - expected.altitude);
        expect(altDiff, message || `Altitude difference exceeds tolerance`)
            .toBeLessThanOrEqual(1); // 1 meter tolerance for altitude
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
    expect(diff, message || `Expected area to be within ${toleranceKm2}km² of ${expected}km²`)
        .toBeLessThanOrEqual(toleranceKm2);
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
    expect(diff, message || `Expected bearing to be within ${toleranceDegrees}° of ${expected.degrees}°`)
        .toBeLessThanOrEqual(toleranceDegrees);
}


function addFileLineToError(error: Error): Error {
    // If stack is undefined or empty, just return the original error.
    if (!error.stack) return error;
  
    // Each line in the stack is typically in the form:
    //   "    at YourTestFunction (path/to/your/file.ts:line:column)"
    // or sometimes:
    //   "    at path/to/your/file.ts:line:column"
    //
    // Let's try to parse the second line, which is the caller line.
    const stackLines = error.stack.split('\n');
    
    // The first line is typically "Error: message"
    // The second line is usually "    at ..."
    if (stackLines.length < 2) return error; 
  
    // For safety, pick the *second* stack line.
    const callerLine = stackLines[1].trim();
  
    // Try to match the "filename:line:column" portion.
    const match = callerLine.match(/\(?(.+):(\d+):(\d+)\)?$/);
    if (!match) return error;
  
    // match[1] = file path, match[2] = line, match[3] = column
    const filePath = match[1];
    const lineNumber = match[2];
    const columnNumber = match[3];
  
    // We can insert that into the existing error message or create a new error:
    const enhancedMessage = `${error.message.trim()}
  
  File:      ${filePath}
  Line/Col:  ${lineNumber}:${columnNumber}
  `;
  
    // Create a new error with the combined message (and same stack).
    const newError = new Error(enhancedMessage);
    newError.stack = error.stack; // preserve original stack
    return newError;
  }
  