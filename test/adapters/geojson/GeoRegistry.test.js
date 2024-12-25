import { describe, it, expect } from 'vitest';
import { GeoRegistry } from '../../../src/adapters/geojson/GeoRegistry.js';
import { GreatCircle } from '../../../src/core/models/GreatCircle.js';
import { SmallCircle } from '../../../src/core/models/SmallCircle.js';
import { Triangle } from '../../../src/core/models/Triangle.js';
import { TEST_CATEGORIES } from '../../__helpers__/constants.js';
import { LONDON, PARIS, TRIANGLE_VERTEX_1, TRIANGLE_VERTEX_2, TRIANGLE_VERTEX_3 } from '../../__fixtures__/coordinates.js';
import { ONE_KILOMETER } from '../../__fixtures__/distances.js';
describe('GeoRegistry', () => {
    describe('Feature to Model Conversion', () => {
        it('should convert LineString feature to GreatCircle', () => {
            const feature = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [PARIS.longitude, PARIS.latitude],
                        [LONDON.longitude, LONDON.latitude]
                    ]
                },
                properties: {}
            };
            const result = GeoRegistry.reverse(feature);
            expect(result).toBeInstanceOf(GreatCircle);
        });
        // Triangle case
        it('should convert Triangle Polygon feature to Triangle', () => {
            const triangleFeature = {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                            [0, 0],
                            [1, 0],
                            [0, 1],
                            [0, 0] // Closing point
                        ]]
                },
                properties: { area: 100 }
            };
            const result = GeoRegistry.reverse(triangleFeature);
            expect(result).toBeInstanceOf(Triangle);
        });
        // Small Circle case
        it('should convert Circle Polygon feature to SmallCircle', () => {
            const circleFeature = {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                            [0, 0],
                            [0.1, 0],
                            [0, 0.1],
                            [0, 0] // Closing point
                        ]]
                },
                properties: { radius: 1000 }
            };
            const result = GeoRegistry.reverse(circleFeature);
            expect(result).toBeInstanceOf(SmallCircle);
        });
    });
    describe('Model to Feature Conversion', () => {
        it('should convert GreatCircle to LineString feature', () => {
            const greatCircle = GreatCircle.from(PARIS).to(LONDON);
            const feature = GeoRegistry.convert(greatCircle, 'Feature');
            expect(feature.type).toBe('Feature');
            expect(feature.geometry.type).toBe('LineString');
            if (feature.geometry.type === 'LineString') {
                expect(feature.geometry.coordinates.length).toBeGreaterThan(0);
            }
        });
        it('should convert SmallCircle to Polygon feature', () => {
            const circle = SmallCircle.withCenter(LONDON).radius(ONE_KILOMETER);
            const feature = GeoRegistry.convert(circle, 'Feature');
            expect(feature.type).toBe('Feature');
            expect(feature.geometry.type).toBe('Polygon');
            if (feature.geometry.type === 'Polygon') {
                expect(feature.geometry.coordinates[0].length).toBeGreaterThan(0);
                // Verify polygon is closed
                const ring = feature.geometry.coordinates[0];
                expect(ring[0]).toEqual(ring[ring.length - 1]);
            }
        });
        it('should convert Triangle to Polygon feature', () => {
            const triangle = Triangle.from(TRIANGLE_VERTEX_1)
                .to(TRIANGLE_VERTEX_2)
                .and(TRIANGLE_VERTEX_3);
            const feature = GeoRegistry.convert(triangle, 'Feature');
            expect(feature.type).toBe('Feature');
            expect(feature.geometry.type).toBe('Polygon');
            if (feature.geometry.type === 'Polygon') {
                expect(feature.geometry.coordinates[0].length).toBe(4); // 3 vertices + closing point
                // Verify polygon is closed
                const ring = feature.geometry.coordinates[0];
                expect(ring[0]).toEqual(ring[ring.length - 1]);
            }
        });
    });
    describe(TEST_CATEGORIES.ERROR_HANDLING, () => {
        it('should handle invalid LineString features', () => {
            const invalidFeature = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [] // Empty coordinates
                },
                properties: {}
            };
            expect(() => {
                GeoRegistry.reverse(invalidFeature);
            }).toThrow();
        });
        it('should handle LineString with insufficient points', () => {
            const invalidFeature = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [[0, 0]] // Only one point
                },
                properties: {}
            };
            expect(() => {
                GeoRegistry.reverse(invalidFeature);
            }).toThrow();
        });
    });
});
