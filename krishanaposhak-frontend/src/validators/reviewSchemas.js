import { z } from 'zod';

export const reviewSchema = z.object({
  productId: z
    .number({ required_error: 'Product is required' })
    .positive('Product is required')
    .optional(),
  rating: z
    .number({ required_error: 'Rating is required' })
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z
    .string()
    .min(1, 'Comment is required')
    .max(1000, 'Comment must be 1000 characters or less'),
});
