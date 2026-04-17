import * as fc from 'fast-check';
import {
  resumeSchema,
  photoSchema,
  ACCEPTED_RESUME_TYPES,
  ACCEPTED_IMAGE_TYPES,
  MAX_RESUME_BYTES,
  MAX_PHOTO_BYTES,
} from './uploadSchemas';

// Helper to create a mock File with given type and size
function makeFile(type: string, size: number): File {
  const content = new Uint8Array(size);
  return new File([content], 'test-file', { type });
}

/**
 * Property 1: Resume MIME type validation is exhaustive
 * Validates: Requirements 1.1, 1.2
 */
describe('resumeSchema - MIME type validation', () => {
  it('Property 1: succeeds iff MIME type is in ACCEPTED_RESUME_TYPES', () => {
    fc.assert(
      fc.property(fc.string(), (mimeType) => {
        const file = makeFile(mimeType, 100);
        const result = resumeSchema.safeParse({ file });
        const isAccepted = (ACCEPTED_RESUME_TYPES as readonly string[]).includes(mimeType);

        if (isAccepted) {
          expect(result.success).toBe(true);
        } else {
          expect(result.success).toBe(false);
          if (!result.success) {
            const messages = result.error.issues.map((i) => i.message);
            expect(messages.some((m) => m.includes('Accepted formats'))).toBe(true);
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 2: Photo MIME type validation is exhaustive
 * Validates: Requirements 2.1, 2.2
 */
describe('photoSchema - MIME type validation', () => {
  it('Property 2: succeeds iff MIME type is in ACCEPTED_IMAGE_TYPES', () => {
    fc.assert(
      fc.property(fc.string(), (mimeType) => {
        const file = makeFile(mimeType, 100);
        const result = photoSchema.safeParse({ file });
        const isAccepted = (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(mimeType);

        if (isAccepted) {
          expect(result.success).toBe(true);
        } else {
          expect(result.success).toBe(false);
          if (!result.success) {
            const messages = result.error.issues.map((i) => i.message);
            expect(messages.some((m) => m.includes('Accepted formats'))).toBe(true);
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 3: Resume size limit is enforced at the boundary
 * Validates: Requirements 1.3
 */
describe('resumeSchema - size limit', () => {
  it('Property 3: succeeds iff size <= MAX_RESUME_BYTES', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 10 * 1024 * 1024 }), (size) => {
        const file = makeFile('application/pdf', size);
        const result = resumeSchema.safeParse({ file });

        if (size <= MAX_RESUME_BYTES) {
          expect(result.success).toBe(true);
        } else {
          expect(result.success).toBe(false);
          if (!result.success) {
            const messages = result.error.issues.map((i) => i.message);
            expect(messages.some((m) => m.includes('5 MB'))).toBe(true);
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 4: Photo size limit is enforced at the boundary
 * Validates: Requirements 2.3
 */
describe('photoSchema - size limit', () => {
  it('Property 4: succeeds iff size <= MAX_PHOTO_BYTES', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 4 * 1024 * 1024 }), (size) => {
        const file = makeFile('image/jpeg', size);
        const result = photoSchema.safeParse({ file });

        if (size <= MAX_PHOTO_BYTES) {
          expect(result.success).toBe(true);
        } else {
          expect(result.success).toBe(false);
          if (!result.success) {
            const messages = result.error.issues.map((i) => i.message);
            expect(messages.some((m) => m.includes('2 MB'))).toBe(true);
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});
