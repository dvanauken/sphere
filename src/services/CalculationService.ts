// src/services/CalculationService.ts
import { Angle } from "../models/Angle";
import { Azimuth } from "../models/Azimuth";
import { Bearing } from "../models/Bearing";
import { Coordinate } from "../models/Coordinate";
import { GreatCircle } from "../models/GreatCircle";
import { Distance } from "../models/Distance";
import { Sphere } from "../models/Sphere";

export class CalculationService {
    // Calculate the distance between two coordinates on the sphere
    calculateDistance(start: Coordinate, end: Coordinate): Distance {
        const greatCircle = new GreatCircle(start, end)
            .withSphere(Sphere.earth()); // Using our new factory method
        return greatCircle.distance();
    }

    // Calculate the bearing from one coordinate to another
    calculateBearing(start: Coordinate, end: Coordinate): number {
        const bearing = new Bearing(start, end);
        return bearing.calculateInitialBearing();
    }

    // Calculate the angle between three points on the sphere
    calculateTriangleAngle(a: Coordinate, b: Coordinate, c: Coordinate): Angle {
        // Placeholder for method implementation
        return new Angle(0);  // Example placeholder
    }

    // Calculate the area of a polygon defined by spherical coordinates
    calculatePolygonArea(coordinates: Coordinate[]): number {
        // Placeholder for area calculation using spherical excess formula
        return 0;  // Simplified example return
    }
}