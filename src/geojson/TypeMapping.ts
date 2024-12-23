import { Coordinate } from '../models/Coordinate';
import { Point } from '../models/Point';
import { GreatCircle } from '../models/GreatCircle';
import { SmallCircle } from '../models/SmallCircle';
import { Triangle } from '../models/Triangle';

export class TypeMapping {
    private static readonly map = new Map([
        // [Coordinate, FeaturePoint],
        // [Point, FeaturePoint],
        // [GreatCircle, LineString],
        // [SmallCircle, Polygon],
        // [Triangle, Polygon],
        // // Collections to be implemented
        // ['GeoPolyCollection', null],
        // ['GeoPointCollection', null],
        // ['Route', null],
        // ['Waypoints', null]
    ]);

    static get(type: any): any | null {
        return TypeMapping.map.get(type) ?? null;
    }
}