import { z } from 'zod';

const parseRequiredNumber = (val) =>
  val === '' || val === null || val === undefined || Number.isNaN(val) ? undefined : Number(val);

const parseOptionalNumber = (val) =>
  val === '' || val === null || val === undefined || Number.isNaN(val) ? null : Number(val);

export const couponSchema = z.object({
  code: z
    .string()
    .min(1, 'Coupon code is required')
    .max(50, 'Code must be 50 characters or less'),
  description: z.string().optional().or(z.literal('')),
  discountType: z.enum(['PERCENTAGE', 'FLAT'], {
    required_error: 'Discount type is required',
  }),
  discountValue: z.preprocess(
    parseRequiredNumber,
    z
      .number({ required_error: 'Discount value is required', invalid_type_error: 'Discount value must be a valid number' })
      .positive('Discount value must be greater than 0')
  ),
  minimumOrderAmount: z.preprocess(
    parseOptionalNumber,
    z
      .number({ invalid_type_error: 'Minimum order amount must be a valid number' })
      .min(0, 'Minimum order amount cannot be negative')
      .nullable()
      .optional()
  ),
  maximumDiscountAmount: z.preprocess(
    parseOptionalNumber,
    z
      .number({ invalid_type_error: 'Maximum discount amount must be a valid number' })
      .min(0, 'Maximum discount amount cannot be negative')
      .nullable()
      .optional()
  ),
  usageLimit: z.preprocess(
    parseRequiredNumber,
    z
      .number({ required_error: 'Usage limit is required', invalid_type_error: 'Usage limit must be a valid number' })
      .int('Usage limit must be a whole number')
      .min(1, 'Usage limit must be at least 1')
  ),
  perUserLimit: z.preprocess(
    parseRequiredNumber,
    z
      .number({ required_error: 'Per user limit is required', invalid_type_error: 'Per user limit must be a valid number' })
      .int('Per user limit must be a whole number')
      .min(1, 'Per user limit must be at least 1')
  ),
  validFrom: z
    .string({ required_error: 'Valid from date is required' })
    .min(1, 'Valid from date is required'),
  validUntil: z
    .string({ required_error: 'Valid until date is required' })
    .min(1, 'Valid until date is required'),
  active: z.boolean().optional().default(true),
});
