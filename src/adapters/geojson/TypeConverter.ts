import { Coordinate } from "../../core/models/Coordinate.js";
import { Distance } from "../../core/models/Distance.js";
import { GreatCircle } from "../../core/models/GreatCircle.js";
import { SmallCircle } from "../../core/models/SmallCircle.js";
import { Triangle } from "../../core/models/Triangle.js";
import { Feature } from "./Feature.js";
import { TypeMapping } from "./TypeMapping.js";


export class TypeConverter {
    static toFeature(source: any): Feature {
        const type = TypeMapping.get(source.constructor);
        if (!type) {
            throw new Error(`No mapping for type ${source.constructor.name}`);
        }

        try {
            switch(type.type) {
                case "Point":
                    if (source instanceof Coordinate) {
                        return {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [source.longitude, source.latitude]
                            },
                            properties: {}
                        };
                    }
                    return {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [0, 0] // Default return
                        },
                        properties: {}
                    };

                case "LineString":
                    if (source instanceof GreatCircle) {
                        const points = source.generatePoints({ minPoints: 100 });
                        return {
                            type: "Feature",
                            geometry: {
                                type: "LineString",
                                coordinates: points.map((p: Coordinate) => [p.longitude, p.latitude])
                            },
                            properties: {
                                distance: source.distance().inMeters()
                            }
                        };
                    }
                    return {
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: []
                        },
                        properties: {}
                    };

                case "Polygon":
                    if (source instanceof SmallCircle) {
                        const points = source.generatePoints(100);
                        points.push(points[0]);
                        return {
                            type: "Feature",
                            geometry: {
                                type: "Polygon",
                                coordinates: [points.map((p: Coordinate) => [p.longitude, p.latitude])]
                            },
                            properties: {
                                radius: source.getRadius().inMeters(),
                                area: source.area()
                            }
                        };
                    }
                    if (source instanceof Triangle) {
                        const vertices = source.vertices;
                        const allVertices = [...vertices, vertices[0]];
                        return {
                            type: "Feature",
                            geometry: {
                                type: "Polygon",
                                coordinates: [allVertices.map((v: Coordinate) => [v.longitude, v.latitude])]
                            },
                            properties: {
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
                        },
                        properties: {}
                    };
            }

            throw new Error(`Conversion not implemented for ${type.type}`);
        } catch (exception: any) {
            console.log('Conversion error:', exception);
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [0, 0]
                },
                properties: {}
            };
        }
    }

    static fromFeature(feature: Feature): any {
        if (!feature.geometry) {
            throw new Error('Invalid Feature: missing geometry');
        }

        try {
            switch(feature.geometry.type) {
                case "Point":
                    const [lon, lat] = feature.geometry.coordinates;
                    return Coordinate.at(lat, lon);

                case "LineString":
                    const coords = feature.geometry.coordinates;
                    if (coords.length < 2) {
                        throw new Error('Invalid LineString: needs at least 2 points');
                    }
                    const startCoord = Coordinate.at(coords[0][1], coords[0][0]);
                    const endCoord = Coordinate.at(coords[coords.length - 1][1], coords[coords.length - 1][0]);
                    return GreatCircle.from(startCoord).to(endCoord);

                case "Polygon":
                    const vertices = feature.geometry.coordinates[0];
                    if (vertices.length === 4 && feature.properties?.area) {
                        const points = vertices.slice(0, -1).map(([lon, lat]) => Coordinate.at(lat, lon));
                        return Triangle.from(points[0]).to(points[1]).and(points[2]);
                    } else if (feature.properties?.radius) {
                        const center = Coordinate.at(vertices[0][1], vertices[0][0]);
                        const radius = new Distance(feature.properties.radius.inMeters());
                        return SmallCircle.withCenter(center).radius(radius);
                    }
                    throw new Error('Unsupported Polygon type');
            }

            throw new Error(`Conversion not implemented for geometry type ${feature.geometry.type}`);
        } catch (exception: any) {
            console.log('Conversion error:', exception);
            return null;
        }
    }
}