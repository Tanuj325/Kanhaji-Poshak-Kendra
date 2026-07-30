import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Name must be 100 characters or less'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be 100 characters or less'),
  description: z.string().optional().or(z.literal('')),
  imageUrl: z.string().optional().or(z.literal('')),
  parentCategoryId: z.coerce.number().int().positive().optional().nullable(),
  displayOrder: z.coerce
    .number({ invalid_type_error: 'Display order must be a number' })
    .int('Display order must be a whole number')
    .min(0, 'Display order cannot be negative')
    .optional(),
  active: z.boolean().optional().default(true),
});
