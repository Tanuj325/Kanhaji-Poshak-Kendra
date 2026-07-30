import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(150, 'Name must be 150 characters or less'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(180, 'Slug must be 180 characters or less'),
  shortDescription: z
    .string()
    .min(1, 'Short description is required')
    .max(300, 'Short description must be 300 characters or less'),
  description: z.string().optional().or(z.literal('')),
  categoryId: z
    .number({ invalid_type_error: 'Category is required' })
    .positive('Category is required'),
  material: z.string().optional().or(z.literal('')),
  careInstructions: z.string().optional().or(z.literal('')),
  featured: z.boolean().optional().default(false),
  newArrival: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
});

export const productVariantSchema = z.object({
  size: z.enum(['0','1','2','3','4','5','6','7','8','9','10','11','12','CUSTOM'], {
    required_error: 'Size is required',
    invalid_type_error: 'Invalid size',
  }),
  price: z
    .number({ required_error: 'Price is required' })
    .positive('Price must be greater than 0'),
  discountPrice: z
    .number()
    .min(0, 'Discount price cannot be negative')
    .optional()
    .nullable(),
  stock: z
    .number({ required_error: 'Stock is required' })
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  sku: z.string().optional().or(z.literal('')),
  active: z.boolean().optional().default(true),
});
