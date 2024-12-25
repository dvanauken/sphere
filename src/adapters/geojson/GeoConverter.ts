import { Feature } from "./Feature.js";
import { GeoReader } from "./GeoReader.js";
import { GeoWriter } from "./GeoWriter.js";

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

/* Example usage:
const feature = GeoConverter.toGeoJSON(greatCircle);
const circle = GeoConverter.fromGeoJSON(feature);
*/