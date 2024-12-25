// Test constants 
// Test Tolerances
export const DISTANCE_TOLERANCE_METERS = 1; // 1 meter tolerance for distance comparisons
export const ANGLE_TOLERANCE_DEGREES = 0.1; // 0.1 degree tolerance for angle comparisons
export const COORDINATE_TOLERANCE_DEGREES = 0.0001; // 0.0001 degree tolerance for coordinate comparisons
export const AREA_TOLERANCE_KM2 = 1; // 1 km² tolerance for area comparisons
export const ALTITUDE_TOLERANCE_METERS = 1; // 1 meter tolerance for altitude comparisons
// Test Categories
export const TEST_CATEGORIES = {
    CONSTRUCTOR: 'Constructor Tests',
    VALIDATION: 'Input Validation',
    CALCULATIONS: 'Core Calculations',
    EDGE_CASES: 'Edge Cases',
    ERROR_HANDLING: 'Error Handling',
    REAL_WORLD: 'Real World Examples',
    INTEGRATION: 'Integration Tests'
};
// Error Messages
export const ERROR_MESSAGES = {
    INVALID_LATITUDE: 'Latitude must be between -90 and 90 degrees',
    INVALID_LONGITUDE: 'Longitude must be between -180 and 180 degrees',
    INVALID_ANGLE: 'Angle must be a finite number',
    INVALID_DISTANCE: 'Distance must be non-negative',
    INVALID_RADIUS: 'Radius must be positive',
    INVALID_COORDINATE: 'Invalid coordinate',
    INVALID_POINT: 'Invalid point'
};
// Common Test Values
export const TEST_VALUES = {
    ITERATIONS: 100,
    MIN_POINTS: 10,
    MAX_POINTS: 1000,
    SEED: 12345 // Seed for random number generation
};
// Mathematical Constants
export const MATH_CONSTANTS = {
    EARTH_RADIUS_KM: 6371,
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,
    EPSILON: 1e-10 // Small number for floating-point comparisons
};
