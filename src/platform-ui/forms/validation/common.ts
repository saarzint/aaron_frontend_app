import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .refine((val) => emailRegex.test(val), 'Invalid email address');

export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

export const urlSchema = z
  .string()
  .refine((val) => !val || /^https?:\/\/.+/.test(val), 'Invalid URL')
  .optional();

export function requiredString(message = 'This field is required') {
  return z.string().min(1, message);
}

export function emailField(
  requiredMsg = 'Email is required',
  invalidMsg = 'Invalid email address'
) {
  return z
    .string()
    .min(1, requiredMsg)
    .refine((val) => emailRegex.test(val), invalidMsg);
}
