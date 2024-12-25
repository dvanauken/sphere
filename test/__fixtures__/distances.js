// Pre-calculated distances 
import { Distance } from "../../src/index.js";
// Common Distances
export const ONE_KILOMETER = Distance.fromKilometers(1);
export const ONE_MILE = Distance.fromMiles(1);
export const ONE_NAUTICAL_MILE = Distance.fromNauticalMiles(1);
// Earth-related Distances
export const EARTH_RADIUS = Distance.fromKilometers(6371); // Average Earth radius
export const EARTH_EQUATORIAL_RADIUS = Distance.fromKilometers(6378.137); // WGS84 equatorial radius
export const EARTH_POLAR_RADIUS = Distance.fromKilometers(6356.752); // WGS84 polar radius
export const EARTH_CIRCUMFERENCE = Distance.fromKilometers(40075.017); // Earth's circumference at equator
// Pre-calculated Real-World Distances
export const LONDON_TO_PARIS = Distance.fromKilometers(344); // ~344 km
export const NEW_YORK_TO_LOS_ANGELES = Distance.fromKilometers(3936); // ~3,936 km
export const SYDNEY_TO_TOKYO = Distance.fromKilometers(7832); // ~7,832 km
// Common Test Distances
export const TINY_DISTANCE = Distance.fromMeters(1);
export const SMALL_DISTANCE = Distance.fromKilometers(1);
export const MEDIUM_DISTANCE = Distance.fromKilometers(100);
export const LARGE_DISTANCE = Distance.fromKilometers(1000);
export const HUGE_DISTANCE = Distance.fromKilometers(10000);
// Special Case Distances
export const ZERO_DISTANCE = Distance.fromMeters(0);
export const QUARTER_EARTH = Distance.fromKilometers(10018.75); // One quarter of Earth's circumference
export const HALF_EARTH = Distance.fromKilometers(20037.5); // Half of Earth's circumference
