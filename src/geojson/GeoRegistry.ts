export class GeoRegistry {
  private static readonly converters = new Map<string, TypeConverter>();

  static register(type: any, converter: TypeConverter): void {
      const geoType = TypeMapping.get(type);
      if (!geoType) throw new Error(`No mapping for type ${type.name}`);
      GeoRegistry.converters.set(type.name, converter);
  }

  static convert(source: any, target: string): any {
      const converter = GeoRegistry.converters.get(source.constructor.name);
      if (!converter) throw new Error(`No converter for ${source.constructor.name}`);
      return converter.toFeature(source);
  }

  static reverse(feature: Feature): any {
      // Convert from Feature back to our types
  }
}