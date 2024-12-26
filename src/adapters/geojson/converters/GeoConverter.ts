import { 
    GeoJsonFeature, 
    GeoJsonFeatureCollection 
} from "../types/index.js";
import { GeoReader } from "./GeoReader.js";
import { GeoWriter } from "./GeoWriter.js";
import { GeoConversionError } from "../errors/GeoConversionError.js";
import { 
    Coordinate, 
    GreatCircle, 
    SmallCircle, 
    Triangle 
} from "../../../index.js";

/**
 * Converts between spherical geometry objects and GeoJSON
 */
export class GeoConverter {
    /**
     * Converts a spherical geometry object or array of objects to GeoJSON
     * 
     * @param input Single geometry object or array of objects
     * @returns GeoJSON Feature or FeatureCollection
     * @throws GeoConversionError if conversion fails
     */
    static toGeoJSON(
        input: Coordinate | GreatCircle | SmallCircle | Triangle | Array<Coordinate | GreatCircle | SmallCircle | Triangle>
    ): GeoJsonFeature | GeoJsonFeatureCollection {
        try {
            if (Array.isArray(input)) {
                return {
                    type: "FeatureCollection",
                    features: GeoWriter.writeCollection(input)
                };
            }
            return GeoWriter.write(input);
        } catch (error) {
            if (error instanceof GeoConversionError) {
                throw error;
            }
            throw new GeoConversionError(
                'Failed to convert to GeoJSON',
                input?.constructor?.name ?? 'unknown',
                'GeoJSON',
                error as Error
            );
        }
    }

    /**
     * Converts a GeoJSON Feature or FeatureCollection to spherical geometry objects
     * 
     * @param input GeoJSON Feature or FeatureCollection
     * @returns Single geometry object or array of objects
     * @throws GeoConversionError if conversion fails
     */
    static fromGeoJSON(
        input: GeoJsonFeature | GeoJsonFeatureCollection
    ): Coordinate | GreatCircle | SmallCircle | Triangle | Array<Coordinate | GreatCircle | SmallCircle | Triangle> {
        try {
            // Validate input
            if (!input || typeof input !== 'object') {
                throw new GeoConversionError(
                    'Invalid GeoJSON input',
                    'unknown',
                    'spherical geometry'
                );
            }

            // Handle FeatureCollection
            if (input.type === 'FeatureCollection') {
                if (!Array.isArray(input.features)) {
                    throw new GeoConversionError(
                        'Invalid FeatureCollection: features must be an array',
                        'GeoJSON',
                        'spherical geometry'
                    );
                }
                return GeoReader.readCollection(input.features);
            }

            // Handle single Feature
            if (input.type === 'Feature') {
                return GeoReader.read(input);
            }

            throw new GeoConversionError(
                'Invalid GeoJSON: must be Feature or FeatureCollection',
                'unknown',
                'spherical geometry'
            );

        } catch (error) {
            if (error instanceof GeoConversionError) {
                throw error;
            }
            throw new GeoConversionError(
                'Failed to convert from GeoJSON',
                'GeoJSON',
                'spherical geometry',
                error as Error
            );
        }
    }

    /**
     * Validates if an object is a valid GeoJSON Feature
     */
    static isValidFeature(obj: any): obj is GeoJsonFeature {
        return (
            obj &&
            typeof obj === 'object' &&
            obj.type === 'Feature' &&
            obj.geometry &&
            typeof obj.geometry === 'object' &&
            typeof obj.geometry.type === 'string' &&
            Array.isArray(obj.geometry.coordinates) &&
            obj.properties &&
            typeof obj.properties === 'object'
        );
    }

    /**
     * Validates if an object is a valid GeoJSON FeatureCollection
     */
    static isValidFeatureCollection(obj: any): obj is GeoJsonFeatureCollection {
        return (
            obj &&
            typeof obj === 'object' &&
            obj.type === 'FeatureCollection' &&
            Array.isArray(obj.features) &&
            obj.features.every((feature: any) => GeoConverter.isValidFeature(feature))
        );
    }
}

/* Example usage:
import { GreatCircle, Coordinate } from '../core/models';

const startPoint = new Coordinate(51.5074, -0.1278);  // London
const endPoint = new Coordinate(48.8566, 2.3522);     // Paris
const greatCircle = GreatCircle.from(startPoint).to(endPoint);

// Convert to GeoJSON
const feature = GeoConverter.toGeoJSON(greatCircle);

// Convert back to spherical geometry
const circle = GeoConverter.fromGeoJSON(feature);

// Convert multiple objects
const features = GeoConverter.toGeoJSON([startPoint, greatCircle]);
const geometries = GeoConverter.fromGeoJSON(features);
*/