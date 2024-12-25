export declare const DISTANCE_TOLERANCE_METERS = 1;
export declare const ANGLE_TOLERANCE_DEGREES = 0.1;
export declare const COORDINATE_TOLERANCE_DEGREES = 0.0001;
export declare const AREA_TOLERANCE_KM2 = 1;
export declare const ALTITUDE_TOLERANCE_METERS = 1;
export declare const TEST_CATEGORIES: {
    readonly CONSTRUCTOR: "Constructor Tests";
    readonly VALIDATION: "Input Validation";
    readonly CALCULATIONS: "Core Calculations";
    readonly EDGE_CASES: "Edge Cases";
    readonly ERROR_HANDLING: "Error Handling";
    readonly REAL_WORLD: "Real World Examples";
    readonly INTEGRATION: "Integration Tests";
};
export declare const ERROR_MESSAGES: {
    readonly INVALID_LATITUDE: "Latitude must be between -90 and 90 degrees";
    readonly INVALID_LONGITUDE: "Longitude must be between -180 and 180 degrees";
    readonly INVALID_ANGLE: "Angle must be a finite number";
    readonly INVALID_DISTANCE: "Distance must be non-negative";
    readonly INVALID_RADIUS: "Radius must be positive";
    readonly INVALID_COORDINATE: "Invalid coordinate";
    readonly INVALID_POINT: "Invalid point";
};
export declare const TEST_VALUES: {
    readonly ITERATIONS: 100;
    readonly MIN_POINTS: 10;
    readonly MAX_POINTS: 1000;
    readonly SEED: 12345;
};
export declare const MATH_CONSTANTS: {
    readonly EARTH_RADIUS_KM: 6371;
    readonly DEG_TO_RAD: number;
    readonly RAD_TO_DEG: number;
    readonly EPSILON: 1e-10;
};
