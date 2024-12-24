// Angle.ts remains the same...

// Distance.ts
export class Distance {
    private static readonly METERS_TO_NM = 0.000539957;

    constructor(private readonly meters: number) {}

    inMeters(): number {
        return this.meters;
    }

    inKilometers(): number {
        return this.meters / 1000;
    }

    inCentimeters(): number {
        return this.meters * 100;
    }

    inMiles(): number {
        return this.meters * 0.000621371;
    }

    inFeet(): number {
        return this.meters * 3.28084;
    }

    inYards(): number {
        return this.meters * 1.09361;
    }

    inNauticalMiles(): number {
        return this.meters * Distance.METERS_TO_NM;
    }

    static fromMeters(meters: number): Distance {
        return new Distance(meters);
    }

    static fromKilometers(km: number): Distance {
        return new Distance(km * 1000);
    }

    static fromMiles(miles: number): Distance {
        return new Distance(miles / 0.000621371);
    }

    static fromNauticalMiles(nm: number): Distance {
        return new Distance(nm / Distance.METERS_TO_NM);
    }

    static fromFeet(feet: number): Distance {
        return new Distance(feet / 3.28084);
    }

    toString(): string {
        return `${this.inKilometers().toFixed(2)} km`;
    }

    toFormat(unit: 'km' | 'mi' | 'nm' | 'ft' | 'm'): string {
        switch(unit) {
            case 'km': return `${this.inKilometers().toFixed(2)} km`;
            case 'mi': return `${this.inMiles().toFixed(2)} mi`;
            case 'nm': return `${this.inNauticalMiles().toFixed(2)} nm`;
            case 'ft': return `${this.inFeet().toFixed(2)} ft`;
            case 'm': return `${this.inMeters().toFixed(2)} m`;
        }
    }
}