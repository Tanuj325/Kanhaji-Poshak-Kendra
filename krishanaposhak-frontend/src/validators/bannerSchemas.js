import { z } from 'zod';

// For file validation — used in both create and edit
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const fileSchema = z
  .any()
  .refine(
    (val) => val === null || val === undefined || val instanceof File,
    'File must be a valid image file',
  )
  .refine(
    (val) => {
      if (!val || !(val instanceof File)) return true;
      return ACCEPTED_IMAGE_TYPES.includes(val.type);
    },
    'File must be JPEG, PNG, WebP, or GIF',
  )
  .refine(
    (val) => {
      if (!val || !(val instanceof File)) return true;
      return val.size <= MAX_FILE_SIZE;
    },
    'File must be less than 5 MB',
  );

const baseFields = {
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less'),
  subtitle: z
    .string()
    .max(500, 'Subtitle must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  redirectUrl: z
    .string()
    .max(500, 'Redirect URL must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  displayOrder: z
    .union([z.number().int('Display order must be a whole number').min(0, 'Display order cannot be negative'), z.literal('')])
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  active: z.boolean().optional().default(true),
};

export const bannerCreateSchema = z.object({
  ...baseFields,
  file: z
    .any()
    .refine((val) => val instanceof File, 'Banner image is required')
    .refine(
      (val) => ACCEPTED_IMAGE_TYPES.includes(val?.type),
      'File must be JPEG, PNG, WebP, or GIF',
    )
    .refine(
      (val) => val?.size <= MAX_FILE_SIZE,
      'File must be less than 5 MB',
    ),
});

export const bannerEditSchema = z.object({
  ...baseFields,
  file: fileSchema,
});
