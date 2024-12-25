import { GeoError } from "./GeoError.js";

export class GeoValidationError extends GeoError {
    constructor(
        message: string,
        public readonly validationType: string,
        public readonly invalidValue: any,
        cause?: Error
    ) {
        super(message, cause);
    }
}