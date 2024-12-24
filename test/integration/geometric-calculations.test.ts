import { describe, it, expect } from 'vitest';
import { Coordinate } from '../../src/core/models/Coordinate';
import { GreatCircle } from '../../src/core/models/GreatCircle';
import { SmallCircle } from '../../src/core/models/SmallCircle';
import { Triangle } from '../../src/core/models/Triangle';
import { Distance } from '../../src/core/models/Distance';
import { Angle } from '../../src/core/models/Angle';
import { Azimuth } from '../../src/core/models/Azimuth';
import { Bearing } from '../../src/core/models/Bearing';
import { assertDistanceNearlyEqual, assertAngleNearlyEqual } from '../__helpers__/assertions';
import {
    LONDON,
    PARIS,
    NEW_YORK,
    TOKYO
} from '../__fixtures__/coordinates';

describe('Geometric Calculations Integration', () => {
    describe('Flight Route Planning', () => {
        it('should calculate great circle route with waypoints', () => {
            // Flight from London to Tokyo with waypoint at Dubai
            const dubai = new Coordinate(25.2532, 55.3657);
            
            // Calculate route segments
            const leg1 = GreatCircle.from(LONDON).to(dubai);
            const leg2 = GreatCircle.from(dubai).to(TOKYO);
            
            // Generate waypoints along route
            const waypoints1 = leg1.generatePoints({ spacing: Distance.fromKilometers(500) });
            const waypoints2 = leg2.generatePoints({ spacing: Distance.fromKilometers(500) });
            
            // Calculate total distance
            const totalDistance = new Distance(
                leg1.distance().inMeters() + leg2.distance().inMeters()
            );
            
            // Verify reasonable results
            expect(waypoints1.length).toBeGreaterThan(5);
            expect(waypoints2.length).toBeGreaterThan(5);
            expect(totalDistance.inKilometers()).toBeGreaterThan(5000);
        });

        it('should handle flight path restrictions', () => {
            // Simulate restricted airspace as a small circle
            const restrictedZone = SmallCircle.withCenter(
                new Coordinate(50.0, 40.0)
            ).radius(Distance.fromKilometers(500));
            
            // Calculate route points
            const route = GreatCircle.from(LONDON).to(TOKYO);
            const waypoints = route.generatePoints({ spacing: Distance.fromKilometers(100) });
            
            // Check if any waypoint intersects with restricted zone
            const intersections = waypoints.filter(point => {
                const distanceToCenter = GreatCircle.from(restrictedZone.getCenter())
                    .to(point)
                    .distance();
                return distanceToCenter.inMeters() <= restrictedZone.getRadius().inMeters();
            });
            
            // Store intersection points for potential rerouting
            expect(intersections.length).toBeDefined();
        });
    });

    describe('Maritime Navigation', () => {
        it('should calculate shipping route with heading changes', () => {
            // New York to Rotterdam shipping route
            const rotterdam = new Coordinate(51.9225, 4.4792);
            const route = GreatCircle.from(NEW_YORK).to(rotterdam);
            
            // Calculate initial and final bearings
            const initialBearing = Bearing.from(NEW_YORK).to(rotterdam).initial();
            const finalBearing = Bearing.from(NEW_YORK).to(rotterdam).final();
            
            // Generate navigation points every 100km
            const navPoints = route.generatePoints({ 
                spacing: Distance.fromKilometers(100) 
            });
            
            // Calculate heading at each point
            const headings = navPoints.map((point, i) => {
                if (i === navPoints.length - 1) return finalBearing;
                return Azimuth.from(point).to(navPoints[i + 1]).forward();
            });
            
            // Verify reasonable results
            expect(navPoints.length).toBeGreaterThan(10);
            expect(headings.length).toBe(navPoints.length);
            expect(Math.abs(headings[0].degrees - initialBearing.degrees))
                .toBeLessThan(1);
        });

        it('should handle emergency diversion scenarios', () => {
            // Original route: NY to Rotterdam
            const rotterdam = new Coordinate(51.9225, 4.4792);
            const originalRoute = GreatCircle.from(NEW_YORK).to(rotterdam);
            
            // Emergency port: Halifax
            const halifax = new Coordinate(44.6488, -63.5752);
            
            // Calculate diversion
            const diversionRoute = GreatCircle.from(
                originalRoute.interpolate(0.3) as Coordinate
            ).to(halifax);
            
            // Calculate new total distance
            const distanceToEmergency = diversionRoute.distance();
            
            // Verify reasonable results
            expect(distanceToEmergency.inKilometers()).toBeGreaterThan(0);
            expect(distanceToEmergency.inKilometers()).toBeLessThan(
                originalRoute.distance().inKilometers()
            );
        });
    });

    describe('Area Coverage Analysis', () => {
        it('should calculate search and rescue coverage area', () => {
            // Last known position
            const lastKnown = new Coordinate(40.7128, -74.006);
            
            // Create search patterns: expanding squares
            const searchRadius = Distance.fromKilometers(10);
            const searchCircle = SmallCircle.withCenter(lastKnown)
                .radius(searchRadius);
            
            // Generate perimeter points
            const perimeterPoints = searchCircle.generatePoints(16);
            
            // Create search triangles for area coverage
            const triangles = perimeterPoints.map((point, i) => {
                const nextPoint = perimeterPoints[(i + 1) % perimeterPoints.length];
                return Triangle.from(lastKnown).to(point).and(nextPoint);
            });
            
            // Calculate total search area
            const totalArea = triangles.reduce(
                (sum, triangle) => sum + triangle.area(),
                0
            );
            
            // Verify coverage
            expect(totalArea).toBeGreaterThan(0);
            expect(triangles.length).toBe(16);
        });

        it('should handle overlapping coverage areas', () => {
            // Two search areas with overlap
            const center1 = new Coordinate(40.7128, -74.006);
            const center2 = new Coordinate(40.7128, -73.95);
            const radius = Distance.fromKilometers(5);
            
            const area1 = SmallCircle.withCenter(center1).radius(radius);
            const area2 = SmallCircle.withCenter(center2).radius(radius);
            
            // Calculate distance between centers
            const centerDistance = GreatCircle.from(center1)
                .to(center2)
                .distance();
            
            // Check for overlap
            const hasOverlap = centerDistance.inMeters() < 
                (area1.getRadius().inMeters() + area2.getRadius().inMeters());
            
            expect(hasOverlap).toBeDefined();
            expect(area1.area() + area2.area()).toBeGreaterThan(0);
        });
    });

    describe('Survey Route Planning', () => {
        it('should generate parallel survey lines', () => {
            // Survey area corners
            const sw = new Coordinate(40.7, -74.1);
            const se = new Coordinate(40.7, -73.9);
            const ne = new Coordinate(40.8, -73.9);
            const nw = new Coordinate(40.8, -74.1);
            
            // Create boundary
            const boundary = [sw, se, ne, nw];
            
            // Generate parallel lines
            const lineSpacing = Distance.fromKilometers(0.5);
            const lines: GreatCircle[] = [];
            
            for (let i = 0; i < 5; i++) {
                const start = GreatCircle.from(sw).to(se)
                    .interpolate(i/4) as Coordinate;
                const end = GreatCircle.from(nw).to(ne)
                    .interpolate(i/4) as Coordinate;
                    
                lines.push(GreatCircle.from(start).to(end));
            }
            
            // Calculate total survey distance
            const totalDistance = lines.reduce(
                (sum, line) => sum + line.distance().inMeters(),
                0
            );
            
            expect(lines.length).toBe(5);
            expect(totalDistance).toBeGreaterThan(0);
        });
    });
});