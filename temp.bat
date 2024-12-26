@echo off
setlocal enabledelayedexpansion

REM Create main directory structure
mkdir src\adapters\geojson\types 2>nul
mkdir src\adapters\geojson\converters 2>nul
mkdir src\adapters\geojson\errors 2>nul
mkdir src\adapters\geojson\readers 2>nul
mkdir src\adapters\geojson\writers 2>nul
mkdir src\adapters\geojson\utils 2>nul

REM Move existing files to their new locations
REM Converters
move /Y "src\adapters\geojson\GeoConverter.ts" "src\adapters\geojson\converters\GeoConverter.ts" 2>nul
move /Y "src\adapters\geojson\TypeConverter.ts" "src\adapters\geojson\converters\TypeConverter.ts" 2>nul
move /Y "src\adapters\geojson\TypeMapping.ts" "src\adapters\geojson\converters\TypeMapping.ts" 2>nul

REM Readers
move /Y "src\adapters\geojson\GeoReader.ts" "src\adapters\geojson\readers\GeoReader.ts" 2>nul
move /Y "src\adapters\geojson\GeoRegistry.ts" "src\adapters\geojson\readers\GeoRegistry.ts" 2>nul

REM Writers
move /Y "src\adapters\geojson\GeoWriter.ts" "src\adapters\geojson\writers\GeoWriter.ts" 2>nul

REM Errors
move /Y "src\adapters\geojson\GeoConversionError.ts" "src\adapters\geojson\errors\GeoConversionError.ts" 2>nul

REM Create base type files if they don't exist
echo // GeoJsonPoint.ts > "src\adapters\geojson\types\GeoJsonPoint.ts"
echo // GeoJsonLineString.ts > "src\adapters\geojson\types\GeoJsonLineString.ts"
echo // GeoJsonPolygon.ts > "src\adapters\geojson\types\GeoJsonPolygon.ts"
echo // GeoJsonMultiPoint.ts > "src\adapters\geojson\types\GeoJsonMultiPoint.ts"
echo // GeoJsonMultiLineString.ts > "src\adapters\geojson\types\GeoJsonMultiLineString.ts"
echo // GeoJsonMultiPolygon.ts > "src\adapters\geojson\types\GeoJsonMultiPolygon.ts"
echo // GeoJsonFeature.ts > "src\adapters\geojson\types\GeoJsonFeature.ts"
echo // GeoJsonFeatureCollection.ts > "src\adapters\geojson\types\GeoJsonFeatureCollection.ts"

REM Create index files for each directory
echo // Types index.ts > "src\adapters\geojson\types\index.ts"
echo // Converters index.ts > "src\adapters\geojson\converters\index.ts"
echo // Errors index.ts > "src\adapters\geojson\errors\index.ts"
echo // Readers index.ts > "src\adapters\geojson\readers\index.ts"
echo // Writers index.ts > "src\adapters\geojson\writers\index.ts"
echo // Utils index.ts > "src\adapters\geojson\utils\index.ts"

REM Create main index.ts if it doesn't exist
echo // Main GeoJSON adapter index.ts > "src\adapters\geojson\index.ts"

REM Create TypeValidator if it doesn't exist
echo // TypeValidator.ts > "src\adapters\geojson\utils\TypeValidator.ts"

echo GeoJSON folder structure and files have been set up successfully.
pause