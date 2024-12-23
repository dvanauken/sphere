import { Coordinate } from '../models/Coordinate';
import { Point } from '../models/Point';
import { GreatCircle } from '../models/GreatCircle';
import { SmallCircle } from '../models/SmallCircle';
import { Triangle } from '../models/Triangle';
import { Point as GeoJSONPoint } from './Point';
import { LineString } from './LineString';
import { Polygon } from './Polygon';
import { MultiPoint } from './MultiPoint';
import { MultiLineString } from './MultiLineString';
import { MultiPolygon } from './MultiPolygon';

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