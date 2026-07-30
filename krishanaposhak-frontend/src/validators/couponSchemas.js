import { z } from 'zod';

export const couponSchema = z.object({
  code: z
    .string()
    .min(1, 'Coupon code is required')
    .max(50, 'Code must be 50 characters or less'),
  description: z.string().optional().or(z.literal('')),
  discountType: z.enum(['PERCENTAGE', 'FLAT'], {
    required_error: 'Discount type is required',
  }),
  discountValue: z
    .number({ required_error: 'Discount value is required' })
    .positive('Discount value must be greater than 0'),
  minimumOrderAmount: z
    .number()
    .min(0, 'Minimum order amount cannot be negative')
    .optional()
    .nullable(),
  maximumDiscountAmount: z
    .number()
    .min(0, 'Maximum discount amount cannot be negative')
    .optional()
    .nullable(),
  usageLimit: z
    .number({ required_error: 'Usage limit is required' })
    .int('Usage limit must be a whole number')
    .min(1, 'Usage limit must be at least 1'),
  perUserLimit: z
    .number({ required_error: 'Per user limit is required' })
    .int('Per user limit must be a whole number')
    .min(1, 'Per user limit must be at least 1'),
  validFrom: z
    .string({ required_error: 'Valid from date is required' })
    .min(1, 'Valid from date is required'),
  validUntil: z
    .string({ required_error: 'Valid until date is required' })
    .min(1, 'Valid until date is required'),
  active: z.boolean().optional().default(true),
});
