import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less')
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less')
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number')
    .optional()
    .or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'KIDS', 'UNISEX']).optional(),
  dateOfBirth: z.string().optional().or(z.literal('')),
});
