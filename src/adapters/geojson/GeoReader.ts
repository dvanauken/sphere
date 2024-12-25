import { Feature } from "./Feature.js";
import { GeoRegistry } from "./GeoRegistry.js";

export class GeoReader {
  static read(feature: Feature): any {
      return GeoRegistry.reverse(feature);
  }

  static readCollection(collection: Feature[]): any[] {
      return collection.map(f => GeoReader.read(f));
  }
}

