// GeoConversionError test file 
import { describe, it, expect } from 'vitest';
import { GeoConversionError } from '../../../src/core/errors/GeoConversionError';
import { GeoError } from '../../../src/core/errors/GeoError';
import { TEST_CATEGORIES } from '../../__helpers__/constants';

describe('GeoConversionError', () => {
    describe(TEST_CATEGORIES.CONSTRUCTOR, () => {
        it('should create error with all parameters', () => {
            const error = new GeoConversionError(
                'Conversion failed',
                'Coordinate',
                'GeoJSON',
                new Error('Cause')
            );
            
            expect(error.message).toBe('Conversion failed');
            expect(error.sourceType).toBe('Coordinate');
            expect(error.targetType).toBe('GeoJSON');
            expect(error.cause).toBeInstanceOf(Error);
        });

        it('should create error without cause', () => {
            const error = new GeoConversionError(
                'Conversion failed',
                'Coordinate',
                'GeoJSON'
            );
            
            expect(error.message).toBe('Conversion failed');
            expect(error.sourceType).toBe('Coordinate');
            expect(error.targetType).toBe('GeoJSON');
            expect(error.cause).toBeUndefined();
        });
    });

    describe('Error Properties', () => {
        it('should have correct name', () => {
            const error = new GeoConversionError(
                'Conversion failed',
                'Coordinate',
                'GeoJSON'
            );
            expect(error.name).toBe('GeoConversionError');
        });

        it('should have correct inheritance chain', () => {
            const error = new GeoConversionError(
                'Conversion failed',
                'Coordinate',
                'GeoJSON'
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(GeoError);
            expect(error).toBeInstanceOf(GeoConversionError);
        });

        it('should expose source and target types', () => {
            const error = new GeoConversionError(
                'Conversion failed',
                'Coordinate',
                'GeoJSON'
            );
            expect(error.sourceType).toBe('Coordinate');
            expect(error.targetType).toBe('GeoJSON');
        });
    });

    describe('Usage Patterns', () => {
        it('should work in try-catch block', () => {
            expect(() => {
                throw new GeoConversionError(
                    'Conversion failed',
                    'Coordinate',
                    'GeoJSON'
                );
            }).toThrow(GeoConversionError);
        });

        it('should maintain error chain with cause', () => {
            const cause = new Error('Original error');
            const error = new GeoConversionError(
                'Conversion failed',
                'Coordinate',
                'GeoJSON',
                cause
            );
            
            expect(error.cause).toBe(cause);
            expect(error.message).toBe('Conversion failed');
        });
    });

    describe(TEST_CATEGORIES.ERROR_HANDLING, () => {
        it('should handle empty strings', () => {
            const error = new GeoConversionError('', '', '');
            expect(error.message).toBe('');
            expect(error.sourceType).toBe('');
            expect(error.targetType).toBe('');
        });

        it('should handle undefined cause', () => {
            const error = new GeoConversionError(
                'Conversion failed',
                'Coordinate',
                'GeoJSON',
                undefined
            );
            expect(error.cause).toBeUndefined();
        });

        it('should handle non-Error cause', () => {
            const error = new GeoConversionError(
                'Conversion failed',
                'Coordinate',
                'GeoJSON',
                'Not an error' as any
            );
            expect(error.cause).toBe('Not an error');
        });
    });
});