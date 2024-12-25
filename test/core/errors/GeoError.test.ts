// GeoError test file 
import { describe, it, expect } from 'vitest';
import { GeoError } from '../../../src/index.js';
import { TEST_CATEGORIES } from '../../__helpers__/constants.js';

// Create a concrete implementation of GeoError for testing
class TestGeoError extends GeoError {
    constructor(message: string, cause?: Error) {
        super(message, cause);
    }
}

describe('GeoError', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should create error with message', () => {
            const message = 'Test error message';
            const error = new TestGeoError(message);
            
            expect(error.message).toBe(message);
            expect(error.name).toBe('TestGeoError');
            expect(error instanceof Error).toBe(true);
            expect(error instanceof GeoError).toBe(true);
        });

        it('should create error with message and cause', () => {
            const message = 'Test error message';
            const cause = new Error('Cause error');
            const error = new TestGeoError(message, cause);
            
            expect(error.message).toBe(message);
            expect(error.cause).toBe(cause);
        });
    });

    describe('Error Properties', () => {
        it('should have correct name', () => {
            const error = new TestGeoError('Test error');
            expect(error.name).toBe('TestGeoError');
        });

        it('should have correct inheritance chain', () => {
            const error = new TestGeoError('Test error');
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(GeoError);
            expect(error).toBeInstanceOf(TestGeoError);
        });

        it('should be throwable', () => {
            expect(() => {
                throw new TestGeoError('Test error');
            }).toThrow(TestGeoError);
        });
    });

    describe('Stack Trace', () => {
        it('should maintain stack trace', () => {
            const error = new TestGeoError('Test error');
            expect(error.stack).toBeDefined();
        });

        it('should include cause in stack trace when provided', () => {
            const cause = new Error('Cause error');
            const error = new TestGeoError('Test error', cause);
            expect(error.stack).toContain('Test error');
            expect(error.cause).toBe(cause);
        });
    });

    describe(TEST_CATEGORIES.ERROR_HANDLING, () => {
        it('should handle empty message', () => {
            const error = new TestGeoError('');
            expect(error.message).toBe('');
        });

        it('should handle undefined cause', () => {
            const error = new TestGeoError('Test error', undefined);
            expect(error.cause).toBeUndefined();
        });

        it('should handle non-Error cause', () => {
            const error = new TestGeoError('Test error', 'Not an error' as any);
            expect(error.cause).toBe('Not an error');
        });
    });
});