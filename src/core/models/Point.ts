import { Coordinate } from "./Coordinate";

export class Point {
   private constructor(
       private readonly x: number,
       private readonly y: number,
       private readonly z?: number
   ) {}

   static at = (x: number, y: number, z?: number) =>
       new Point(x, y, z);

   get X(): number {
       return this.x;
   }

   get Y(): number {
       return this.y;
   }

   get Z(): number | undefined {
       return this.z;
   }

   equals = (other: Point): boolean =>
       this.x === other.x &&
       this.y === other.y &&
       this.z === other.z;

   toString = (): string =>
       `Point(${this.x}, ${this.y}${this.z ? `, ${this.z}` : ''})`;
}