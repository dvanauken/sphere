import { 
  GeoJsonFeature,
  GeoJsonFeatureCollection
} from "../types/index.js";
import { GeoConversionError } from "../errors/GeoConversionError.js";
import { GeoRegistry } from "../readers/GeoRegistry.js";
import { Coordinate } from "../../../core/models/Coordinate.js";
import { GreatCircle } from "../../../core/models/GreatCircle.js";
import { SmallCircle } from "../../../core/models/SmallCircle.js";
import { Triangle } from "../../../core/models/Triangle.js";

export class GeoWriter {
  static write(
      source: Coordinate | GreatCircle | SmallCircle | Triangle
  ): GeoJsonFeature {
      if (!source) {
          throw new GeoConversionError(
              'Invalid source object',
              'unknown',
              'GeoJSON'
          );
      }

      try {
          return GeoRegistry.convert(source, 'Feature');
      } catch (error) {
          throw new GeoConversionError(
              'Failed to write GeoJSON feature',
              source.constructor.name,
              'GeoJSON',
              error as Error
          );
      }
  }

  static writeCollection(
      sources: Array<Coordinate | GreatCircle | SmallCircle | Triangle>
  ): GeoJsonFeature[] {
      if (!Array.isArray(sources)) {
          throw new GeoConversionError(
              'Invalid source: expected array of geometry objects',
              'unknown',
              'GeoJSON'
          );
      }

      try {
          return sources.map((source, index) => {
              try {
                  return GeoWriter.write(source);
              } catch (error) {
                  throw new GeoConversionError(
                      `Failed to write feature at index ${index}`,
                      source?.constructor?.name ?? 'unknown',
                      'GeoJSON',
                      error as Error
                  );
              }
          });
      } catch (error) {
          throw new GeoConversionError(
              'Failed to write feature collection',
              'unknown',
              'GeoJSON',
              error as Error
          );
      }
  }
}