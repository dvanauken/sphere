import { GeoError } from "./GeoError.js";

export class GeoConversionError extends GeoError {
    constructor(
        message: string,
        public readonly sourceType: string,
        public readonly targetType: string,
        cause?: Error
    ) {
        super(message, cause);
    }
}