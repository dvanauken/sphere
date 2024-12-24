// Common test coordinates 
import { Coordinate } from '../../src/core/models/Coordinate';

// Major Cities
export const LONDON = new Coordinate(51.5074, -0.1278);
export const NEW_YORK = new Coordinate(40.7128, -74.0060);
export const TOKYO = new Coordinate(35.6762, 139.6503);
export const SYDNEY = new Coordinate(33.8688, 151.2093);
export const PARIS = new Coordinate(48.8566, 2.3522);
export const LOS_ANGELES = new Coordinate(34.0522, -118.2437);

// Geographic Points of Interest
export const NORTH_POLE = new Coordinate(90, 0);
export const SOUTH_POLE = new Coordinate(-90, 0);
export const EQUATOR_PRIME = new Coordinate(0, 0);  // Equator at Prime Meridian
export const EQUATOR_180 = new Coordinate(0, 180);  // Equator at 180° longitude
export const EQUATOR_MINUS_180 = new Coordinate(0, -180); // Equator at -180° longitude

// Mountain Peaks
export const MOUNT_EVEREST = new Coordinate(27.9881, 86.9250, 8848);
export const KILIMANJARO = new Coordinate(-3.0674, 37.3556, 5895);
export const MOUNT_MCKINLEY = new Coordinate(63.0695, -151.0074, 6190);

// Edge Cases
export const MAX_LAT = new Coordinate(90, 0);
export const MIN_LAT = new Coordinate(-90, 0);
export const MAX_LON = new Coordinate(0, 180);
export const MIN_LON = new Coordinate(0, -180);

// Test Points at Various Quadrants
export const QUAD_1 = new Coordinate(45, 45);    // Northeast
export const QUAD_2 = new Coordinate(45, -45);   // Northwest
export const QUAD_3 = new Coordinate(-45, -45);  // Southwest
export const QUAD_4 = new Coordinate(-45, 45);   // Southeast

// Points for Triangle Testing
export const TRIANGLE_VERTEX_1 = new Coordinate(0, 0);
export const TRIANGLE_VERTEX_2 = new Coordinate(0, 1);
export const TRIANGLE_VERTEX_3 = new Coordinate(1, 0);

// Points for Small Circle Testing
export const CIRCLE_CENTER = new Coordinate(0, 0);
export const CIRCLE_POINT = new Coordinate(0, 1);