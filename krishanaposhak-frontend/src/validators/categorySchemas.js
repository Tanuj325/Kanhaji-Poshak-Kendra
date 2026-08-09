import { z } from 'zod';

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

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Name must be 100 characters or less'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be 100 characters or less'),
  description: z.string().optional().or(z.literal('')).nullable(),
  file: fileSchema,
  parentCategoryId: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
    z.number().int().positive().nullable().optional()
  ),
  displayOrder: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().int('Display order must be a whole number').min(0, 'Display order cannot be negative').optional().nullable()
  ),
  active: z.boolean().optional().default(true),
});
