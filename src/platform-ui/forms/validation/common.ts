import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export function passwordField(message = 'Password must be at least 8 characters', minLength = 8) {
  return z.string().min(minLength, message);
}

export function urlField(message = 'Invalid URL') {
  return z
    .string()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), message)
    .optional();
}
