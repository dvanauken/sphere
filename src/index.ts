// Main entry point for the spherical geometry library

// Export core models
export * from './core/models/Angle';
export * from './core/models/Arc';
export * from './core/models/Azimuth';
export * from './core/models/Bearing';
export * from './core/models/Coordinate';
export * from './core/models/Distance';
export * from './core/models/GreatCircle';
export * from './core/models/Point';
export * from './core/models/Polygon';
export * from './core/models/SmallCircle';
export * from './core/models/Sphere';
export * from './core/models/SphericalTrigonometry';
export * from './core/models/Triangle';

// Export coordinate system utilities
export * from './core/coordinate/CoordinateSystem';

// Export error types
export * from './core/errors/GeoError';
export * from './core/errors/GeoConversionError';
export * from './core/errors/GeoValidationError';

// Export GeoJSON adapters
export * from './adapters/geojson/Feature';
export * from './adapters/geojson/FeatureCollection';
export * from './adapters/geojson/GeoConverter';
export * from './adapters/geojson/TypeConverter';
export * from './adapters/geojson/TypeMapping';