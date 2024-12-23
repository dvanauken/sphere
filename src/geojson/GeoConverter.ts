export class GeoConverter {
  static toGeoJSON(input: any): Feature | Feature[] {
      if (Array.isArray(input)) {
          return GeoWriter.writeCollection(input);
      }
      return GeoWriter.write(input);
  }

  static fromGeoJSON(input: Feature | Feature[]): any {
      if (Array.isArray(input)) {
          return GeoReader.readCollection(input);
      }
      return GeoReader.read(input);
  }
}

// Convert to GeoJSON
const feature = GeoConverter.toGeoJSON(myGreatCircle);

// Convert from GeoJSON
const circle = GeoConverter.fromGeoJSON(feature);