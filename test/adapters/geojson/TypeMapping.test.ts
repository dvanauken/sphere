// TypeMapping test file 
import { describe, it, expect } from 'vitest';
import { TypeMapping, Coordinate, Point, GreatCircle, SmallCircle, Triangle } from '../../../src/index.js';
import { TEST_CATEGORIES } from '../../__helpers__/constants.js';

describe('TypeMapping', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should have default mappings for core types', () => {
            expect(TypeMapping.hasMapping(Coordinate)).toBe(true);
            expect(TypeMapping.hasMapping(Point)).toBe(true);
            expect(TypeMapping.hasMapping(GreatCircle)).toBe(true);
            expect(TypeMapping.hasMapping(SmallCircle)).toBe(true);
            expect(TypeMapping.hasMapping(Triangle)).toBe(true);
        });

        it('should return null for unknown types', () => {
            class UnknownType {}
            expect(TypeMapping.get(UnknownType)).toBeNull();
        });
    });

    describe('Mapping Operations', () => {
        it('should get correct GeoJSON type for each model', () => {
            const mappings = {
                Coordinate: 'Point',
                Point: 'Point',
                GreatCircle: 'LineString',
                SmallCircle: 'Polygon',
                Triangle: 'Polygon'
            };

            for (const [modelName, geoType] of Object.entries(mappings)) {
                const mapping = TypeMapping.get(eval(modelName));
                expect(mapping?.type).toBe(geoType);
            }
        });

        it('should return copy of mapping to prevent modification', () => {
            const mapping1 = TypeMapping.get(Coordinate);
            const mapping2 = TypeMapping.get(Coordinate);
            
            expect(mapping1).not.toBe(mapping2);
            expect(mapping1).toEqual(mapping2);
        });
    });

    describe('Registration', () => {
        it('should register new valid mapping', () => {
            class CustomType {}
            const geoType = { type: "Point", coordinates: [] };
            
            TypeMapping.registerMapping(CustomType, geoType);
            expect(TypeMapping.hasMapping(CustomType)).toBe(true);
            expect(TypeMapping.get(CustomType)).toEqual(geoType);
        });

        it('should throw error for invalid GeoJSON type', () => {
            class CustomType {}
            const invalidType = { type: "InvalidType", coordinates: [] };
            
            expect(() => {
                TypeMapping.registerMapping(CustomType, invalidType as any);
            }).toThrow();
        });

        it('should allow overriding existing mapping', () => {
            class CustomType {}
            const type1 = { type: "Point", coordinates: [] };
            const type2 = { type: "LineString", coordinates: [] };
            
            TypeMapping.registerMapping(CustomType, type1);
            TypeMapping.registerMapping(CustomType, type2);
            
            expect(TypeMapping.get(CustomType)?.type).toBe("LineString");
        });
    });

    describe('Type Lookup', () => {
        it('should find source types for GeoJSON type', () => {
            const pointSources = TypeMapping.getSourceTypeForGeoType('Point');
            expect(pointSources).toContain(Coordinate);
            expect(pointSources).toContain(Point);
            
            const polygonSources = TypeMapping.getSourceTypeForGeoType('Polygon');
            expect(polygonSources).toContain(SmallCircle);
            expect(polygonSources).toContain(Triangle);
        });

        it('should return empty array for unknown GeoJSON type', () => {
            const sources = TypeMapping.getSourceTypeForGeoType('UnknownType');
            expect(sources).toHaveLength(0);
        });
    });

    describe('Mapping Access', () => {
        it('should return all mappings', () => {
            const allMappings = TypeMapping.getAllMappings();
            expect(allMappings.size).toBeGreaterThan(0);
            expect(allMappings instanceof Map).toBe(true);
        });

        it('should return copy of mappings to prevent modification', () => {
            const mappings1 = TypeMapping.getAllMappings();
            const mappings2 = TypeMapping.getAllMappings();
            
            expect(mappings1).not.toBe(mappings2);
            expect([...mappings1.entries()]).toEqual([...mappings2.entries()]);
        });
    });

    describe(TEST_CATEGORIES.EDGE_CASES, () => {
        it('should handle undefined type registration', () => {
            expect(() => {
                TypeMapping.registerMapping(undefined as any, { type: "Point", coordinates: [] });
            }).toThrow();
        });

        it('should handle null type registration', () => {
            expect(() => {
                TypeMapping.registerMapping(null as any, { type: "Point", coordinates: [] });
            }).toThrow();
        });

        it('should handle registration with empty GeoType', () => {
            class CustomType {}
            expect(() => {
                TypeMapping.registerMapping(CustomType, {} as any);
            }).toThrow();
        });
    });

    describe('Type Validation', () => {
        it('should validate GeoJSON types on registration', () => {
            class CustomType {}
            const validTypes = ["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"];
            
            validTypes.forEach(type => {
                expect(() => {
                    TypeMapping.registerMapping(CustomType, { type, coordinates: [] });
                }).not.toThrow();
            });
        });

        it('should reject invalid GeoJSON types', () => {
            class CustomType {}
            const invalidTypes = ["Invalid", "Circle", "Rectangle", ""];
            
            invalidTypes.forEach(type => {
                expect(() => {
                    TypeMapping.registerMapping(CustomType, { type, coordinates: [] } as any);
                }).toThrow();
            });
        });
    });
});