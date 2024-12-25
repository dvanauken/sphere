// GeoValidationError test file 
import { describe, it, expect } from 'vitest';
import { GeoValidationError, GeoError } from '../../../src/index.js';
import { TEST_CATEGORIES } from '../../__helpers__/constants.js';
describe('GeoValidationError', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should create error with all parameters', () => {
            const error = new GeoValidationError('Invalid coordinate', 'latitude', 91, new Error('Cause'));
            expect(error.message).toBe('Invalid coordinate');
            expect(error.validationType).toBe('latitude');
            expect(error.invalidValue).toBe(91);
            expect(error.cause).toBeInstanceOf(Error);
        });
        it('should create error without cause', () => {
            const error = new GeoValidationError('Invalid coordinate', 'latitude', 91);
            expect(error.message).toBe('Invalid coordinate');
            expect(error.validationType).toBe('latitude');
            expect(error.invalidValue).toBe(91);
            expect(error.cause).toBeUndefined();
        });
    });
    describe('Error Properties', () => {
        it('should have correct name', () => {
            const error = new GeoValidationError('Invalid coordinate', 'latitude', 91);
            expect(error.name).toBe('GeoValidationError');
        });
        it('should have correct inheritance chain', () => {
            const error = new GeoValidationError('Invalid coordinate', 'latitude', 91);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(GeoError);
            expect(error).toBeInstanceOf(GeoValidationError);
        });
        it('should expose validation details', () => {
            const error = new GeoValidationError('Invalid coordinate', 'latitude', 91);
            expect(error.validationType).toBe('latitude');
            expect(error.invalidValue).toBe(91);
        });
    });
    describe('Usage with Different Types', () => {
        it('should handle numeric invalid values', () => {
            const error = new GeoValidationError('Invalid coordinate', 'latitude', 91);
            expect(error.invalidValue).toBe(91);
        });
        it('should handle string invalid values', () => {
            const error = new GeoValidationError('Invalid coordinate', 'format', 'invalid-format');
            expect(error.invalidValue).toBe('invalid-format');
        });
        it('should handle object invalid values', () => {
            const invalidObj = { lat: 91, lon: 0 };
            const error = new GeoValidationError('Invalid coordinate', 'coordinate', invalidObj);
            expect(error.invalidValue).toBe(invalidObj);
        });
        it('should handle array invalid values', () => {
            const invalidArray = [91, 0];
            const error = new GeoValidationError('Invalid coordinate', 'coordinates', invalidArray);
            expect(error.invalidValue).toBe(invalidArray);
        });
    });
    describe(TEST_CATEGORIES.ERROR_HANDLING, () => {
        it('should handle empty strings', () => {
            const error = new GeoValidationError('', '', '');
            expect(error.message).toBe('');
            expect(error.validationType).toBe('');
            expect(error.invalidValue).toBe('');
        });
        it('should handle undefined cause', () => {
            const error = new GeoValidationError('Invalid coordinate', 'latitude', 91, undefined);
            expect(error.cause).toBeUndefined();
        });
        it('should handle non-Error cause', () => {
            const error = new GeoValidationError('Invalid coordinate', 'latitude', 91, 'Not an error');
            expect(error.cause).toBe('Not an error');
        });
        it('should handle null invalid values', () => {
            const error = new GeoValidationError('Invalid coordinate', 'coordinate', null);
            expect(error.invalidValue).toBeNull();
        });
        it('should handle undefined invalid values', () => {
            const error = new GeoValidationError('Invalid coordinate', 'coordinate', undefined);
            expect(error.invalidValue).toBeUndefined();
        });
    });
});
