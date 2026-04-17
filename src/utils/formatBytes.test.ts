import * as fc from 'fast-check';
import { formatBytes } from './formatBytes';

/**
 * Property 7: `formatBytes` produces a string that round-trips within rounding tolerance
 * Validates: Requirements 4.2
 */
describe('formatBytes', () => {
  it('returns a non-empty string for any non-negative byte count', () => {
    fc.assert(
      fc.property(fc.nat(), (bytes) => {
        const result = formatBytes(bytes);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      }),
      { numRuns: 100 }
    );
  });

  it('Property 7: round-trips within rounding tolerance', () => {
    fc.assert(
      fc.property(fc.nat(), (bytes) => {
        const result = formatBytes(bytes);
        const parts = result.split(' ');
        const numericPart = parseFloat(parts[0]);
        const unit = parts[1];

        let factor: number;
        switch (unit) {
          case 'B':
            factor = 1;
            break;
          case 'KB':
            factor = 1024;
            break;
          case 'MB':
            factor = 1024 * 1024;
            break;
          case 'GB':
            factor = 1024 * 1024 * 1024;
            break;
          default:
            factor = 1;
        }

        // The numeric prefix × unit factor should equal original bytes within one-unit rounding tolerance
        const reconstructed = numericPart * factor;
        const tolerance = 0.1 * factor; // 0.1 units at the chosen scale (toFixed(1) precision)
        expect(Math.abs(reconstructed - bytes)).toBeLessThanOrEqual(tolerance);
      }),
      { numRuns: 100 }
    );
  });

  it('formats bytes correctly for known values', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1_258_291)).toBe('1.2 MB');
    expect(formatBytes(1_073_741_824)).toBe('1.0 GB');
  });
});
