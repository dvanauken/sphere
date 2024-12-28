import { Coordinate } from '../core/models/Coordinate.js';
import { SmallCircle } from '../core/models/SmallCircle.js';
import { Distance } from '../core/models/Distance.js';

export class SmallCircleExample {
    private readonly points: Coordinate[] = [];
    private readonly circles: SmallCircle[] = [];
    
    constructor(private readonly circleRadius: Distance) {}

    /**
     * Generates points using graticule intersections
     * @param interval Interval in degrees between parallels and meridians
     */
    generateGraticulePoints(interval: number = 30): void {
        this.points.length = 0;
        
        for (let lat = -90; lat <= 90; lat += interval) {
            for (let lon = -180; lon < 180; lon += interval) {
                this.points.push(Coordinate.at(lat, lon));
            }
        }
        
        this.generateCircles();
    }

    /**
     * Generates points based on icosahedron vertices and subdivisions
     * More uniform distribution than graticule
     */
    generateIcosahedronPoints(): void {
        this.points.length = 0;
        
        // Golden ratio for icosahedron vertices
        const phi = (1 + Math.sqrt(5)) / 2;
        const norm = Math.sqrt(1 + phi * phi);
        
        // 12 vertices of regular icosahedron
        const vertices = [
            [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
            [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
            [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
        ].map(([x, y, z]) => {
            // Normalize and convert to lat/lon
            const norm = Math.sqrt(x * x + y * y + z * z);
            const lat = Math.asin(z / norm) * 180 / Math.PI;
            const lon = Math.atan2(y, x) * 180 / Math.PI;
            return Coordinate.at(lat, lon);
        });

        this.points.push(...vertices);
        this.generateCircles();
    }

    private generateCircles(): void {
        this.circles.length = 0;
        
        for (const point of this.points) {
            this.circles.push(
                SmallCircle.withCenter(point).radius(this.circleRadius)
            );
        }
    }

    getPoints(): Coordinate[] {
        return [...this.points];
    }

    getCircles(): SmallCircle[] {
        return [...this.circles];
    }
}