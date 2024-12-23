export class GeoReader {
  static read(feature: Feature): any {
      return GeoRegistry.reverse(feature);
  }

  static readCollection(collection: Feature[]): any[] {
      return collection.map(f => GeoReader.read(f));
  }
}

