@echo off
REM Create new directory structure
mkdir src\core\models
mkdir src\core\coordinate
mkdir src\core\errors
mkdir src\adapters\geojson
mkdir src\utils\math
mkdir src\utils\conversion
mkdir test\core\models
mkdir test\core\coordinate
mkdir test\adapters\geojson
mkdir test\utils\helpers
mkdir test\fixtures
mkdir docs
mkdir examples
mkdir scripts
mkdir benchmarks

REM Move model files
move src\models\*.* src\core\models\
rmdir src\models

REM Move coordinate system files
move src\CoordinateSystem.ts src\core\coordinate\

REM Move error files
move src\errors\*.* src\core\errors\
rmdir src\errors

REM Move geojson files
move src\geojson\*.* src\adapters\geojson\
rmdir src\geojson

REM Move test files
move test\Arc.test.ts test\core\models\
move test\GreatCircle.test.ts test\core\models\
move test\helpers\*.* test\utils\helpers\
rmdir test\helpers

REM Create placeholder documentation files
echo # API Documentation > docs\README.md
echo # Usage Examples > examples\README.md
echo # Build Scripts > scripts\README.md
echo # Performance Benchmarks > benchmarks\README.md

REM Update main index file
echo // Main entry point for the spherical geometry library > src\index.ts
echo export * from './core/models'; >> src\index.ts
echo export * from './core/coordinate'; >> src\index.ts
echo export * from './core/errors'; >> src\index.ts
echo export * from './adapters/geojson'; >> src\index.ts

echo Directory structure reorganized successfully!
pause