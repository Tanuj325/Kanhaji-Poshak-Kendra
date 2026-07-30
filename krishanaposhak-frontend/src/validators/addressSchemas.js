import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be 100 characters or less'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
  addressLine1: z
    .string()
    .min(1, 'Address line 1 is required')
    .max(255, 'Address line 1 must be 255 characters or less'),
  addressLine2: z
    .string()
    .max(255, 'Address line 2 must be 255 characters or less')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be 100 characters or less'),
  state: z
    .string()
    .min(1, 'State is required')
    .max(100, 'State must be 100 characters or less'),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(100, 'Country must be 100 characters or less'),
  postalCode: z
    .string()
    .min(1, 'Postal code is required')
    .max(10, 'Postal code must be 10 characters or less'),
  defaultAddress: z.boolean().optional().default(false),
});

export const addressUpdateSchema = addressSchema.partial();
