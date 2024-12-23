import { Coordinate } from '../models/Coordinate';
import { Point } from '../models/Point';
import { GreatCircle } from '../models/GreatCircle';
import { SmallCircle } from '../models/SmallCircle';
import { Feature, Point as FeaturePoint, LineString, Polygon } from './Feature';

export class TypeConverter {
    static toFeature(source: any): Feature {
        const type = TypeMapping.get(source.constructor);
        if (!type) throw new Error(`No mapping for type ${source.constructor.name}`);

        switch(type) {
            case FeaturePoint:
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [source.longitude, source.latitude]
                    },
                    properties: {}
                };
            // Add other conversions
            default:
                throw new Error(`Conversion not implemented for ${type}`);
        }
    }

    static fromFeature(feature: Feature): any {
        // Reverse conversions
    }
}