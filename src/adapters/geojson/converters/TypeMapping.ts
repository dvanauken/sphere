import { Arc } from "../../../core/models/Arc.js";
import { Point } from "../../../core/models/Point.js";
import { Polygon } from "../../../core/models/Polygon.js";

export interface GeoType {
    type: string;
    coordinates: number[] | number[][] | number[][][] | number[][][][];
}

type InternalType = typeof Point | typeof Arc | typeof Polygon | typeof Array;
type GeoJSONType = "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon";

export class TypeMapping {
    private static readonly internalToGeoMap = new Map<InternalType, GeoJSONType>([
        [Point, "Point"],
        [Array, "MultiPoint"],
        [Arc, "LineString"],
        [Array, "MultiLineString"],
        [Polygon, "Polygon"],
        [Array, "MultiPolygon"]
    ]);

    private static readonly geoToInternalMap = new Map<GeoJSONType, InternalType>([
        ["Point", Point],
        ["MultiPoint", Array],
        ["LineString", Arc],
        ["MultiLineString", Array],
        ["Polygon", Polygon],
        ["MultiPolygon", Array]
    ]);

    static getGeoType(internalType: any): GeoJSONType | undefined {
        if (Array.isArray(internalType)) {
            const firstElement = internalType[0];
            if (firstElement instanceof Point) return "MultiPoint";
            if (firstElement instanceof Arc) return "MultiLineString";
            if (firstElement instanceof Polygon) return "MultiPolygon";
            return undefined;
        }
        return TypeMapping.internalToGeoMap.get(internalType.constructor);
    }

    static getInternalType(geoType: GeoJSONType): InternalType | undefined {
        return TypeMapping.geoToInternalMap.get(geoType);
    }

    static hasInternalMapping(type: any): boolean {
        if (Array.isArray(type)) {
            const firstElement = type[0];
            return firstElement instanceof Point || 
                   firstElement instanceof Arc || 
                   firstElement instanceof Polygon;
        }
        return TypeMapping.internalToGeoMap.has(type.constructor);
    }

    static hasGeoMapping(type: GeoJSONType): boolean {
        return TypeMapping.geoToInternalMap.has(type);
    }

    static getAllMappings(): Map<InternalType, GeoJSONType> {
        return new Map(TypeMapping.internalToGeoMap);
    }

    static getAllGeoTypes(): GeoJSONType[] {
        return Array.from(TypeMapping.geoToInternalMap.keys());
    }

    static getAllSourceTypes(): InternalType[] {
        return Array.from(TypeMapping.internalToGeoMap.keys());
    }

    static getSourceTypeForGeoType(geoType: GeoJSONType): InternalType[] {
        const sourceType = TypeMapping.geoToInternalMap.get(geoType);
        return sourceType ? [sourceType] : [];
    }

    static registerMapping(internalType: InternalType, geoType: GeoJSONType): void {
        const validTypes: GeoJSONType[] = [
            "Point",
            "MultiPoint",
            "LineString",
            "MultiLineString",
            "Polygon",
            "MultiPolygon"
        ];

        if (!validTypes.includes(geoType)) {
            throw new Error(`Invalid GeoJSON type: ${geoType}. Must be one of: ${validTypes.join(', ')}`);
        }

        TypeMapping.internalToGeoMap.set(internalType, geoType);
        TypeMapping.geoToInternalMap.set(geoType, internalType);
    }

    static validateCoordinates(type: GeoJSONType, coords: any): boolean {
        switch (type) {
            case "Point":
                return Array.isArray(coords) && coords.length === 2 && 
                       coords.every(c => typeof c === 'number');
            
            case "MultiPoint":
            case "LineString":
                return Array.isArray(coords) && coords.length > 0 &&
                       coords.every(p => Array.isArray(p) && p.length === 2 && 
                                      p.every(c => typeof c === 'number'));
            
            case "MultiLineString":
            case "Polygon":
                return Array.isArray(coords) && coords.length > 0 &&
                       coords.every(line => Array.isArray(line) && line.length > 0 &&
                                         line.every(p => Array.isArray(p) && p.length === 2 &&
                                                      p.every(c => typeof c === 'number')));
            
            case "MultiPolygon":
                return Array.isArray(coords) && coords.length > 0 &&
                       coords.every(poly => Array.isArray(poly) && poly.length > 0 &&
                                         poly.every(line => Array.isArray(line) && line.length > 0 &&
                                                         line.every(p => Array.isArray(p) && p.length === 2 &&
                                                                      p.every(c => typeof c === 'number'))));
            
            default:
                return false;
        }
    }
}