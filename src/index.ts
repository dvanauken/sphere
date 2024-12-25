// Main entry point for the spherical geometry library

// Export core models
export * from './core/models/Angle.js';
export * from './core/models/Arc.js';
export * from './core/models/Azimuth.js';
export * from './core/models/Bearing.js';
export * from './core/models/Coordinate.js';
export * from './core/models/Distance.js';
export * from './core/models/GreatCircle.js';
export * from './core/models/Point.js';
export * from './core/models/Polygon.js';
export * from './core/models/SmallCircle.js';
export * from './core/models/Sphere.js';
export * from './core/models/SphericalTrigonometry.js';
export * from './core/models/Triangle.js';

// Export coordinate system utilities
export * from './core/coordinate/CoordinateSystem.js';

// Export error types
export * from './core/errors/GeoError.js';
export * from './core/errors/GeoConversionError.js';
export * from './core/errors/GeoValidationError.js';

// Export GeoJSON adapters
export * from './adapters/geojson/Feature.js';
export * from './adapters/geojson/FeatureCollection.js';
export * from './adapters/geojson/GeoConverter.js';
export * from './adapters/geojson/TypeConverter.js';
export * from './adapters/geojson/TypeMapping.js';