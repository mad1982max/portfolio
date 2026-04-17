import * as fc from 'fast-check';
import { simulateUpload } from './uploadSimulation';

/**
 * Property 5: Simulated upload progress is monotonically non-decreasing
 * Validates: Requirements 3.1, 3.2
 */
describe('simulateUpload', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Property 5: progress is monotonically non-decreasing, starts at 0, ends at 100', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const progressValues: number[] = [];

        const promise = simulateUpload((p) => progressValues.push(p));

        jest.runAllTimers();

        await promise;

        expect(progressValues.length).toBeGreaterThan(0);
        expect(progressValues[0]).toBe(0);
        expect(progressValues[progressValues.length - 1]).toBe(100);

        for (let i = 1; i < progressValues.length; i++) {
          expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]);
        }
      }),
      { numRuns: 10 }
    );
  });

  it('resolves when progress reaches 100', async () => {
    const progressValues: number[] = [];
    const promise = simulateUpload((p) => progressValues.push(p));

    jest.runAllTimers();

    await expect(promise).resolves.toBeUndefined();
    expect(progressValues[progressValues.length - 1]).toBe(100);
  });
});
