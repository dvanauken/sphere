// This file defines the Triangle class. 
// Triangle.ts
import { Coordinate } from './Coordinate';
import { Sphere } from './Sphere';

export class Triangle {
    vertices: Coordinate[];
    sphere: Sphere;

    constructor(vertexA: Coordinate, vertexB: Coordinate, vertexC: Coordinate, sphere: Sphere) {
        this.vertices = [vertexA, vertexB, vertexC];
        this.sphere = sphere;
    }

    // Calculate the area of the spherical triangle using the spherical excess formula
    calculateArea(): number {
        const radius = this.sphere.radius;
        const A = this.angleBetween(this.vertices[1], this.vertices[2]);
        const B = this.angleBetween(this.vertices[0], this.vertices[2]);
        const C = this.angleBetween(this.vertices[0], this.vertices[1]);

        const sphericalExcess = (A + B + C) - Math.PI;
        return (sphericalExcess * radius * radius);
    }

    // Calculate the perimeter of the spherical triangle
    calculatePerimeter(): number {
        const a = this.sphericalDistance(this.vertices[1], this.vertices[2]);
        const b = this.sphericalDistance(this.vertices[0], this.vertices[2]);
        const c = this.sphericalDistance(this.vertices[0], this.vertices[1]);
        
        return a + b + c;
    }

    // Calculate the spherical distance between two coordinates on the surface of the sphere
    private sphericalDistance(coordA: Coordinate, coordB: Coordinate): number {
        const lat1 = coordA.toRadians().latRadians;
        const lon1 = coordA.toRadians().lonRadians;
        const lat2 = coordB.toRadians().latRadians;
        const lon2 = coordB.toRadians().lonRadians;

        // Using the haversine formula to calculate spherical distance
        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return this.sphere.radius * c;
    }

    // Calculate the angle between two vertices, opposite the third vertex
    private angleBetween(coordA: Coordinate, coordB: Coordinate): number {
        const a = this.sphericalDistance(coordA, coordB);
        const b = this.sphericalDistance(this.vertices[0], coordB);
        const c = this.sphericalDistance(this.vertices[0], coordA);

        // Using the spherical law of cosines to calculate the angle at the first vertex
        return Math.acos((Math.cos(a / this.sphere.radius) - Math.cos(b / this.sphere.radius) * Math.cos(c / this.sphere.radius)) / (Math.sin(b / this.sphere.radius) * Math.sin(c / this.sphere.radius)));
    }
}
