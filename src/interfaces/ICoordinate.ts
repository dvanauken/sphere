// Interface for Coordinate. 
// ICoordinate.ts
export interface ICoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
  toRadians(): { latRadians: number, lonRadians: number };
  toString(): string;
}

