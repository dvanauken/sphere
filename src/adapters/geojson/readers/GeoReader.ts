import { 
  GeoJsonFeature,
  GeoJsonPoint,
  GeoJsonLineString,
  GeoJsonPolygon
} from "../types/index.js";
import { GeoRegistry } from "./GeoRegistry.js";
import { GeoConversionError } from "../errors/GeoConversionError.js";
import { 
  Coordinate, 
  GreatCircle, 
  SmallCircle, 
  Triangle 
} from "../../../index.js";

export class GeoReader {
  /**
   * Reads a GeoJSON Feature and converts it to a spherical geometry object
   */
  static read(feature: GeoJsonFeature): Coordinate | GreatCircle | SmallCircle | Triangle {
      if (!feature || !feature.geometry) {
          throw new GeoConversionError(
              'Invalid Feature: missing geometry',
              'GeoJSON',
              'spherical geometry'
          );
      }

      try {
          return GeoRegistry.reverse(feature);
      } catch (error) {
          if (error instanceof GeoConversionError) {
              throw error;
          }
          throw new GeoConversionError(
              'Failed to read GeoJSON feature',
              'GeoJSON',
              'spherical geometry',
              error as Error
          );
      }
  }

  /**
   * Reads an array of GeoJSON Features and converts them to spherical geometry objects
   */
  static readCollection(
      collection: GeoJsonFeature[]
  ): Array<Coordinate | GreatCircle | SmallCircle | Triangle> {
      if (!Array.isArray(collection)) {
          throw new GeoConversionError(
              'Invalid collection: expected array of features',
              'GeoJSON',
              'spherical geometry'
          );
      }

      try {
          return collection.map((feature, index) => {
              try {
                  return GeoReader.read(feature);
              } catch (error) {
                  // Enhance error with feature index
                  throw new GeoConversionError(
                      `Failed to read feature at index ${index}`,
                      'GeoJSON',
                      'spherical geometry',
                      error as Error
                  );
              }
          });
      } catch (error) {
          if (error instanceof GeoConversionError) {
              throw error;
          }
          throw new GeoConversionError(
              'Failed to read feature collection',
              'GeoJSON',
              'spherical geometry',
              error as Error
          );
      }
  }

  /**
   * Type guard to check if a geometry is a Point
   */
  private static isPoint(
      geometry: GeoJsonFeature['geometry']
  ): geometry is GeoJsonPoint {
      return geometry.type === 'Point';
  }

  /**
   * Type guard to check if a geometry is a LineString
   */
  private static isLineString(
      geometry: GeoJsonFeature['geometry']
  ): geometry is GeoJsonLineString {
      return geometry.type === 'LineString';
  }

  /**
   * Type guard to check if a geometry is a Polygon
   */
  private static isPolygon(
      geometry: GeoJsonFeature['geometry']
  ): geometry is GeoJsonPolygon {
      return geometry.type === 'Polygon';
  }
}