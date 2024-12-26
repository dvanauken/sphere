# Navigate to the geojson directory
Set-Location -Path "src\adapters\geojson"

# Move and rename files
Move-Item -Path "Point.ts" -Destination "types\GeoJsonPoint.ts" -Force
Move-Item -Path "LineString.ts" -Destination "types\GeoJsonLineString.ts" -Force
Move-Item -Path "Polygon.ts" -Destination "types\GeoJsonPolygon.ts" -Force
Move-Item -Path "MultiPoint.ts" -Destination "types\GeoJsonMultiPoint.ts" -Force
Move-Item -Path "MultiLineString.ts" -Destination "types\GeoJsonMultiLineString.ts" -Force
Move-Item -Path "MultiPolygon.ts" -Destination "types\GeoJsonMultiPolygon.ts" -Force
Move-Item -Path "Feature.ts" -Destination "types\GeoJsonFeature.ts" -Force
Move-Item -Path "FeatureCollection.ts" -Destination "types\GeoJsonFeatureCollection.ts" -Force
Move-Item -Path "GeometryCollection.ts" -Destination "types\GeoJsonGeometryCollection.ts" -Force

# Update imports in type files
$content = Get-Content "types\GeoJsonFeature.ts"
$content = $content -replace 'import \{ GeometryCollection \} from "./GeometryCollection.js";', 'import { GeoJsonGeometryCollection } from "./GeoJsonGeometryCollection.js";'
$content = $content -replace 'import \{ LineString \} from "./LineString.js";', 'import { GeoJsonLineString } from "./GeoJsonLineString.js";'
$content = $content -replace 'import \{ MultiLineString \} from "./MultiLineString.js";', 'import { GeoJsonMultiLineString } from "./GeoJsonMultiLineString.js";'
$content = $content -replace 'import \{ MultiPoint \} from "./MultiPoint.js";', 'import { GeoJsonMultiPoint } from "./GeoJsonMultiPoint.js";'
$content = $content -replace 'import \{ MultiPolygon \} from "./MultiPolygon.js";', 'import { GeoJsonMultiPolygon } from "./GeoJsonMultiPolygon.js";'
$content = $content -replace 'import \{ Point \} from "./Point.js";', 'import { GeoJsonPoint } from "./GeoJsonPoint.js";'
$content = $content -replace 'import \{ Polygon \} from "./Polygon.js";', 'import { GeoJsonPolygon } from "./GeoJsonPolygon.js";'
$content | Set-Content "types\GeoJsonFeature.ts"

# Create index.ts in types directory
$indexContent = @"
// Export all GeoJSON types
export * from './GeoJsonPoint.js';
export * from './GeoJsonLineString.js';
export * from './GeoJsonPolygon.js';
export * from './GeoJsonMultiPoint.js';
export * from './GeoJsonMultiLineString.js';
export * from './GeoJsonMultiPolygon.js';
export * from './GeoJsonFeature.js';
export * from './GeoJsonFeatureCollection.js';
export * from './GeoJsonGeometryCollection.js';
"@
$indexContent | Set-Content "types\index.ts"

# Update imports in other directories
$directories = @("converters", "readers", "writers", "errors")
foreach ($dir in $directories) {
    Get-ChildItem -Path $dir -Filter "*.ts" | ForEach-Object {
        $content = Get-Content $_.FullName
        $content = $content -replace 'import \{ Feature \} from "./Feature.js";', 'import { GeoJsonFeature } from "../types/GeoJsonFeature.js";'
        $content | Set-Content $_.FullName
    }
}

Write-Host "Files have been moved and imports updated."