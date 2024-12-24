import { Coordinate } from "../../core/models/Coordinate";
import { GreatCircle } from "../../core/models/GreatCircle";
import { Point } from "../../core/models/Point";
import { SmallCircle } from "../../core/models/SmallCircle";
import { Triangle } from "../../core/models/Triangle";

export interface GeoType {
    type: string;
    coordinates: any;
}

export class TypeMapping {
    private static readonly map = new Map<any, GeoType>([
        [Coordinate, { type: "Point", coordinates: [] }],
        [Point, { type: "Point", coordinates: [] }],
        [GreatCircle, { type: "LineString", coordinates: [] }],
        [SmallCircle, { type: "Polygon", coordinates: [] }],
        [Triangle, { type: "Polygon", coordinates: [] }]
    ]);

    static get(type: any): GeoType | null {
        const mapping = TypeMapping.map.get(type);
        if (!mapping) {
            return null;
        }
        return { ...mapping }; // Return a copy to prevent modification
    }

    static set(sourceType: any, geoType: GeoType): void {
        TypeMapping.map.set(sourceType, { ...geoType }); // Store a copy
    }

    static hasMapping(type: any): boolean {
        return TypeMapping.map.has(type);
    }

    static getAllMappings(): Map<any, GeoType> {
        return new Map(TypeMapping.map); // Return a copy
    }

    static getSourceTypeForGeoType(geoType: string): any[] {
        const results: any[] = [];
        TypeMapping.map.forEach((value, key) => {
            if (value.type === geoType) {
                results.push(key);
            }
        });
        return results;
    }

    static registerMapping(sourceType: any, geoType: GeoType): void {
        if (!geoType.type || !["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"].includes(geoType.type)) {
            throw new Error(`Invalid GeoJSON type: ${geoType.type}`);
        }
        TypeMapping.set(sourceType, geoType);
    }
}