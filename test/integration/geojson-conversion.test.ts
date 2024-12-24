import { describe, it, expect } from 'vitest';
import { TypeConverter } from '../../src/adapters/geojson/TypeConverter';
import { GeoConverter } from '../../src/adapters/geojson/GeoConverter';
import { Coordinate } from '../../src/core/models/Coordinate';
import { GreatCircle } from '../../src/core/models/GreatCircle';
import { SmallCircle } from '../../src/core/models/SmallCircle';
import { Triangle } from '../../src/core/models/Triangle';
import { Distance } from '../../src/core/models/Distance';
import {
    LONDON,
    PARIS,
    NEW_YORK,
    TOKYO
} from '../__fixtures__/coordinates';

describe('GeoJSON Integration', () => {
    describe('Route Planning Data Exchange', () => {
        it('should convert complex route to GeoJSON and back', () => {
            // Create a multi-leg route
            const waypoints = [LONDON, PARIS, NEW_YORK, TOKYO];
            const routes = [];
            
            // Generate route segments
            for (let i = 0; i < waypoints.length - 1; i++) {
                const route = GreatCircle.from(waypoints[i]).to(waypoints[i + 1]);
                routes.push(route);
            }
            
            // Convert to GeoJSON
            const features = routes.map(route => TypeConverter.toFeature(route));
            
            // Convert back to routes
            const reconvertedRoutes = features.map(feature => 
                TypeConverter.fromFeature(feature)
            );
            
            expect(reconvertedRoutes.length).toBe(routes.length);
            reconvertedRoutes.forEach(route => {
                expect(route).toBeInstanceOf(GreatCircle);
            });
        });

        it('should preserve route properties in conversion', () => {
            // Create route with specific properties
            const route = GreatCircle.from(LONDON).to(TOKYO);
            const distance = route.distance();
            
            // Convert to GeoJSON
            const feature = TypeConverter.toFeature(route);
            
            // Verify properties are preserved
            expect(feature.properties.distance).toBeDefined();
            expect(feature.properties.distance).toBeCloseTo(
                distance.inMeters(),
                -2
            );
            
            // Convert back and verify
            const reconverted = TypeConverter.fromFeature(feature) as GreatCircle;
            expect(reconverted.distance().inMeters()).toBeCloseTo(
                distance.inMeters(),
                -2
            );
        });
    });

    describe('Area Coverage Export/Import', () => {
        it('should convert search patterns to GeoJSON and back', () => {
            // Create search pattern with circles and triangles
            const center = new Coordinate(40.7128, -74.006);
            const searchCircle = SmallCircle.withCenter(center)
                .radius(Distance.fromKilometers(10));
            
            const points = searchCircle.generatePoints(3);
            const searchTriangle = Triangle.from(points[0])
                .to(points[1])
                .and(points[2]);
            
            // Convert both to GeoJSON
            const circleFeature = TypeConverter.toFeature(searchCircle);
            const triangleFeature = TypeConverter.toFeature(searchTriangle);
            
            // Convert back
            const reconvertedCircle = TypeConverter.fromFeature(circleFeature);
            const reconvertedTriangle = TypeConverter.fromFeature(triangleFeature);
            
            expect(reconvertedCircle).toBeInstanceOf(SmallCircle);
            expect(reconvertedTriangle).toBeInstanceOf(Triangle);
        });

        it('should handle collection of search areas', () => {
            // Create multiple search areas
            const areas = [];
            const baseCenter = new Coordinate(40.7128, -74.006);
            
            // Generate 3 overlapping search circles
            for (let i = 0; i < 3; i++) {
                const center = new Coordinate(
                    baseCenter.latitude + (i * 0.01),
                    baseCenter.longitude + (i * 0.01)
                );
                areas.push(
                    SmallCircle.withCenter(center)
                        .radius(Distance.fromKilometers(5))
                );
            }
            
            // Convert all to GeoJSON
            const features = areas.map(area => TypeConverter.toFeature(area));
            
            // Convert back
            const reconverted = features.map(feature => 
                TypeConverter.fromFeature(feature)
            );
            
            expect(reconverted.length).toBe(areas.length);
            reconverted.forEach(area => {
                expect(area).toBeInstanceOf(SmallCircle);
            });
        });
    });

    describe('Data Validation and Error Handling', () => {
        it('should handle invalid GeoJSON input', () => {
            const invalidFeatures = [
                { type: 'Feature', geometry: null, properties: {} },
                { type: 'Feature', geometry: { type: 'Unknown' }, properties: {} },
                { type: 'Feature', geometry: { type: 'Point', coordinates: null }, properties: {} }
            ];
            
            invalidFeatures.forEach(feature => {
                expect(() => TypeConverter.fromFeature(feature as any)).toThrow();
            });
        });

        it('should validate coordinate ranges', () => {
            const invalidCoordinates = [
                { type: 'Point', coordinates: [181, 0] },
                { type: 'Point', coordinates: [0, 91] },
                { type: 'Point', coordinates: [-181, -91] }
            ];
            
            invalidCoordinates.forEach(geometry => {
                expect(() => TypeConverter.fromFeature({
                    type: 'Feature',
                    geometry,
                    properties: {}
                } as any)).toThrow();
            });
        });
    });

    describe('Complex Data Structures', () => {
        it('should handle nested geometry collections', () => {
            // Create a complex search and rescue pattern
            const center = new Coordinate(40.7128, -74.006);
            const searchArea = SmallCircle.withCenter(center)
                .radius(Distance.fromKilometers(10));
            
            // Generate search pattern
            const perimeterPoints = searchArea.generatePoints(8);
            const searchPatterns: GreatCircle[] = [];
            
            // Create spokes from center to perimeter
            perimeterPoints.forEach(point => {
                searchPatterns.push(GreatCircle.from(center).to(point));
            });
            
            // Create perimeter segments
            perimeterPoints.forEach((point, i) => {
                const nextPoint = perimeterPoints[(i + 1) % perimeterPoints.length];
                searchPatterns.push(GreatCircle.from(point).to(nextPoint));
            });
            
            const features = searchPatterns.map(pattern => 
                TypeConverter.toFeature(pattern)
            );
            
            // Convert back
            const reconverted = features.map(feature => 
                TypeConverter.fromFeature(feature)
            );
            
            expect(reconverted.length).toBe(searchPatterns.length);
            reconverted.forEach(pattern => {
                expect(pattern).toBeDefined();
            });
        });

        it('should preserve complex properties during conversion', () => {
            const route = GreatCircle.from(LONDON).to(TOKYO);
            const originalFeature = TypeConverter.toFeature(route);
            
            // Add complex properties
            originalFeature.properties = {
                distance: route.distance().inMeters(),
                waypoints: [
                    { name: 'London', coordinates: [LONDON.longitude, LONDON.latitude] },
                    { name: 'Tokyo', coordinates: [TOKYO.longitude, TOKYO.latitude] }
                ],
                metadata: {
                    created: new Date().toISOString(),
                    type: 'flight-route',
                    settings: {
                        altitude: 35000,
                        speed: 500
                    }
                }
            };
            
            // Convert back
            const reconvertedRoute = TypeConverter.fromFeature(originalFeature);
            const reconvertedFeature = TypeConverter.toFeature(reconvertedRoute);
            
            // Verify complex properties are preserved
            expect(reconvertedFeature.properties.waypoints).toBeDefined();
            expect(reconvertedFeature.properties.metadata).toBeDefined();
            expect(reconvertedFeature.properties.metadata.settings).toBeDefined();
        });
    });

    describe('Batch Processing', () => {
        it('should handle bulk conversions', () => {
            // Create a mix of geometric objects
            const geometries = [
                LONDON, // Coordinate
                GreatCircle.from(LONDON).to(PARIS), // GreatCircle
                SmallCircle.withCenter(LONDON).radius(Distance.fromKilometers(10)), // SmallCircle
                Triangle.from(LONDON).to(PARIS).and(NEW_YORK) // Triangle
            ];
            
            // Batch convert to GeoJSON
            const features = geometries.map(geo => TypeConverter.toFeature(geo));
            
            // Batch convert back
            const reconverted = features.map(feature => 
                TypeConverter.fromFeature(feature)
            );
            
            expect(reconverted.length).toBe(geometries.length);
            expect(reconverted[0]).toBeInstanceOf(Coordinate);
            expect(reconverted[1]).toBeInstanceOf(GreatCircle);
            expect(reconverted[2]).toBeInstanceOf(SmallCircle);
            expect(reconverted[3]).toBeInstanceOf(Triangle);
        });

        it('should handle collection conversion', () => {
            // Create a collection of similar objects
            const routes = [
                GreatCircle.from(LONDON).to(PARIS),
                GreatCircle.from(PARIS).to(NEW_YORK),
                GreatCircle.from(NEW_YORK).to(TOKYO)
            ];
            
            // Convert collection to GeoJSON
            const collection = {
                type: 'FeatureCollection',
                features: routes.map(route => TypeConverter.toFeature(route))
            };
            
            // Convert each feature back
            const reconvertedRoutes = collection.features.map(feature =>
                TypeConverter.fromFeature(feature)
            );
            
            expect(reconvertedRoutes.length).toBe(routes.length);
            reconvertedRoutes.forEach(route => {
                expect(route).toBeInstanceOf(GreatCircle);
            });
        });
    });
});