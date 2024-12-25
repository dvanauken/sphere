import { Distance } from "./Distance.js";

export class Sphere {
    private static readonly DEFAULT_RADIUS = Distance.fromKilometers(6371);

    static getRadius = (radius?: Distance): Distance => 
        radius ?? Sphere.DEFAULT_RADIUS;

    static surfaceAreaFromRadius = (radius: Distance): number => 
        4 * Math.PI * Math.pow(radius.inMeters() / 1000, 2);

    static volumeFromRadius = (radius: Distance): number => 
        (4/3) * Math.PI * Math.pow(radius.inMeters() / 1000, 3);
}

