import { Coordinate } from './Coordinate';
import { Point } from './Point';
import { Sphere } from './Sphere';
import { Distance } from './Distance';
import { Angle } from './Angle';

export class Triangle {
    private readonly points: Point[];

    private constructor(
        private readonly vertices: [Coordinate, Coordinate, Coordinate],
        private readonly sphere: Sphere = Sphere.earth()
    ) {
        this.points = vertices.map(v => Point.fromCoordinate(v));
    }

    static from = (a: Coordinate) => ({
        to: (b: Coordinate) => ({
            and: (c: Coordinate) => new Triangle([a, b, c])
        })
    });

    withSphere = (sphere: Sphere): Triangle =>
        new Triangle(this.vertices, sphere);

    area = (): number => {
        const angles = this.angles();
        const sphericalExcess = angles.reduce((sum, angle) => sum + angle.degrees, 0) - 180;
        return sphericalExcess * (Math.PI / 180) * this.sphere.radius ** 2;
    };

    perimeter = (): Distance => {
        const sides = this.sides();
        const totalMeters = sides.reduce((sum, side) => sum + side.inMeters(), 0);
        return new Distance(totalMeters);
    };

    angles = (): [Angle, Angle, Angle] => {
        return [0, 1, 2].map(i => {
            const p1 = this.points[i];
            const p2 = this.points[(i + 1) % 3];
            const p3 = this.points[(i + 2) % 3];
            
            const v1 = this.vectorBetween(p1, p2);
            const v2 = this.vectorBetween(p1, p3);
            const angle = this.angleBetweenVectors(v1, v2);
            
            return new Angle(angle * (180 / Math.PI));
        }) as [Angle, Angle, Angle];
    };

    sides = (): [Distance, Distance, Distance] => {
        return [0, 1, 2].map(i => {
            const start = this.points[i];
            const end = this.points[(i + 1) % 3];
            return this.sphericalDistance(start, end);
        }) as [Distance, Distance, Distance];
    };

    private vectorBetween = (p1: Point, p2: Point): [number, number, number] => {
        const x = Math.cos(p2.Y) * Math.cos(p2.X) - Math.cos(p1.Y) * Math.cos(p1.X);
        const y = Math.cos(p2.Y) * Math.sin(p2.X) - Math.cos(p1.Y) * Math.sin(p1.X);
        const z = Math.sin(p2.Y) - Math.sin(p1.Y);
        return [x, y, z];
    };

    private angleBetweenVectors = (v1: [number, number, number], v2: [number, number, number]): number => {
        const dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
        const mag1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2]);
        const mag2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2]);
        return Math.acos(dot / (mag1 * mag2));
    };

    private sphericalDistance = (p1: Point, p2: Point): Distance => {
        const dLat = p2.Y - p1.Y;
        const dLon = p2.X - p1.X;
        const a = Math.sin(dLat/2) ** 2 + 
                 Math.cos(p1.Y) * Math.cos(p2.Y) * 
                 Math.sin(dLon/2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return new Distance(this.sphere.radius * 1000 * c);
    };

    toString = (): string =>
        `Triangle(${this.vertices.map(v => v.toString()).join(' → ')})`;
}