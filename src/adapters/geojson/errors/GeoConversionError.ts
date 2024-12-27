import { GeoJsonFeature } from "../types/GeoJsonFeature.js";

export class GeoConversionError extends Error {
  constructor(
    message: string,
    public readonly sourceType?: string,
    public readonly targetType?: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'GeoConversionError';
  }
}

export class TypeValidator {
  static validateFeature(feature: GeoJsonFeature): void {
    if (!feature.type || feature.type !== 'Feature') {
      throw new GeoConversionError('Invalid Feature type');
    }
    if (!feature.geometry) {
      throw new GeoConversionError('Missing geometry');
    }
  }

  static validateGeometry(geometry: any): void {
    // Geometry validation
  }
}