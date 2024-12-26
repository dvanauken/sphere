import { TypeMapping } from "./TypeMapping.js";
import { GeoConversionError } from "../errors/GeoConversionError.js";
import { GeoJsonFeature } from "../types/GeoJsonFeature.js";
import { GeoJsonLineString } from "../types/GeoJsonLineString.js";
import { GeoJsonPoint } from "../types/GeoJsonPoint.js";
import { GeoJsonPolygon } from "../types/GeoJsonPolygon.js";
import { Angle } from "../../../core/models/Angle.js";
import { Arc } from "../../../core/models/Arc.js";
import { Azimuth } from "../../../core/models/Azimuth.js";
import { Coordinate } from "../../../core/models/Coordinate.js";
import { Distance } from "../../../core/models/Distance.js";
import { GreatCircle } from "../../../core/models/GreatCircle.js";
import { SmallCircle } from "../../../core/models/SmallCircle.js";
import { Triangle } from "../../../core/models/Triangle.js";

export class TypeConverter {
    static toFeature(source: any): GeoJsonFeature {
        const geoType  = TypeMapping.getGeoType(source.constructor);
        if (!geoType ) {
            throw new GeoConversionError(
                `No mapping for type ${source.constructor.name}`,
                source.constructor.name,
                'GeoJsonFeature'
            );
        }

        try {
            switch(geoType ) {
                case "Point":
                    if (source instanceof Coordinate) {
                        return {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [source.longitude, source.latitude]
                            } as GeoJsonPoint,
                            properties: {}
                        };
                    }
                    return {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [0, 0]
                        } as GeoJsonPoint,
                        properties: {}
                    };

                case "LineString":
                    if (source instanceof GreatCircle) {
                        const points = source.generatePoints(100);
                        return {
                            type: "Feature",
                            geometry: {
                                type: "LineString",
                                coordinates: points.map(p => [p.longitude, p.latitude])
                            } as GeoJsonLineString,
                            properties: {
                                type: "greatcircle"
                            }
                        };
                    }
                    return {
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: []
                        } as GeoJsonLineString,
                        properties: {}
                    };

                case "Polygon":
                    if (source instanceof SmallCircle) {
                        const points = source.generatePoints(100);
                        points.push(points[0]); // Close the ring
                        return {
                            type: "Feature",
                            geometry: {
                                type: "Polygon",
                                coordinates: [points.map(p => [p.longitude, p.latitude])]
                            } as GeoJsonPolygon,
                            properties: {
                                type: "smallcircle",
                                radius: source.getRadius().inMeters(),
                                area: source.area()
                            }
                        };
                    }
                    if (source instanceof Triangle) {
                        const vertices = source.getVertices();
                        const allVertices = [...vertices, vertices[0]]; // Close the ring
                        return {
                            type: "Feature",
                            geometry: {
                                type: "Polygon",
                                coordinates: [allVertices.map(v => [v.longitude, v.latitude])]
                            } as GeoJsonPolygon,
                            properties: {
                                type: "triangle",
                                area: source.area(),
                                perimeter: source.perimeter().inMeters()
                            }
                        };
                    }
                    return {
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: [[]]
                        } as GeoJsonPolygon,
                        properties: {}
                    };
            }
            
            throw new GeoConversionError(
                `Conversion not implemented for ${geoType }`,
                source.constructor.name,
                'GeoJsonFeature'
            );

        } catch (error) {
            if (error instanceof GeoConversionError) {
                throw error;
            }
            throw new GeoConversionError(
                'Error during conversion',
                source.constructor.name,
                'GeoJsonFeature',
                error as Error
            );
        }
    }

    static fromFeature(feature: GeoJsonFeature): any {
        if (!feature.geometry) {
            throw new GeoConversionError(
                'Invalid Feature: missing geometry',
                'GeoJsonFeature',
                'unknown'
            );
        }

        try {
            switch(feature.geometry.type) {
                case "Point": {
                    const [lon, lat] = feature.geometry.coordinates;
                    return Coordinate.at(lat, lon);
                }

                case "LineString": {
                    const coords = feature.geometry.coordinates;
                    if (coords.length < 2) {
                        throw new GeoConversionError(
                            'Invalid LineString: needs at least 2 points',
                            'GeoJsonFeature',
                            'GreatCircle'
                        );
                    }
                    const center = Coordinate.at(coords[0][1], coords[0][0]);
                    return GreatCircle.withCenter(center);
                }

                case "Polygon": {
                    const coordinates = feature.geometry.coordinates[0];
                    
                    switch (feature.properties?.type) {
                        case "triangle": {
                            if (coordinates.length !== 4) {
                                throw new GeoConversionError(
                                    'Triangle must have exactly 3 vertices plus closing point',
                                    'GeoJsonFeature',
                                    'Triangle'
                                );
                            }

                            const [coord1, coord2, coord3] = coordinates
                                .slice(0, -1)
                                .map(geoCoord => Coordinate.fromGeoJSON(geoCoord));
                    
                            const arc1 = Arc.between(coord1, coord2);
                            const arc2 = Arc.between(coord2, coord3);
                    
                            const sideA = arc1.length();
                            const sideB = arc2.length();
                    
                            const bearingToC = Azimuth.from(coord2).to(coord3).forward();
                            const bearingFromA = Azimuth.from(coord2).to(coord1).forward();
                            const angleC = new Angle(Math.abs(bearingToC.degrees - bearingFromA.degrees));
                    
                            return Triangle.fromSAS(sideA, angleC, sideB);
                        }
                        
                        case "smallcircle": {
                            if (!feature.properties?.radius) {
                                throw new GeoConversionError(
                                    'Small circle missing required radius property',
                                    'GeoJsonFeature',
                                    'SmallCircle'
                                );
                            }
                            const center = Coordinate.fromGeoJSON(coordinates[0]);
                            const radius = new Distance(feature.properties.radius);
                            return SmallCircle.withCenter(center).radius(radius);
                        }
                        
                        default:
                            throw new GeoConversionError(
                                'Unknown or missing polygon type in properties',
                                'GeoJsonFeature',
                                'unknown'
                            );
                    }
                }

                default:
                    throw new GeoConversionError(
                        `Conversion not implemented for geometry type ${feature.geometry.type}`,
                        'GeoJsonFeature',
                        'unknown'
                    );
            }

        } catch (error) {
            if (error instanceof GeoConversionError) {
                throw error;
            }
            throw new GeoConversionError(
                'Error during conversion',
                'GeoJsonFeature',
                'unknown',
                error as Error
            );
        }
    }
}