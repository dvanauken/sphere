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

// Add validation and error handling to existing classes:
export class TypeValidator {
  static validateFeature(feature: Feature): void {
      if (!feature.type || feature.type !== 'Feature') {
          throw new GeoConversionError('Invalid Feature type');
      }
      if (!feature.geometry) {
          throw new GeoConversionError('Missing geometry');
      }
      // Add more validation
  }

  static validateGeometry(geometry: any): void {
      // Geometry validation
  }
}