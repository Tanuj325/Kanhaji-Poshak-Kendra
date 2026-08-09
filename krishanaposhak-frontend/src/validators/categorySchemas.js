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
  description: z.string().optional().or(z.literal('')).nullable(),
  imageUrl: z.string().optional().or(z.literal('')).nullable(),
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
