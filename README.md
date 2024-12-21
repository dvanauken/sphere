// Readme file for the project. 
# Spherical Geometry API

## Overview
This API provides a comprehensive toolkit for performing geometric calculations on a spherical surface, ideal for applications in navigation, astronomy, and geospatial analysis.

## Classes and Methods

### Sphere
| Method            | Description                                |
|-------------------|--------------------------------------------|
| `surfaceArea()`   | Calculates the surface area of the sphere. |
| `volume()`        | Calculates the volume of the sphere.       |

### Coordinate
| Method            | Description                                        |
|-------------------|----------------------------------------------------|
| `toRadians()`     | Converts the latitude and longitude to radians.    |
| `toString()`      | Returns a string representation of the coordinate. |

### GreatCircle
| Method                 | Description                                        |
|------------------------|----------------------------------------------------|
| `calculateDistance()`  | Calculates the distance between two coordinates.   |
| `findMidpoint()`       | Finds the midpoint along the great circle path.    |

### Arc
| Method                 | Description                              |
|------------------------|------------------------------------------|
| `calculateLength()`    | Calculates the length of the arc.        |
| `findPointAtFraction()`| Finds a point at a specified fraction along the arc. |

### Triangle
| Method                 | Description                              |
|------------------------|------------------------------------------|
| `calculateArea()`      | Calculates the area of the spherical triangle. |
| `calculatePerimeter()` | Calculates the perimeter of the triangle. |

### Angle
| Method                 | Description                                |
|------------------------|--------------------------------------------|
| `toRadians()`          | Converts the angle to radians.              |
| `normalize()`          | Normalizes the angle to the range [0, 360]. |
| `add(angle: Angle)`    | Adds another angle to this angle.           |
| `subtract(angle: Angle)` | Subtracts another angle from this angle.  |

### Azimuth
| Method                 | Description                                |
|------------------------|--------------------------------------------|
| `calculateAzimuth()`   | Calculates the azimuth from start to end point. |

### Bearing
| Method                      | Description                                  |
|-----------------------------|----------------------------------------------|
| `calculateInitialBearing()` | Calculates the initial bearing from start to end point. |
| `calculateFinalBearing()`   | Calculates the final bearing from start to end point.   |

### GeometryService
| Method                           | Description                                  |
|----------------------------------|----------------------------------------------|
| `createGreatCircle()`           | Creates a great circle from two coordinates. |
| `calculateSmallCircleArea()`    | Calculates the area of a small circle given its radius. |
| `isWithinDistanceFromGreatCircle()` | Determines if a coordinate is within a certain distance from a great circle. |

### CalculationService
| Method                           | Description                                  |
|----------------------------------|----------------------------------------------|
| `calculateDistance()`            | Calculates the distance between two coordinates. |
| `calculateBearing()`             | Calculates the bearing between two coordinates. |
| `calculateTriangleAngle()`       | Calculates the angle at a vertex of a spherical triangle given three coordinates. |

### Converters
| Method                     | Description                                  |
|----------------------------|----------------------------------------------|
| `degreesToRadians(degrees)`| Converts degrees to radians.                 |
| `radiansToDegrees(radians)`| Converts radians to degrees.                 |

### Validators
| Method                     | Description                                  |
|----------------------------|----------------------------------------------|
| `validateLatitude(latitude)` | Validates if the latitude is within valid range. |
| `validateLongitude(longitude)` | Validates if the longitude is within valid range. |

