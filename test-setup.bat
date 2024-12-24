@echo off
REM Create test directory structure mirroring src structure

REM Create core directories
mkdir test\core\models
mkdir test\core\coordinate
mkdir test\core\errors

REM Create adapter directories
mkdir test\adapters\geojson

REM Create utils directories
mkdir test\utils\math
mkdir test\utils\conversion

REM Create test utilities directory (test-specific)
mkdir test\__fixtures__
mkdir test\__helpers__

REM Create model test files (matching src files)
echo // Angle test file > test\core\models\Angle.test.ts
echo // Arc test file > test\core\models\Arc.test.ts
echo // Azimuth test file > test\core\models\Azimuth.test.ts
echo // Bearing test file > test\core\models\Bearing.test.ts
echo // Coordinate test file > test\core\models\Coordinate.test.ts
echo // Distance test file > test\core\models\Distance.test.ts
echo // GreatCircle test file > test\core\models\GreatCircle.test.ts
echo // Point test file > test\core\models\Point.test.ts
echo // Polygon test file > test\core\models\Polygon.test.ts
echo // SmallCircle test file > test\core\models\SmallCircle.test.ts
echo // Sphere test file > test\core\models\Sphere.test.ts
echo // SphericalTrigonometry test file > test\core\models\SphericalTrigonometry.test.ts
echo // Triangle test file > test\core\models\Triangle.test.ts

REM Create coordinate system test file
echo // CoordinateSystem test file > test\core\coordinate\CoordinateSystem.test.ts

REM Create error test files
echo // GeoError test file > test\core\errors\GeoError.test.ts
echo // GeoConversionError test file > test\core\errors\GeoConversionError.test.ts
echo // GeoValidationError test file > test\core\errors\GeoValidationError.test.ts

REM Create GeoJSON adapter test files
echo // Feature test file > test\adapters\geojson\Feature.test.ts
echo // FeatureCollection test file > test\adapters\geojson\FeatureCollection.test.ts
echo // GeoConverter test file > test\adapters\geojson\GeoConverter.test.ts
echo // GeoReader test file > test\adapters\geojson\GeoReader.test.ts
echo // GeoRegistry test file > test\adapters\geojson\GeoRegistry.test.ts
echo // GeoWriter test file > test\adapters\geojson\GeoWriter.test.ts
echo // GeometryCollection test file > test\adapters\geojson\GeometryCollection.test.ts
echo // LineString test file > test\adapters\geojson\LineString.test.ts
echo // MultiLineString test file > test\adapters\geojson\MultiLineString.test.ts
echo // MultiPoint test file > test\adapters\geojson\MultiPoint.test.ts
echo // MultiPolygon test file > test\adapters\geojson\MultiPolygon.test.ts
echo // Point test file > test\adapters\geojson\Point.test.ts
echo // Polygon test file > test\adapters\geojson\Polygon.test.ts
echo // TypeConverter test file > test\adapters\geojson\TypeConverter.test.ts
echo // TypeMapping test file > test\adapters\geojson\TypeMapping.test.ts

REM Create test utilities
echo // Common test coordinates > test\__fixtures__\coordinates.ts
echo // Pre-calculated distances > test\__fixtures__\distances.ts
echo // Common angles > test\__fixtures__\angles.ts
echo // Custom assertions > test\__helpers__\assertions.ts
echo // Test generators > test\__helpers__\generators.ts
echo // Test constants > test\__helpers__\constants.ts

echo Test directory structure created successfully!
echo Each test file has been created as an empty file with a comment header.
pause