import { ICoordinate } from "./ICoordinate";

// IArc.ts
export interface IArc {
  start: ICoordinate;
  end: ICoordinate;
  calculateLength(): number;
}

