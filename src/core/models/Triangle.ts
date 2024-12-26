import { Coordinate } from './Coordinate.js';
import { Distance } from './Distance.js';
import { Angle } from './Angle.js';
import { Sphere } from './Sphere.js';

export class Triangle {
    private constructor(
        private readonly vertices: [Coordinate, Coordinate, Coordinate],
        private readonly sides: [Distance, Distance, Distance],
        private readonly angles: [Angle, Angle, Angle],
        private readonly sphereRadius: Distance = Sphere.getRadius()
    ) {
        this.validateTriangle();
    }

    // Side-Angle-Side (SAS)
    static fromSAS(
        sideA: Distance,
        angleC: Angle,
        sideB: Distance,
        sphereRadius: Distance = Sphere.getRadius()
    ): Triangle {
        if (angleC.degrees <= 0 || angleC.degrees >= 180) {
            throw new Error("Included angle must be between 0° and 180°");
        }

        // Convert sides to radians (arc lengths)
        const a = sideA.inMeters() / sphereRadius.inMeters();
        const b = sideB.inMeters() / sphereRadius.inMeters();
        const C = angleC.toRadians();

        // Calculate third side using spherical law of cosines
        const cosc = Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(C);
        const c = Math.acos(cosc);

        // Calculate remaining angles using spherical law of sines
        const sinA = Math.sin(C) * Math.sin(b) / Math.sin(c);
        const sinB = Math.sin(C) * Math.sin(a) / Math.sin(c);
        
        const A = new Angle(Math.asin(sinA) * (180 / Math.PI));
        const B = new Angle(Math.asin(sinB) * (180 / Math.PI));
        
        // Calculate vertices
        const vertices = Triangle.calculateVertices(a, b, c, A, B, angleC);
        
        return new Triangle(
            vertices,
            [sideA, sideB, new Distance(c * sphereRadius.inMeters())],
            [A, B, angleC],
            sphereRadius
        );
    }

    // Side-Side-Side (SSS)
    static fromSSS(
        sideA: Distance,
        sideB: Distance,
        sideC: Distance,
        sphereRadius: Distance = Sphere.getRadius()
    ): Triangle {
        // Convert sides to radians
        const a = sideA.inMeters() / sphereRadius.inMeters();
        const b = sideB.inMeters() / sphereRadius.inMeters();
        const c = sideC.inMeters() / sphereRadius.inMeters();

        // Validate triangle inequality on sphere
        if (a + b <= c || b + c <= a || c + a <= b) {
            throw new Error("Triangle sides must satisfy spherical triangle inequality");
        }

        // Calculate angles using spherical law of cosines
        const cosA = (Math.cos(a) - Math.cos(b) * Math.cos(c)) / (Math.sin(b) * Math.sin(c));
        const cosB = (Math.cos(b) - Math.cos(c) * Math.cos(a)) / (Math.sin(c) * Math.sin(a));
        const cosC = (Math.cos(c) - Math.cos(a) * Math.cos(b)) / (Math.sin(a) * Math.sin(b));

        const angles: [Angle, Angle, Angle] = [
            new Angle(Math.acos(cosA) * (180 / Math.PI)),
            new Angle(Math.acos(cosB) * (180 / Math.PI)),
            new Angle(Math.acos(cosC) * (180 / Math.PI))
        ];

        // Calculate vertices
        const vertices = Triangle.calculateVertices(a, b, c, angles[0], angles[1], angles[2]);

        return new Triangle(
            vertices,
            [sideA, sideB, sideC],
            angles,
            sphereRadius
        );
    }

    // Angle-Angle-Side (AAS)
    static fromAAS(
        angleA: Angle,
        angleB: Angle,
        sideC: Distance,
        sphereRadius: Distance = Sphere.getRadius()
    ): Triangle {
        // Calculate third angle
        const C = new Angle(180 - (angleA.degrees + angleB.degrees));
        if (C.degrees <= 0) {
            throw new Error("Sum of angles must be less than 180°");
        }

        // Convert side to radians
        const c = sideC.inMeters() / sphereRadius.inMeters();

        // Calculate remaining sides using law of sines
        const sinA = Math.sin(angleA.toRadians());
        const sinB = Math.sin(angleB.toRadians());
        const sinC = Math.sin(C.toRadians());

        const a = Math.asin(Math.sin(c) * sinA / sinC);
        const b = Math.asin(Math.sin(c) * sinB / sinC);

        // Calculate vertices
        const vertices = Triangle.calculateVertices(a, b, c, angleA, angleB, C);

        return new Triangle(
            vertices,
            [new Distance(a * sphereRadius.inMeters()), 
             new Distance(b * sphereRadius.inMeters()), 
             sideC],
            [angleA, angleB, C],
            sphereRadius
        );
    }

