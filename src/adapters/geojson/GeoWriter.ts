import { Feature } from "./Feature";
import { GeoRegistry } from "./GeoRegistry";

export class GeoWriter {
  static write(source: any): Feature {
      return GeoRegistry.convert(source, 'Feature');
  }

  static writeCollection(sources: any[]): Feature[] {
      return sources.map(s => GeoWriter.write(s));
  }
}