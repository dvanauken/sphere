// Common angles 
import { Angle } from '../../src/core/models/Angle';

// Common Angles
export const ZERO = new Angle(0);
export const RIGHT_ANGLE = new Angle(90);
export const STRAIGHT_ANGLE = new Angle(180);
export const FULL_CIRCLE = new Angle(360);

// Quadrant Angles
export const QUAD_1_MID = new Angle(45);    // Northeast
export const QUAD_2_MID = new Angle(135);   // Northwest
export const QUAD_3_MID = new Angle(225);   // Southwest
export const QUAD_4_MID = new Angle(315);   // Southeast

// Navigation Angles
export const NORTH = new Angle(0);
export const EAST = new Angle(90);
export const SOUTH = new Angle(180);
export const WEST = new Angle(270);

// Special Angles
export const EQUILATERAL = new Angle(60);  // Angle in equilateral triangle
export const GOLDEN = new Angle(137.5);    // Golden angle
export const HALF_TURN = new Angle(180);   // Half turn
export const THIRD_TURN = new Angle(120);  // One third of a circle

// Test Cases
export const ACUTE = new Angle(45);
export const OBTUSE = new Angle(135);
export const REFLEX = new Angle(270);

// Edge Cases
export const NEGATIVE = new Angle(-45);
export const OVER_360 = new Angle(400);
export const UNDER_NEG_360 = new Angle(-400);