    // Angle-Side-Angle (ASA)
    static fromASA(
        angleA: Angle,
        sideB: Distance,
        angleC: Angle,
        sphereRadius: Distance = Sphere.getRadius()
    ): Triangle {
        // Calculate third angle
        const B = new Angle(180 - (angleA.degrees + angleC.degrees));
        if (B.degrees <= 0) {
            throw new Error("Sum of angles must be less than 180°");
        }

        // Convert known side to radians
        const b = sideB.inMeters() / sphereRadius.inMeters();

        // Calculate remaining sides using law of sines
        const sinA = Math.sin(angleA.toRadians());
        const sinB = Math.sin(B.toRadians());
        const sinC = Math.sin(angleC.toRadians());

        const a = Math.asin(Math.sin(b) * sinA / sinB);
        const c = Math.asin(Math.sin(b) * sinC / sinB);

        // Calculate vertices
        const vertices = Triangle.calculateVertices(a, b, c, angleA, B, angleC);

        return new Triangle(
            vertices,
            [new Distance(a * sphereRadius.inMeters()), 
             sideB, 
             new Distance(c * sphereRadius.inMeters())],
            [angleA, B, angleC],
            sphereRadius
        );
    }

    private static calculateVertices(
        a: number,
        b: number,
        c: number,
        A: Angle,
        B: Angle,
        C: Angle
    ): [Coordinate, Coordinate, Coordinate] {
        // Place first vertex at (0, 0)
        const v1 = Coordinate.at(0, 0);

        // Place second vertex along prime meridian
        // Remember: Coordinate.at takes (latitude, longitude)
        const v2 = Coordinate.at(0, b * (180 / Math.PI));

        // Calculate third vertex using spherical coordinates
        const lat3 = Math.asin(
            Math.sin(c) * Math.sin(C.toRadians())
        ) * (180 / Math.PI);

        const lon3 = Math.atan2(
            Math.sin(c) * Math.cos(C.toRadians()),
            Math.cos(c)
        ) * (180 / Math.PI);

        const v3 = Coordinate.at(lat3, lon3);

        return [v1, v2, v3];
    }
    
    private validateTriangle(): void {
        // Validate angles sum to less than 360° (spherical excess)
        const angleSum = this.angles.reduce((sum, angle) => sum + angle.degrees, 0);
        if (angleSum <= 180 || angleSum >= 540) {
            throw new Error("Sum of angles must be between 180° and 540° for a spherical triangle");
        }

        // Validate sides against spherical triangle inequality
        const sides = this.sides.map(s => s.inMeters());
        if (sides[0] + sides[1] <= sides[2] ||
            sides[1] + sides[2] <= sides[0] ||
            sides[2] + sides[0] <= sides[1]) {
            throw new Error("Triangle sides must satisfy spherical triangle inequality");
        }
    }

    area(): number {
        // Calculate area using spherical excess formula
        const angleSum = this.angles.reduce((sum, angle) => sum + angle.degrees, 0);
        const sphericalExcess = (angleSum - 180) * (Math.PI / 180);
        return sphericalExcess * Math.pow(this.sphereRadius.inMeters() / 1000, 2);
    }

    perimeter(): Distance {
        return new Distance(
            this.sides.reduce((sum, side) => sum + side.inMeters(), 0)
        );
    }

    getVertices(): [Coordinate, Coordinate, Coordinate] {
        return [...this.vertices];
    }

    getSides(): [Distance, Distance, Distance] {
        return [...this.sides];
    }

    getAngles(): [Angle, Angle, Angle] {
        return [...this.angles];
    }

    getSphereRadius(): Distance {
        return this.sphereRadius;
    }
}