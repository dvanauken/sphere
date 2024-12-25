import { Distance, Angle, Coordinate } from "../../src/index.js";
export declare function assertDistanceNearlyEqual(actual: Distance, expected: Distance, toleranceMeters?: number, message?: string): void;
export declare function assertAngleNearlyEqual(actual: Angle, expected: Angle, toleranceDegrees?: number, message?: string): void;
export declare function assertCoordinateNearlyEqual(actual: Coordinate, expected: Coordinate, toleranceDegrees?: number, message?: string): void;
export declare function assertAreaNearlyEqual(actual: number, expected: number, toleranceKm2?: number, message?: string): void;
export declare function assertBearingNearlyEqual(actual: Angle, expected: Angle, toleranceDegrees?: number, message?: string): void;
