import { z } from 'zod';

export const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MB

export const ACCEPTED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
] as const;

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

export const resumeSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => (ACCEPTED_RESUME_TYPES as readonly string[]).includes(f.type), {
      message: 'Accepted formats: PDF, DOC, DOCX, TXT',
    })
    .refine((f) => f.size <= MAX_RESUME_BYTES, { message: 'File must be 5 MB or smaller' }),
});

export const photoSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(f.type), {
      message: 'Accepted formats: JPEG, PNG, GIF, WebP, SVG',
    })
    .refine((f) => f.size <= MAX_PHOTO_BYTES, { message: 'File must be 2 MB or smaller' }),
});
