import { ICoordinate } from "./ICoordinate";

// ITriangle.ts
export interface ITriangle {
  vertices: ICoordinate[];
  calculateArea(): number;
  calculatePerimeter(): number;
}
